import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Zoom blur direction.
 */
export type ZoomDirection = "in" | "out";

/**
 * Props for the `ZoomBlur` component.
 */
export type ZoomBlurProps = {
  /** Content to apply zoom blur to (3D children). */
  children: ReactNode;
  /** Frame at which effect starts. */
  startFrame?: number;
  /** Duration of the effect in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Direction of zoom blur. */
  direction?: ZoomDirection;
  /** Maximum scale difference for blur trail. */
  intensity?: number;
  /** Origin point [x, y] normalized (0-1). */
  origin?: [number, number];
  /** Whether to fade in/out during effect. */
  fade?: boolean;
};

// Radial blur shader
const zoomBlurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const zoomBlurFragmentShader = `
  uniform float uIntensity;
  uniform vec2 uOrigin;
  uniform float uDirection; // 0 = in, 1 = out
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - uOrigin;
    float dist = length(centered);
    
    // Radial blur lines
    float angle = atan(centered.y, centered.x);
    float radialLines = sin(angle * 20.0) * 0.5 + 0.5;
    
    // Blur increases towards edges (for "in") or center (for "out")
    float blurFactor;
    if (uDirection < 0.5) {
      blurFactor = dist;
    } else {
      blurFactor = 1.0 - dist;
    }
    
    float alpha = blurFactor * uIntensity * radialLines * 0.5;
    
    // Color trails
    vec3 color = vec3(1.0);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * `ZoomBlur` creates radial motion blur effects in 3D.
 * Simulates the speed/impact feeling of rapid zoom movements.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <ZoomBlur direction="in" durationInFrames={20}>
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </ZoomBlur>
 * </ThreeCanvas>
 * ```
 */
export const ZoomBlur = ({
  children,
  startFrame = 0,
  durationInFrames = 20,
  easing = Easing.out(Easing.cubic),
  direction = "in",
  intensity = 0.3,
  origin = [0.5, 0.5],
  fade = true,
}: ZoomBlurProps) => {
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

  // Effect strength decreases as we approach the end
  const effectStrength = direction === "in" ? 1 - easedProgress : easedProgress;

  // Base opacity
  const baseOpacity = direction === "in" ? easedProgress : 1 - easedProgress;

  // Scale animation
  const scaleOffset = effectStrength * intensity;
  const currentScale = direction === "in" ? 1 - scaleOffset * 0.3 : 1 + scaleOffset * 0.3;

  const aspect = width / height;
  const overlaySize = 20;

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
      uOrigin: { value: new THREE.Vector2(origin[0], origin[1]) },
      uDirection: { value: direction === "in" ? 0 : 1 },
    }),
    [origin, direction]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uIntensity.value = effectStrength * intensity;
    }
  });

  return (
    <group scale={[currentScale, currentScale, 1]}>
      {/* Fade overlay */}
      {fade && baseOpacity < 0.99 && (
        <mesh position={[0, 0, 4.5]} renderOrder={98}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - baseOpacity}
            depthTest={false}
          />
        </mesh>
      )}

      {children}

      {/* Zoom blur overlay */}
      {effectStrength > 0.01 && (
        <mesh ref={meshRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={zoomBlurVertexShader}
            fragmentShader={zoomBlurFragmentShader}
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
