import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, random } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Particle dissolve pattern.
 */
export type DissolvePattern =
  | "scatter"
  | "vortex"
  | "explosion"
  | "gravity"
  | "wind";

/**
 * Props for the `ParticleDissolve` component.
 */
export type ParticleDissolveProps = {
  /** Content to dissolve (3D children). */
  children: ReactNode;
  /** Frame at which dissolve starts. */
  startFrame?: number;
  /** Duration of the dissolve in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Dissolve pattern. */
  pattern?: DissolvePattern;
  /** Whether this is a reveal (in) or dissolve (out). */
  mode?: "in" | "out";
  /** Intensity of particle movement. */
  intensity?: number;
  /** Seed for randomization. */
  seed?: number;
};

// Particle dissolve shader
const dissolveVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dissolveFragmentShader = `
  uniform float uProgress;
  uniform float uIntensity;
  uniform float uTime;
  uniform int uPattern;
  uniform float uSeed;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co + uSeed, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    
    float dissolve = 0.0;
    
    if (uPattern == 0) {
      // Scatter - random noise-based dissolve
      dissolve = noise(uv * 10.0 + t);
    } else if (uPattern == 1) {
      // Vortex - spiral dissolve from center
      vec2 centered = uv - 0.5;
      float angle = atan(centered.y, centered.x);
      float dist = length(centered);
      dissolve = (angle / 6.28318 + 0.5) * 0.5 + dist;
    } else if (uPattern == 2) {
      // Explosion - radial from center
      float dist = length(uv - 0.5);
      dissolve = dist;
    } else if (uPattern == 3) {
      // Gravity - top to bottom
      dissolve = 1.0 - uv.y + noise(uv * 5.0) * 0.3;
    } else {
      // Wind - left to right with turbulence
      dissolve = uv.x + sin(uv.y * 10.0 + t) * 0.1;
    }
    
    // Threshold for visibility
    float threshold = uProgress * (1.0 + uIntensity * 0.5);
    float alpha = smoothstep(threshold, threshold - 0.1, dissolve);
    
    // Add some edge glow effect
    float edge = smoothstep(threshold - 0.1, threshold, dissolve) - alpha;
    vec3 color = vec3(0.0);
    color += vec3(1.0, 0.5, 0.2) * edge * 2.0; // Orange glow at dissolve edge
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * `ParticleDissolve` creates particle-based dissolve effects in 3D.
 * Content appears to dissolve or materialize with various patterns.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <ParticleDissolve pattern="scatter" mode="out">
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </ParticleDissolve>
 * </ThreeCanvas>
 * ```
 */
export const ParticleDissolve = ({
  children,
  startFrame = 0,
  durationInFrames = 45,
  easing = Easing.out(Easing.cubic),
  pattern = "scatter",
  mode = "out",
  intensity = 1,
  seed = 0,
}: ParticleDissolveProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? 1 - easedProgress : easedProgress;

  const patternIndex = { scatter: 0, vortex: 1, explosion: 2, gravity: 3, wind: 4 }[pattern];

  const aspect = width / height;
  const overlaySize = 20;

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uIntensity: { value: intensity },
      uTime: { value: 0 },
      uPattern: { value: patternIndex },
      uSeed: { value: seed },
    }),
    [intensity, patternIndex, seed]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgress.value = effectProgress;
      material.uniforms.uTime.value = ((frame - startFrame) / fps);
    }
  });

  // Simple opacity for content
  const contentOpacity = mode === "in" ? easedProgress : 1 - easedProgress;

  return (
    <group>
      {/* Opacity overlay for content */}
      {contentOpacity < 0.99 && (
        <mesh position={[0, 0, 4.5]} renderOrder={98}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - contentOpacity}
            depthTest={false}
          />
        </mesh>
      )}
      
      {children}

      {/* Dissolve effect overlay */}
      {effectProgress > 0.01 && effectProgress < 0.99 && (
        <mesh ref={meshRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={dissolveVertexShader}
            fragmentShader={dissolveFragmentShader}
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
