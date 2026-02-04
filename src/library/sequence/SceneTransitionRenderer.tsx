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
// AKELLA-STYLE CREATIVE TRANSITIONS
// Inspired by https://github.com/akella/webGLImageTransitions
// =============================================================================

// Morph transition - organic wave distortion with noise-based reveal
const morphFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m * m * m;
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
    // Calculate distortion based on progress - peaks at 0.5
    float distortionAmount = sin(uProgress * 3.14159) * uIntensity;
    
    // Create wave distortion using noise
    vec2 distortion = vec2(
      snoise(vUv * 10.0 + uProgress * 2.0),
      snoise(vUv * 10.0 + 100.0 + uProgress * 2.0)
    ) * distortionAmount;
    
    // Use noise as reveal mask (not crossfade)
    float noise = snoise(vUv * 8.0) * 0.5 + 0.5;
    noise += snoise(vUv * 16.0) * 0.25;
    noise = noise / 1.25;
    
    // Threshold for reveal
    float threshold = uProgress * 1.4 - 0.2; // Expand range for smoother edges
    float mask = smoothstep(threshold - 0.1, threshold + 0.1, noise);
    
    // Apply distortion to both textures
    vec2 uvFrom = vUv + distortion * mask;
    vec2 uvTo = vUv + distortion * (1.0 - mask);
    
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uvFrom, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uvTo, 0.0, 1.0));
    
    // Hard reveal based on noise mask
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Directional Warp - stretches/compresses with directional reveal
const directionalWarpFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform int uDirection; // 0=left, 1=right, 2=up, 3=down
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    // Warp amount peaks at midpoint
    float warpAmount = sin(uProgress * 3.14159) * uIntensity;
    
    // Calculate reveal edge based on direction
    float edge;
    if (uDirection == 0) { edge = 1.0 - vUv.x; }      // left: reveal from right
    else if (uDirection == 1) { edge = vUv.x; }       // right: reveal from left
    else if (uDirection == 2) { edge = vUv.y; }       // up: reveal from bottom
    else { edge = 1.0 - vUv.y; }                      // down: reveal from top
    
    // Reveal mask with soft edge
    float mask = smoothstep(uProgress - 0.1, uProgress + 0.1, edge);
    
    // Apply directional warp distortion
    vec2 uvFrom = vUv;
    vec2 uvTo = vUv;
    
    if (uDirection == 0 || uDirection == 1) {
      float warp = warpAmount * (1.0 - abs(edge - uProgress) * 2.0);
      uvFrom.x += warp * 0.3 * mask;
      uvTo.x -= warp * 0.3 * (1.0 - mask);
    } else {
      float warp = warpAmount * (1.0 - abs(edge - uProgress) * 2.0);
      uvFrom.y += warp * 0.3 * mask;
      uvTo.y -= warp * 0.3 * (1.0 - mask);
    }
    
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uvFrom, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uvTo, 0.0, 1.0));
    
    // Hard reveal based on directional mask
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Swirl transition - vortex effect with radial reveal
const swirlFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    vec2 toCenter = vUv - center;
    float dist = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);
    
    // Swirl amount peaks at midpoint
    float swirlAmount = sin(uProgress * 3.14159) * uIntensity * 3.14159;
    
    // Swirl more at center, less at edges
    float swirlFactor = swirlAmount * (1.0 - smoothstep(0.0, 0.7, dist));
    
    // Radial reveal mask - expands from center
    float revealRadius = uProgress * 1.2; // Slightly larger than 1.0 for full coverage
    float mask = smoothstep(revealRadius - 0.15, revealRadius + 0.05, dist);
    
    // Apply swirl rotation
    vec2 uvFrom = center + dist * vec2(
      cos(angle + swirlFactor),
      sin(angle + swirlFactor)
    );
    vec2 uvTo = center + dist * vec2(
      cos(angle - swirlFactor * 0.5),
      sin(angle - swirlFactor * 0.5)
    );
    
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uvFrom, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uvTo, 0.0, 1.0));
    
    // Hard reveal based on radial mask
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Ripple transition - water ripple effect with expanding reveal
const rippleFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uFrequency;
  uniform float uAmplitude;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center);
    
    // Expanding reveal radius
    float revealRadius = uProgress * 1.2;
    
    // Ripple wave at the edge of reveal
    float edgeDist = abs(dist - revealRadius);
    float rippleAmount = uAmplitude * smoothstep(0.2, 0.0, edgeDist);
    float wave = sin(dist * uFrequency - uProgress * 15.0) * rippleAmount;
    
    // Apply displacement at the reveal edge
    vec2 direction = normalize(vUv - center + 0.001);
    vec2 uv = vUv + direction * wave;
    
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uv, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uv, 0.0, 1.0));
    
    // Hard reveal based on expanding circle
    float mask = smoothstep(revealRadius - 0.05, revealRadius + 0.05, dist);
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Lens transition - fish-eye bulge with radial reveal
const lensFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    vec2 toCenter = vUv - center;
    float dist = length(toCenter);
    
    // Lens distortion amount peaks at midpoint
    float lensAmount = sin(uProgress * 3.14159) * uIntensity;
    
    // Fish-eye / barrel distortion formula
    float distortedDist = dist * (1.0 + lensAmount * dist * dist);
    vec2 direction = normalize(toCenter + 0.0001);
    
    vec2 uvDistorted = center + direction * distortedDist;
    
    // Expanding reveal from center
    float revealRadius = uProgress * 1.3;
    float mask = smoothstep(revealRadius - 0.1, revealRadius + 0.1, dist);
    
    // Apply lens distortion to both, reveal with mask
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uvDistorted, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uvDistorted, 0.0, 1.0));
    
    // Hard reveal based on expanding circle
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Wind transition - organic wind-blown effect with horizontal wipe reveal
const windFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Wind strength peaks at midpoint
    float windStrength = sin(uProgress * 3.14159) * uIntensity;
    
    // Create wind noise for jagged edge
    float noiseFreq = 30.0;
    float windNoise = (rand(vec2(floor(vUv.y * noiseFreq), 0.0)) - 0.5) * 0.15;
    windNoise += (rand(vec2(floor(vUv.y * noiseFreq * 2.0), 1.0)) - 0.5) * 0.08;
    
    // Reveal edge with wind-blown jaggedness
    float edge = vUv.x + windNoise * windStrength;
    float mask = smoothstep(uProgress - 0.05, uProgress + 0.05, edge);
    
    // Apply wind distortion near the edge
    float edgeDist = abs(vUv.x - uProgress);
    float distortAmount = windStrength * smoothstep(0.2, 0.0, edgeDist);
    
    vec2 uvFrom = vUv;
    vec2 uvTo = vUv;
    uvFrom.x += distortAmount * 0.1;
    uvTo.x -= distortAmount * 0.1;
    
    // Add vertical wobble near edge
    float wobble = sin(vUv.y * 40.0 + uProgress * 15.0) * distortAmount * 0.02;
    uvFrom.y += wobble;
    uvTo.y -= wobble;
    
    vec4 colorFrom = texture2D(uTextureFrom, clamp(uvFrom, 0.0, 1.0));
    vec4 colorTo = texture2D(uTextureTo, clamp(uvTo, 0.0, 1.0));
    
    // Hard reveal based on wind edge
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Dreamy Zoom transition - soft zoom with blur and radial reveal
const dreamyZoomFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center);
    
    // Dreamy zoom effect
    float zoomFrom = 1.0 + uProgress * uIntensity * 0.5;
    float zoomTo = 1.0 + (1.0 - uProgress) * uIntensity * 0.3;
    
    vec2 uvFrom = center + (vUv - center) / zoomFrom;
    vec2 uvTo = center + (vUv - center) / zoomTo;
    
    // Multi-sample blur near the reveal edge
    float revealRadius = uProgress * 1.2;
    float edgeDist = abs(dist - revealRadius);
    float blurAmount = smoothstep(0.2, 0.0, edgeDist) * uIntensity * 0.015;
    
    vec4 colorFrom = vec4(0.0);
    vec4 colorTo = vec4(0.0);
    
    for (float i = -1.0; i <= 1.0; i += 1.0) {
      for (float j = -1.0; j <= 1.0; j += 1.0) {
        vec2 offset = vec2(i, j) * blurAmount;
        colorFrom += texture2D(uTextureFrom, clamp(uvFrom + offset, 0.0, 1.0));
        colorTo += texture2D(uTextureTo, clamp(uvTo + offset, 0.0, 1.0));
      }
    }
    colorFrom /= 9.0;
    colorTo /= 9.0;
    
    // Soft glow at reveal edge
    float edgeGlow = smoothstep(0.15, 0.0, edgeDist) * uIntensity * 0.15;
    
    // Radial reveal mask
    float mask = smoothstep(revealRadius - 0.1, revealRadius + 0.1, dist);
    
    vec4 result = mix(colorTo, colorFrom, mask);
    result.rgb += edgeGlow;
    
    gl_FragColor = result;
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Cube transition - 3D cube rotation
const cubeFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform int uDirection; // 0=left, 1=right, 2=up, 3=down
  varying vec2 vUv;

  void main() {
    float angle = uProgress * 1.5707963; // PI/2
    
    vec2 uv = vUv;
    vec4 color;
    
    bool showFrom = true;
    
    if (uDirection == 0) { // left
      float x = vUv.x;
      float perspective = 1.0 + x * sin(angle) * 0.5;
      
      if (cos(angle) > 0.0) {
        uv.x = x / cos(angle);
        uv.y = 0.5 + (vUv.y - 0.5) / perspective;
        showFrom = true;
      } else {
        uv.x = 1.0 - (1.0 - x) / (-cos(angle));
        uv.y = 0.5 + (vUv.y - 0.5) / (2.0 - perspective);
        showFrom = false;
      }
    } else if (uDirection == 1) { // right
      float x = 1.0 - vUv.x;
      float perspective = 1.0 + x * sin(angle) * 0.5;
      
      if (cos(angle) > 0.0) {
        uv.x = 1.0 - x / cos(angle);
        uv.y = 0.5 + (vUv.y - 0.5) / perspective;
        showFrom = true;
      } else {
        uv.x = (1.0 - x) / (-cos(angle));
        uv.y = 0.5 + (vUv.y - 0.5) / (2.0 - perspective);
        showFrom = false;
      }
    } else if (uDirection == 2) { // up
      float y = 1.0 - vUv.y;
      float perspective = 1.0 + y * sin(angle) * 0.5;
      
      if (cos(angle) > 0.0) {
        uv.y = 1.0 - y / cos(angle);
        uv.x = 0.5 + (vUv.x - 0.5) / perspective;
        showFrom = true;
      } else {
        uv.y = (1.0 - y) / (-cos(angle));
        uv.x = 0.5 + (vUv.x - 0.5) / (2.0 - perspective);
        showFrom = false;
      }
    } else { // down
      float y = vUv.y;
      float perspective = 1.0 + y * sin(angle) * 0.5;
      
      if (cos(angle) > 0.0) {
        uv.y = y / cos(angle);
        uv.x = 0.5 + (vUv.x - 0.5) / perspective;
        showFrom = true;
      } else {
        uv.y = 1.0 - (1.0 - y) / (-cos(angle));
        uv.x = 0.5 + (vUv.x - 0.5) / (2.0 - perspective);
        showFrom = false;
      }
    }
    
    // Out of bounds check
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      color = vec4(0.0, 0.0, 0.0, 1.0);
    } else if (showFrom) {
      color = texture2D(uTextureFrom, uv);
      // Darken as it rotates away
      color.rgb *= 1.0 - uProgress * 0.5;
    } else {
      color = texture2D(uTextureTo, uv);
      // Brighten as it rotates in
      color.rgb *= 0.5 + uProgress * 0.5;
    }
    
    gl_FragColor = color;
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// RGB Shift transition - chromatic aberration effect with radial reveal
const rgbShiftFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center);
    vec2 direction = normalize(vUv - center + 0.001);
    
    // RGB shift amount peaks at midpoint
    float shiftAmount = sin(uProgress * 3.14159) * uIntensity * 0.05;
    
    // Radial reveal mask
    float revealRadius = uProgress * 1.2;
    float mask = smoothstep(revealRadius - 0.08, revealRadius + 0.08, dist);
    
    // Apply chromatic aberration near the reveal edge
    float edgeDist = abs(dist - revealRadius);
    float edgeShift = shiftAmount * smoothstep(0.2, 0.0, edgeDist) * 2.0;
    
    // Sample with channel separation
    vec4 colorFrom, colorTo;
    
    colorFrom.r = texture2D(uTextureFrom, vUv + direction * edgeShift).r;
    colorFrom.g = texture2D(uTextureFrom, vUv).g;
    colorFrom.b = texture2D(uTextureFrom, vUv - direction * edgeShift).b;
    colorFrom.a = 1.0;
    
    colorTo.r = texture2D(uTextureTo, vUv + direction * edgeShift).r;
    colorTo.g = texture2D(uTextureTo, vUv).g;
    colorTo.b = texture2D(uTextureTo, vUv - direction * edgeShift).b;
    colorTo.a = 1.0;
    
    // Hard reveal based on radial mask with RGB shift at edges
    gl_FragColor = mix(colorTo, colorFrom, mask);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// Grid Flip transition - tiles flip one by one
