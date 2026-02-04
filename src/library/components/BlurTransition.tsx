import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Blur transition type.
 */
export type BlurType = "focus" | "defocus" | "rack" | "motion";

/**
 * Props for the `BlurTransition` component.
 */
export type BlurTransitionProps = {
  /** Content to apply blur transition to (3D children). */
  children: ReactNode;
  /** Type of blur effect. */
  type?: BlurType;
  /** Frame at which transition starts. */
  startFrame?: number;
  /** Duration of the transition in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Maximum blur amount (shader intensity 0-1). */
  maxBlur?: number;
  /** Whether to fade opacity alongside blur. */
  fade?: boolean;
  /** Whether to scale slightly during blur (simulates depth). */
  breathe?: boolean;
  /** Direction for motion blur: angle in degrees. */
  motionAngle?: number;
  /** Color of blur overlay. */
  blurColor?: string;
};

// Shader for blur overlay effect
const blurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blurFragmentShader = `
  uniform float uBlur;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform float uMotionAngle;
  uniform bool uIsMotion;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    if (uIsMotion) {
      // Motion blur - radial lines effect
      float angle = uMotionAngle * 3.14159 / 180.0;
      vec2 dir = vec2(cos(angle), sin(angle));
      vec2 center = uv - 0.5;
      float d = abs(dot(center, dir));
      float motionStrength = uBlur * (1.0 - d * 2.0);
      motionStrength = max(0.0, motionStrength);
      gl_FragColor = vec4(uColor, motionStrength * uOpacity * 0.5);
    } else {
      // Regular blur - soft glow overlay
      float dist = length(uv - 0.5);
      float blurEffect = smoothstep(0.0, 0.7, 1.0 - dist) * uBlur;
      gl_FragColor = vec4(uColor, blurEffect * uOpacity * 0.3);
    }
  }
`;

/**
 * `BlurTransition` creates cinematic blur effects in 3D space.
 * Simulates camera focus pulls, depth of field, and motion blur.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   {/* Focus in (blur to sharp) *\/}
 *   <BlurTransition type="focus" durationInFrames={30}>
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </BlurTransition>
 * </ThreeCanvas>
 *
 * @example
 * ```tsx
 * {/* Defocus out (sharp to blur) *\/}
 * <BlurTransition type="defocus" startFrame={60}>
 *   <mesh><boxGeometry /></mesh>
 * </BlurTransition>
 * ```
 */
export const BlurTransition = ({
  children,
  type = "focus",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  maxBlur = 0.8,
  fade = true,
  breathe = false,
  motionAngle = 0,
  blurColor = "#ffffff",
}: BlurTransitionProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const overlayRef = useRef<THREE.Mesh>(null);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);

  // Calculate blur based on type
  let blur: number;
  let opacity: number = 1;
  let scale: number = 1;

  switch (type) {
    case "focus":
      // Blur to sharp
      blur = maxBlur * (1 - easedProgress);
      opacity = fade ? 0.3 + 0.7 * easedProgress : 1;
      scale = breathe ? 1.05 - 0.05 * easedProgress : 1;
      break;
    case "defocus":
      // Sharp to blur
      blur = maxBlur * easedProgress;
      opacity = fade ? 1 - 0.7 * easedProgress : 1;
      scale = breathe ? 1 + 0.05 * easedProgress : 1;
      break;
    case "rack":
      // Blur → Sharp → Blur (rack focus)
      const rackProgress =
        easedProgress < 0.5 ? easedProgress * 2 : 2 - easedProgress * 2;
      blur = maxBlur * (1 - rackProgress);
      opacity = fade ? 0.5 + 0.5 * rackProgress : 1;
      scale = breathe ? 1.03 - 0.03 * rackProgress : 1;
      break;
    case "motion":
      // Directional motion blur simulation
      blur = maxBlur * (1 - easedProgress);
      opacity = fade ? 0.5 + 0.5 * easedProgress : 1;
      scale = 1;
      break;
    default:
      blur = 0;
  }

  const color = useMemo(() => new THREE.Color(blurColor), [blurColor]);

  const uniforms = useMemo(
    () => ({
      uBlur: { value: 0 },
      uOpacity: { value: 1 },
      uColor: { value: color },
      uMotionAngle: { value: motionAngle },
      uIsMotion: { value: type === "motion" },
    }),
    [color, motionAngle, type]
  );

  // Update uniforms
  useFrame(() => {
    if (overlayRef.current) {
      const material = overlayRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlur.value = blur;
      material.uniforms.uOpacity.value = opacity;
    }
  });

  // Calculate overlay size to cover the viewport
  const aspect = width / height;
  const overlaySize = 20; // Large enough to cover typical camera views

  return (
    <group scale={[scale, scale, 1]}>
      {children}

      {/* Blur overlay effect */}
      {blur > 0.01 && (
        <mesh ref={overlayRef} position={[0, 0, 4]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={blurVertexShader}
            fragmentShader={blurFragmentShader}
            uniforms={uniforms}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Fade overlay for opacity control */}
      {fade && opacity < 0.99 && (
        <mesh position={[0, 0, 5]} renderOrder={101}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - opacity}
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};
