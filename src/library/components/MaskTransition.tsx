import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Mask shapes for transitions.
 */
export type MaskShape =
  | "circle"
  | "star"
  | "hexagon"
  | "diamond"
  | "heart"
  | "wipe-left"
  | "wipe-right"
  | "wipe-up"
  | "wipe-down"
  | "iris";

/**
 * Props for the `MaskTransition` component.
 */
export type MaskTransitionProps = {
  /** Content to reveal/hide (3D children). */
  children: ReactNode;
  /** Shape of the mask. */
  shape?: MaskShape;
  /** Frame at which transition starts. */
  startFrame?: number;
  /** Duration of the transition in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Whether this is a reveal or hide. */
  mode?: "in" | "out";
  /** Origin point [x, y] normalized (0-1). */
  origin?: [number, number];
  /** Softness of mask edge (0-1). */
  softness?: number;
  /** Color of the mask/wipe. */
  maskColor?: string;
};

// Mask shader
const maskVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const maskFragmentShader = `
  uniform float uProgress;
  uniform int uShape;
  uniform vec2 uOrigin;
  uniform float uSoftness;
  uniform vec3 uColor;
  varying vec2 vUv;

  #define PI 3.14159265359

  float circleMask(vec2 uv, vec2 origin, float progress) {
    float dist = length(uv - origin);
    return smoothstep(progress * 1.5, progress * 1.5 - uSoftness, dist);
  }

  float starMask(vec2 uv, vec2 origin, float progress) {
    vec2 centered = uv - origin;
    float angle = atan(centered.y, centered.x);
    float radius = length(centered);
    
    // Star shape (5 points)
    float starRadius = 0.5 + 0.3 * cos(angle * 5.0);
    float targetRadius = progress * 1.5 * starRadius;
    
    return smoothstep(targetRadius, targetRadius - uSoftness, radius);
  }

  float hexagonMask(vec2 uv, vec2 origin, float progress) {
    vec2 centered = uv - origin;
    float angle = atan(centered.y, centered.x);
    float radius = length(centered);
    
    // Hexagon shape
    float hexRadius = 1.0 / cos(mod(angle, PI / 3.0) - PI / 6.0);
    float targetRadius = progress * 1.2 * hexRadius;
    
    return smoothstep(targetRadius, targetRadius - uSoftness, radius);
  }

  float diamondMask(vec2 uv, vec2 origin, float progress) {
    vec2 centered = abs(uv - origin);
    float dist = centered.x + centered.y;
    return smoothstep(progress * 2.0, progress * 2.0 - uSoftness, dist);
  }

  float heartMask(vec2 uv, vec2 origin, float progress) {
    vec2 centered = (uv - origin) * 2.0;
    centered.y -= 0.3;
    
    float a = centered.x * centered.x + centered.y * centered.y - 0.3;
    float heart = a * a * a - centered.x * centered.x * centered.y * centered.y * centered.y;
    
    return smoothstep(progress * 0.5, progress * 0.5 - uSoftness * 0.5, heart);
  }

  float wipeMask(vec2 uv, int direction, float progress) {
    float coord;
    if (direction == 0) coord = uv.x; // left
    else if (direction == 1) coord = 1.0 - uv.x; // right
    else if (direction == 2) coord = uv.y; // up
    else coord = 1.0 - uv.y; // down
    
    return smoothstep(progress, progress - uSoftness, coord);
  }

  float irisMask(vec2 uv, vec2 origin, float progress) {
    float dist = length(uv - origin);
    float iris = smoothstep(progress * 1.5 + 0.1, progress * 1.5, dist);
    return 1.0 - iris;
  }

  void main() {
    vec2 uv = vUv;
    float mask = 0.0;
    
    if (uShape == 0) mask = circleMask(uv, uOrigin, uProgress);
    else if (uShape == 1) mask = starMask(uv, uOrigin, uProgress);
    else if (uShape == 2) mask = hexagonMask(uv, uOrigin, uProgress);
    else if (uShape == 3) mask = diamondMask(uv, uOrigin, uProgress);
    else if (uShape == 4) mask = heartMask(uv, uOrigin, uProgress);
    else if (uShape == 5) mask = wipeMask(uv, 0, uProgress);
    else if (uShape == 6) mask = wipeMask(uv, 1, uProgress);
    else if (uShape == 7) mask = wipeMask(uv, 2, uProgress);
    else if (uShape == 8) mask = wipeMask(uv, 3, uProgress);
    else if (uShape == 9) mask = irisMask(uv, uOrigin, uProgress);
    
    // Invert mask (we're drawing what should be hidden)
    float alpha = 1.0 - mask;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const shapeMap: Record<MaskShape, number> = {
  circle: 0,
  star: 1,
  hexagon: 2,
  diamond: 3,
  heart: 4,
  "wipe-left": 5,
  "wipe-right": 6,
  "wipe-up": 7,
  "wipe-down": 8,
  iris: 9,
};

/**
 * `MaskTransition` provides shape-based mask reveals in 3D.
 * Creates cinematic wipes and reveals using various shapes.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <MaskTransition shape="circle" origin={[0.5, 0.5]}>
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </MaskTransition>
 * </ThreeCanvas>
 * ```
 */
export const MaskTransition = ({
  children,
  shape = "circle",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  mode = "in",
  origin = [0.5, 0.5],
  softness = 0.1,
  maskColor = "#000000",
}: MaskTransitionProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? easedProgress : 1 - easedProgress;

  const aspect = width / height;
  const overlaySize = 20;

  const color = useMemo(() => new THREE.Color(maskColor), [maskColor]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uShape: { value: shapeMap[shape] },
      uOrigin: { value: new THREE.Vector2(origin[0], origin[1]) },
      uSoftness: { value: softness },
      uColor: { value: color },
    }),
    [shape, origin, softness, color]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgress.value = effectProgress;
    }
  });

  return (
    <group>
      {children}

      {/* Mask overlay */}
      {effectProgress < 0.99 && (
        <mesh ref={meshRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={maskVertexShader}
            fragmentShader={maskFragmentShader}
            uniforms={uniforms}
            transparent
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};
