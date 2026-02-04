import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Advanced slide effect types.
 */
export type SlideEffect =
  | "smooth"
  | "elastic"
  | "bounce"
  | "overshoot"
  | "spring"
  | "momentum";

/**
 * Slide direction.
 */
export type SlideDirection = "left" | "right" | "up" | "down";

/**
 * Props for the `SlideTransition` component.
 */
export type SlideTransitionProps = {
  /** Content to slide (3D children). */
  children: ReactNode;
  /** Direction of the slide. */
  direction?: SlideDirection;
  /** Frame at which slide starts. */
  startFrame?: number;
  /** Duration of the slide in frames. */
  durationInFrames?: number;
  /** Slide effect/easing style. */
  effect?: SlideEffect;
  /** Whether this is a slide in or out. */
  mode?: "in" | "out";
  /** Distance to slide (in world units). */
  distance?: number;
  /** Whether to blur during motion. */
  motionBlur?: boolean;
  /** Whether to fade during slide. */
  fade?: boolean;
  /** Whether to scale during slide. */
  scale?: boolean;
  /** Scale amount (0-1, where 1 = no scale). */
  scaleAmount?: number;
  /** Whether to rotate during slide (3D tilt). */
  rotate?: boolean;
  /** Rotation amount in radians. */
  rotateAmount?: number;
  /** FPS for spring calculation. */
  fps?: number;
};

/**
 * Get easing function based on effect type.
 */
const getEasing = (effect: SlideEffect): ((t: number) => number) => {
  switch (effect) {
    case "smooth":
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    case "elastic":
      return Easing.elastic(1);
    case "bounce":
      return Easing.bounce;
    case "overshoot":
      return Easing.bezier(0.34, 1.56, 0.64, 1);
    case "momentum":
      return Easing.bezier(0.19, 1, 0.22, 1);
    case "spring":
      return (t: number) => t;
    default:
      return Easing.out(Easing.cubic);
  }
};

// Motion blur shader
const blurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blurFragmentShader = `
  uniform float uBlur;
  uniform float uDirection; // 0 = horizontal, 1 = vertical
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Directional blur effect
    float blur;
    if (uDirection < 0.5) {
      // Horizontal
      blur = abs(uv.x - 0.5) * 2.0;
    } else {
      // Vertical
      blur = abs(uv.y - 0.5) * 2.0;
    }
    
    float alpha = (1.0 - blur) * uBlur * 0.3;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * `SlideTransition` provides advanced directional slide effects in 3D.
 * Includes physics-based animations, motion blur, and 3D transforms.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <SlideTransition direction="left" effect="elastic">
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </SlideTransition>
 * </ThreeCanvas>
 * ```
 */
export const SlideTransition = ({
  children,
  direction = "left",
  startFrame = 0,
  durationInFrames = 30,
  effect = "smooth",
  mode = "in",
  distance = 10,
  motionBlur = false,
  fade = false,
  scale = false,
  scaleAmount = 0.9,
  rotate = false,
  rotateAmount = 0.3,
  fps = 30,
}: SlideTransitionProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const blurRef = useRef<THREE.Mesh>(null);

  // Calculate progress based on effect type
  let progress: number;

  if (effect === "spring") {
    progress = spring({
      frame: frame - startFrame,
      fps,
      config: {
        damping: 12,
        mass: 0.5,
        stiffness: 100,
      },
    });
  } else {
    const easing = getEasing(effect);
    const rawProgress = interpolate(
      frame,
      [startFrame, startFrame + durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    progress = easing(rawProgress);
  }

  // Apply mode (in vs out)
  const animProgress = mode === "in" ? progress : 1 - progress;

  // Calculate movement offset
  const getOffset = (): [number, number, number] => {
    const remaining = (1 - animProgress) * distance;
    switch (direction) {
      case "left":
        return [-remaining, 0, 0];
      case "right":
        return [remaining, 0, 0];
      case "up":
        return [0, remaining, 0];
      case "down":
        return [0, -remaining, 0];
    }
  };

  const offset = getOffset();

  // Motion blur based on velocity
  const velocity = Math.abs(1 - animProgress);
  const blurAmount = motionBlur ? velocity : 0;
  const isHorizontal = direction === "left" || direction === "right";

  // Scale calculation
  const currentScale = scale
    ? scaleAmount + (1 - scaleAmount) * animProgress
    : 1;

  // Rotation calculation (3D tilt effect)
  const rotation: [number, number, number] = [0, 0, 0];
  if (rotate) {
    const rotAmount = (1 - animProgress) * rotateAmount;
    if (isHorizontal) {
      rotation[1] = direction === "right" ? -rotAmount : rotAmount;
    } else {
      rotation[0] = direction === "down" ? rotAmount : -rotAmount;
    }
  }

  // Opacity
  const opacity = fade ? animProgress : 1;

  const aspect = width / height;
  const overlaySize = 20;

  const blurUniforms = useMemo(
    () => ({
      uBlur: { value: 0 },
      uDirection: { value: isHorizontal ? 0 : 1 },
      uColor: { value: new THREE.Color("#ffffff") },
    }),
    [isHorizontal]
  );

  useFrame(() => {
    if (blurRef.current) {
      const material = blurRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlur.value = blurAmount;
    }
  });

  return (
    <group
      position={offset}
      rotation={rotation}
      scale={[currentScale, currentScale, 1]}
    >
      {/* Fade overlay */}
      {fade && opacity < 0.99 && (
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

      {/* Motion blur overlay */}
      {motionBlur && blurAmount > 0.01 && (
        <mesh ref={blurRef} position={[0, 0, 5]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={blurVertexShader}
            fragmentShader={blurFragmentShader}
            uniforms={blurUniforms}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