const gridFlipFragmentShader = `
  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform float uProgress;
  uniform float uRows;
  uniform float uCols;
  varying vec2 vUv;

  void main() {
    // Calculate which cell we're in
    vec2 cell = floor(vUv * vec2(uCols, uRows));
    vec2 cellUv = fract(vUv * vec2(uCols, uRows));
    
    // Stagger the flip based on cell position (diagonal wave)
    float cellIndex = cell.x + cell.y;
    float totalCells = uCols + uRows - 1.0;
    float stagger = cellIndex / totalCells;
    
    // Calculate local progress for this cell
    float localProgress = clamp((uProgress - stagger * 0.5) / 0.5, 0.0, 1.0);
    
    // Flip animation
    float flipAngle = localProgress * 3.14159;
    float scale = abs(cos(flipAngle));
    
    vec2 uv = cellUv;
    uv.y = 0.5 + (cellUv.y - 0.5) / max(scale, 0.01);
    
    // Convert back to global UV
    vec2 globalUv = (cell + uv) / vec2(uCols, uRows);
    
    vec4 color;
    if (uv.y < 0.0 || uv.y > 1.0) {
      color = vec4(0.0, 0.0, 0.0, 1.0);
    } else if (localProgress < 0.5) {
      color = texture2D(uTextureFrom, clamp(globalUv, 0.0, 1.0));
      // Add shadow during flip
      color.rgb *= 0.7 + 0.3 * cos(flipAngle);
    } else {
      // Flip UV for back side
      uv.y = 1.0 - uv.y;
      globalUv = (cell + uv) / vec2(uCols, uRows);
      color = texture2D(uTextureTo, clamp(globalUv, 0.0, 1.0));
      // Add shadow during flip
      color.rgb *= 0.7 + 0.3 * cos(flipAngle);
    }
    
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

      // Akella-style creative transitions
      case "morph":
        return {
          fragmentShader: morphFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 0.3 },
          },
        };

      case "directionalWarp":
        return {
          fragmentShader: directionalWarpFragmentShader,
          uniforms: {
            ...baseUniforms,
            uDirection: {
              value:
                mode.direction === "left" ? 0 :
                  mode.direction === "right" ? 1 :
                    mode.direction === "up" ? 2 : 3,
            },
            uIntensity: { value: mode.intensity ?? 0.5 },
          },
        };

      case "swirl":
        return {
          fragmentShader: swirlFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 1.0 },
          },
        };

      case "ripple":
        return {
          fragmentShader: rippleFragmentShader,
          uniforms: {
            ...baseUniforms,
            uFrequency: { value: mode.frequency ?? 30.0 },
            uAmplitude: { value: mode.amplitude ?? 0.1 },
          },
        };

      case "lens":
        return {
          fragmentShader: lensFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 2.0 },
          },
        };

      case "wind":
        return {
          fragmentShader: windFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 1.0 },
          },
        };

      case "dreamyZoom":
        return {
          fragmentShader: dreamyZoomFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 0.5 },
          },
        };

      case "cube":
        return {
          fragmentShader: cubeFragmentShader,
          uniforms: {
            ...baseUniforms,
            uDirection: {
              value:
                mode.direction === "left" ? 0 :
                  mode.direction === "right" ? 1 :
                    mode.direction === "up" ? 2 : 3,
            },
          },
        };

      case "rgbShift":
        return {
          fragmentShader: rgbShiftFragmentShader,
          uniforms: {
            ...baseUniforms,
            uIntensity: { value: mode.intensity ?? 1.0 },
          },
        };

      case "gridFlip":
        return {
          fragmentShader: gridFlipFragmentShader,
          uniforms: {
            ...baseUniforms,
            uRows: { value: mode.rows ?? 4 },
            uCols: { value: mode.cols ?? 4 },
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
