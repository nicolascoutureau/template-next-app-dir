import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Glitch effect intensity.
 */
export type GlitchIntensity = "subtle" | "medium" | "intense" | "chaos";

/**
 * Props for the `GlitchTransition` component.
 */
export type GlitchTransitionProps = {
  /** Content to apply glitch effect to (3D children). */
  children: ReactNode;
  /** Frame at which glitch starts. */
  startFrame?: number;
  /** Duration of the glitch in frames. */
  durationInFrames?: number;
  /** Intensity of the glitch effect. */
  intensity?: GlitchIntensity;
  /** Whether to include RGB split/chromatic aberration. */
  rgbSplit?: boolean;
  /** Whether to include scan lines. */
  scanLines?: boolean;
  /** Whether this is a reveal (glitch in) or hide (glitch out). */
  mode?: "in" | "out";
  /** Seed for randomization (for reproducible results). */
  seed?: number;
};

const getIntensityValues = (intensity: GlitchIntensity) => {
  switch (intensity) {
    case "subtle":
      return { rgbOffset: 0.01, flickerRate: 0.1, displacement: 0.02 };
    case "medium":
      return { rgbOffset: 0.03, flickerRate: 0.3, displacement: 0.05 };
    case "intense":
      return { rgbOffset: 0.06, flickerRate: 0.5, displacement: 0.1 };
    case "chaos":
      return { rgbOffset: 0.1, flickerRate: 0.7, displacement: 0.15 };
  }
};

// Shader for glitch overlay effects
const glitchVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glitchFragmentShader = `
  uniform float uIntensity;
  uniform float uTime;
  uniform float uScanLines;
  uniform float uRgbSplit;
  uniform vec3 uRgbOffset;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    
    // Scan lines
    float scanLine = 0.0;
    if (uScanLines > 0.0) {
      scanLine = sin(uv.y * 800.0) * 0.04 * uIntensity;
    }
    
    // RGB split/chromatic aberration
    float rgbStrength = uRgbSplit * uIntensity;
    vec3 color = vec3(0.0);
    
    if (rgbStrength > 0.01) {
      // Red channel offset
      color.r = rand(uv + uRgbOffset.xy * rgbStrength);
      // Green channel
      color.g = rand(uv);
      // Blue channel offset
      color.b = rand(uv - uRgbOffset.xy * rgbStrength);
      color *= 0.3 * uIntensity;
    }
    
    // Noise overlay
    float noise = rand(uv * 100.0 + t) * 0.1 * uIntensity;
    
    // Combine effects
    float alpha = (scanLine + noise + length(color) * 0.5) * uIntensity;
    
    gl_FragColor = vec4(color + vec3(noise), alpha);
  }
`;

/**
 * `GlitchTransition` creates digital distortion effects in 3D.
 * Includes RGB split, scan lines, and displacement for authentic glitch aesthetic.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   {/* Glitch in reveal *\/}
 *   <GlitchTransition mode="in" durationInFrames={20}>
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </GlitchTransition>
 * </ThreeCanvas>
 * ```
 */
export const GlitchTransition = ({
  children,
  startFrame = 0,
  durationInFrames = 20,
  intensity = "medium",
  rgbSplit = true,
  scanLines = true,
  mode = "in",
  seed = 0,
}: GlitchTransitionProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const overlayRef = useRef<THREE.Mesh>(null);

  const { rgbOffset, flickerRate, displacement } = getIntensityValues(intensity);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Invert progress for "out" mode
  const effectProgress = mode === "in" ? 1 - progress : progress;

  // Eased intensity that peaks in the middle
  const glitchIntensity = effectProgress * Math.sin(effectProgress * Math.PI);

  // Random flicker based on frame
  const shouldFlicker = random(`flicker-${frame}-${seed}`) < flickerRate * glitchIntensity;

  // Displacement offset for content
  const dispX = displacement * glitchIntensity * (random(`disp-x-${frame}-${seed}`) - 0.5) * 2;
  const dispY = displacement * glitchIntensity * (random(`disp-y-${frame}-${seed}`) - 0.5) * 2;

  // Base opacity with flicker
  const baseOpacity = mode === "in" ? progress : 1 - progress;
  const opacity = shouldFlicker ? baseOpacity * 0.3 : baseOpacity;

  const aspect = width / height;
  const overlaySize = 20;

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
      uTime: { value: 0 },
      uScanLines: { value: scanLines ? 1 : 0 },
      uRgbSplit: { value: rgbSplit ? 1 : 0 },
      uRgbOffset: { value: new THREE.Vector3(rgbOffset, rgbOffset * 0.5, 0) },
    }),
    [scanLines, rgbSplit, rgbOffset]
  );

  useFrame(() => {
    if (overlayRef.current) {
      const material = overlayRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uIntensity.value = glitchIntensity;
      material.uniforms.uTime.value = frame / fps;
    }
  });

  return (
    <group>
      {/* Content with displacement and opacity */}
      <group position={[dispX, dispY, 0]}>
        <group>
          {/* Fade overlay for opacity control */}
          {opacity < 0.99 && (
            <mesh position={[0, 0, 4.5]} renderOrder={98}>
              <planeGeometry args={[overlaySize * aspect, overlaySize]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={1 - opacity}
                depthTest={false}
              />
            </mesh>
          )}
          {children}
        </group>
      </group>

      {/* Glitch overlay effects */}
      {glitchIntensity > 0.01 && (
        <mesh ref={overlayRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={glitchVertexShader}
            fragmentShader={glitchFragmentShader}
            uniforms={uniforms}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
