import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Liquid warp style.
 */
export type LiquidStyle = "wave" | "ripple" | "turbulence" | "melt";

/**
 * Props for the `LiquidWarp` component.
 */
export type LiquidWarpProps = {
  /** Content to apply liquid effect to (3D children). */
  children: ReactNode;
  /** Frame at which effect starts. */
  startFrame?: number;
  /** Duration of the effect in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Style of liquid effect. */
  liquidStyle?: LiquidStyle;
  /** Intensity of the effect (0-1). */
  intensity?: number;
  /** Speed of the animation. */
  speed?: number;
  /** Whether this is a reveal (in) or hide (out). */
  mode?: "in" | "out";
};

// Liquid warp shader for overlay distortion effect
const warpVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const warpFragmentShader = `
  uniform float uIntensity;
  uniform float uTime;
  uniform int uStyle;
  varying vec2 vUv;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float noise = 0.0;
    
    if (uStyle == 0) {
      // Wave
      noise = snoise(vec2(uv.x * 2.0 + t, uv.y * 0.5)) * 0.5 +
              snoise(vec2(uv.x * 4.0 - t * 0.5, uv.y)) * 0.25;
    } else if (uStyle == 1) {
      // Ripple
      float dist = length(uv - 0.5);
      noise = sin(dist * 20.0 - t * 3.0) * (1.0 - dist);
    } else if (uStyle == 2) {
      // Turbulence
      noise = snoise(uv * 3.0 + t) * 0.5 +
              snoise(uv * 6.0 - t * 0.7) * 0.25 +
              snoise(uv * 12.0 + t * 0.5) * 0.125;
    } else {
      // Melt
      noise = snoise(vec2(uv.x * 0.5, uv.y * 2.0 + t)) * 0.7 +
              snoise(vec2(uv.x, uv.y * 4.0 + t * 1.5)) * 0.3;
    }
    
    // Distortion visualization
    float distortion = noise * uIntensity;
    vec3 color = vec3(0.5 + distortion * 0.5);
    
    // Only show the distortion effect, not a solid overlay
    float alpha = abs(distortion) * uIntensity * 0.5;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * `LiquidWarp` creates organic liquid distortion effects in 3D.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <LiquidWarp liquidStyle="wave" mode="in">
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </LiquidWarp>
 * </ThreeCanvas>
 * ```
 */
export const LiquidWarp = ({
  children,
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  liquidStyle = "wave",
  intensity = 0.5,
  speed = 1,
  mode = "in",
}: LiquidWarpProps) => {
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
  const opacity = mode === "in" ? easedProgress : 1 - easedProgress;

  const styleIndex = { wave: 0, ripple: 1, turbulence: 2, melt: 3 }[liquidStyle];

  const aspect = width / height;
  const overlaySize = 20;

  // Displacement for content (simulating the warp)
  const dispY = liquidStyle === "melt" ? effectProgress * 0.5 : 0;

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
      uTime: { value: 0 },
      uStyle: { value: styleIndex },
    }),
    [styleIndex]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uIntensity.value = effectProgress * intensity;
      material.uniforms.uTime.value = ((frame - startFrame) / fps) * speed;
    }
  });

  return (
    <group>
      {/* Content with displacement */}
      <group position={[0, -dispY, 0]}>
        {/* Opacity overlay */}
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

      {/* Warp distortion overlay */}
      {effectProgress > 0.01 && (
        <mesh ref={meshRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={warpVertexShader}
            fragmentShader={warpFragmentShader}
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
