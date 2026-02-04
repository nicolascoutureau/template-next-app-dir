import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import type { TransitionSpec } from "./types";

export interface SceneTransitionRendererProps {
  /** The outgoing scene element */
  from: React.ReactNode;
  /** The incoming scene element */
  to: React.ReactNode;
  /** Transition progress from 0 to 1 */
  progress: number;
  /** Transition mode/specification */
  mode: TransitionSpec;
}

// =============================================================================
// SHARED VERTEX SHADER (Clip Space)
// =============================================================================

// This vertex shader ignores the camera and positions the quad 
// to cover the entire screen in clip space (-1 to 1)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// =============================================================================
// TRANSITION FRAGMENT SHADERS
// =============================================================================

const fadeFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec4 colorFrom = texture2D(uTextureFrom, vUv);
    vec4 colorTo = texture2D(uTextureTo, vUv);
    
    // Blend in Linear space (textures are already Linear)
    vec4 blended = mix(colorFrom, colorTo, uProgress);
    
    gl_FragColor = blended;
    
    // Tonemapping will be applied by the main renderer to this result
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const wipeFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform int uDirection; // 0=left, 1=right, 2=up, 3=down
  uniform float uSoftness;
  varying vec2 vUv;

  void main() {
    vec4 colorFrom = texture2D(uTextureFrom, vUv);
    vec4 colorTo = texture2D(uTextureTo, vUv);
    
    float edge;
    if (uDirection == 0) { edge = vUv.x; }
    else if (uDirection == 1) { edge = 1.0 - vUv.x; }
    else if (uDirection == 2) { edge = 1.0 - vUv.y; }
    else { edge = vUv.y; }
    
    float mask = smoothstep(uProgress - uSoftness, uProgress + uSoftness, edge);
    
    vec4 blended = mix(colorTo, colorFrom, mask);
    gl_FragColor = blended;
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const dissolveFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uSeed;
  uniform float uSoftness;
  varying vec2 vUv;

  // Simplex noise for organic dissolve
  vec3 mod289_n(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289_n(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289_n(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289_n(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec4 colorFrom = texture2D(uTextureFrom, vUv);
    vec4 colorTo = texture2D(uTextureTo, vUv);
    
    // Multi-octave noise
    float noise = snoise(vUv * 8.0 + uSeed) * 0.5 + 0.5;
    noise += snoise(vUv * 16.0 + uSeed * 2.0) * 0.25;
    noise += snoise(vUv * 32.0 + uSeed * 3.0) * 0.125;
    noise = noise / 1.875; 
    
    float mask = smoothstep(uProgress - uSoftness, uProgress + uSoftness, noise);
    
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const glitchFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uSeed;
  uniform float uIntensity;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float glitchAmount = sin(uProgress * 3.14159) * uIntensity;
    
    // Horizontal slice displacement
    float sliceY = floor(uv.y * 20.0) / 20.0;
    float slice = rand(vec2(sliceY, uSeed));
    if (slice > 0.7) {
      uv.x += (rand(vec2(sliceY + uProgress, uSeed)) - 0.5) * glitchAmount * 0.3;
    }
    
    // RGB channel splitting
    float rgbOffset = glitchAmount * 0.02;
    vec4 colorFrom, colorTo;
    
    colorFrom.r = texture2D(uTextureFrom, uv + vec2(rgbOffset, 0.0)).r;
    colorFrom.g = texture2D(uTextureFrom, uv).g;
    colorFrom.b = texture2D(uTextureFrom, uv - vec2(rgbOffset, 0.0)).b;
    colorFrom.a = 1.0;
    
    colorTo.r = texture2D(uTextureTo, uv + vec2(rgbOffset, 0.0)).r;
    colorTo.g = texture2D(uTextureTo, uv).g;
    colorTo.b = texture2D(uTextureTo, uv - vec2(rgbOffset, 0.0)).b;
    colorTo.a = 1.0;
    
    vec4 blended = mix(colorFrom, colorTo, uProgress);
    
    // Add effects in linear space
    float scanLine = sin(uv.y * 800.0) * 0.04 * glitchAmount;
    float noise = (rand(uv * 100.0 + uProgress) - 0.5) * glitchAmount * 0.2;
    blended.rgb += scanLine + noise;
    
    gl_FragColor = blended;
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const pixelateFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uPixelSize;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    // Pixel size peaks at midpoint
    float pixelAmount = sin(uProgress * 3.14159) * uPixelSize;
    float pixels = max(1.0, pixelAmount);
    
    vec2 pixelatedUv = floor(vUv * uResolution / pixels) * pixels / uResolution;
    
    vec4 colorFrom = texture2D(uTextureFrom, pixelatedUv);
    vec4 colorTo = texture2D(uTextureTo, pixelatedUv);
    
    gl_FragColor = mix(colorFrom, colorTo, uProgress);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const zoomFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    
    // Zoom from scene scales up and blurs out
    float zoomFrom = 1.0 + uProgress * uIntensity;
    vec2 uvFrom = center + (vUv - center) / zoomFrom;
    
    // Zoom to scene scales down from larger
    float zoomTo = 1.0 + (1.0 - uProgress) * uIntensity;
    vec2 uvTo = center + (vUv - center) / zoomTo;
    
    // Sample with slight blur via multiple samples
    vec4 colorFrom = vec4(0.0);
    vec4 colorTo = vec4(0.0);
    
    float blurFrom = uProgress * 0.01 * uIntensity;
    float blurTo = (1.0 - uProgress) * 0.01 * uIntensity;
    
    // Box blur samples
    for (float x = -1.0; x <= 1.0; x += 1.0) {
      for (float y = -1.0; y <= 1.0; y += 1.0) {
        colorFrom += texture2D(uTextureFrom, uvFrom + vec2(x, y) * blurFrom);
        colorTo += texture2D(uTextureTo, uvTo + vec2(x, y) * blurTo);
      }
    }
    colorFrom /= 9.0;
    colorTo /= 9.0;
    
    gl_FragColor = mix(colorFrom, colorTo, uProgress);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const flipFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform int uDirection; // 0=horizontal, 1=vertical
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Flip around center
    float angle = uProgress * 3.14159;
    float scale = abs(cos(angle));
    
    if (uDirection == 0) { // horizontal
      uv.x = 0.5 + (uv.x - 0.5) / max(scale, 0.001);
    } else { // vertical
      uv.y = 0.5 + (uv.y - 0.5) / max(scale, 0.001);
    }
    
    // Check if UV is out of bounds (edge of flip)
    bool outOfBounds = uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0;
    
    vec4 color;
    if (outOfBounds) {
      color = vec4(0.0, 0.0, 0.0, 1.0);
    } else if (uProgress < 0.5) {
      color = texture2D(uTextureFrom, uv);
    } else {
      // Mirror UV for back side
      if (uDirection == 0) {
        uv.x = 1.0 - uv.x;
      } else {
        uv.y = 1.0 - uv.y;
      }
      color = texture2D(uTextureTo, uv);
    }
    
    // Add subtle shadow at edges during flip
    float shadow = 1.0 - sin(uProgress * 3.14159) * 0.3;
    color.rgb *= shadow;
    
    gl_FragColor = color;
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * SceneTransitionRenderer - GPU-accelerated transitions using FBOs and shaders.
 * 
 * Renders both scenes to offscreen render targets, then blends them using
 * custom shader materials for each transition type.
 */
export const SceneTransitionRenderer: React.FC<SceneTransitionRendererProps> = ({
  from,
  to,
  progress,
  mode,
}) => {
  const { size, camera, gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const dpr = gl.getPixelRatio();

  // Create FBOs for both scenes
  // Use SRGBColorSpace to ensure rendered content is correctly encoded
  const fboFrom = useFBO(size.width * dpr, size.height * dpr, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType, // Standard type prevents some HDR issues
    colorSpace: THREE.SRGBColorSpace,
  });

  const fboTo = useFBO(size.width * dpr, size.height * dpr, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    colorSpace: THREE.SRGBColorSpace,
  });

  // Create scenes for portals
  const sceneFrom = useMemo(() => new THREE.Scene(), []);
  const sceneTo = useMemo(() => new THREE.Scene(), []);

  // Get shader and uniforms based on transition type
  const { fragmentShader, uniforms } = useMemo(() => {
    const baseUniforms = {
      uTextureFrom: { value: fboFrom.texture },
      uTextureTo: { value: fboTo.texture },
      uProgress: { value: 0 },
    };

    switch (mode.type) {
      case "fade":
        return {
          fragmentShader: fadeFragmentShader,
          uniforms: baseUniforms,
        };

      case "wipe":
        return {
          fragmentShader: wipeFragmentShader,
          uniforms: {
            ...baseUniforms,
            uDirection: {
              value:
                mode.direction === "left" ? 0 :
                  mode.direction === "right" ? 1 :
                    mode.direction === "up" ? 2 : 3,
            },
            uSoftness: { value: 0.02 },
          },
        };

      case "dissolve":
        return {
          fragmentShader: dissolveFragmentShader,
          uniforms: {
            ...baseUniforms,
            uSeed: { value: mode.seed ?? 0 },
            uSoftness: { value: mode.softness ?? 0.08 },
          },
        };

      case "glitch":
        return {
          fragmentShader: glitchFragmentShader,
          uniforms: {
            ...baseUniforms,
            uSeed: { value: mode.seed ?? 0 },
            uIntensity: { value: mode.intensity ?? 0.5 },
          },
        };

      case "pixelate":
        return {
          fragmentShader: pixelateFragmentShader,
          uniforms: {
            ...baseUniforms,
            uPixelSize: { value: mode.size ?? 10 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
          },
        };

      case "zoom":
        return {
          fragmentShader: zoomFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 0.3 },
          },
        };

      case "flip":
        return {
          fragmentShader: flipFragmentShader,
          uniforms: {
            ...baseUniforms,
            uDirection: { value: mode.direction === "horizontal" ? 0 : 1 },
          },
        };

      default:
        return {
          fragmentShader: fadeFragmentShader,
          uniforms: baseUniforms,
        };
    }
  }, [mode, fboFrom.texture, fboTo.texture, size.width, size.height]);

  // Update uniforms every frame
  useFrame(({ gl }) => {
    // Save previous state
    const originalTarget = gl.getRenderTarget();
    const originalToneMapping = gl.toneMapping;
    const originalOutputColorSpace = gl.outputColorSpace;

    // Disable tone mapping/encoding for intermediate FBO render
    // We want Linear HDR data in the FBOs
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.LinearSRGBColorSpace;

    // Render "from" scene to FBO
    gl.setRenderTarget(fboFrom);
    gl.render(sceneFrom, camera);

    // Render "to" scene to FBO
    gl.setRenderTarget(fboTo);
    gl.render(sceneTo, camera);

    // Restore original state for final render
    gl.toneMapping = originalToneMapping;
    gl.outputColorSpace = originalOutputColorSpace;
    gl.setRenderTarget(originalTarget);

    // Update progress uniform
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgress.value = progress;
    }
  });

  return (
    <>
      {/* Portal for "from" scene */}
      {createPortal(
        <>{from}</>,
        sceneFrom
      )}

      {/* Portal for "to" scene */}
      {createPortal(
        <>{to}</>,
        sceneTo
      )}

      {/* Fullscreen quad with transition shader */}
      {/* Render order is important for transparency */}
      <mesh ref={meshRef} renderOrder={1000} frustumCulled={false}>
        {/* Plane fills clip space (-1 to 1) via vertex shader */}
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

SceneTransitionRenderer.displayName = "SceneTransitionRenderer";
