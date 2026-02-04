import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `RackFocus` component.
 */
export type RackFocusProps = {
  /** Content initially in focus (foreground subject). */
  from: ReactNode;
  /** Content to focus on (background subject). */
  to: ReactNode;
  /** Frame at which rack focus starts. */
  startFrame?: number;
  /** Duration of the focus pull in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Maximum blur amount (shader intensity 0-1). */
  maxBlur?: number;
  /** Whether to add subtle scale breathing (simulates depth). */
  breathe?: boolean;
  /** Scale amount for breathing effect. */
  breatheAmount?: number;
  /** Z position for the from content. */
  fromZ?: number;
  /** Z position for the to content. */
  toZ?: number;
};

// Blur overlay shader
const blurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blurFragmentShader = `
  uniform float uBlur;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Soft blur effect overlay
    float dist = length(uv - 0.5);
    float blurEffect = (1.0 - smoothstep(0.0, 0.7, dist)) * uBlur;
    
    // Gaussian-like falloff from edges
    float alpha = blurEffect * 0.4;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * `RackFocus` creates a cinematic focus pull between two subjects in 3D.
 * Simulates the classic camera technique of shifting focus from
 * foreground to background (or vice versa).
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <RackFocus
 *     from={<SplitText3DGsap text="HELLO" />}
 *     to={<Image3D url="/background.jpg" scale={8} />}
 *     durationInFrames={30}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const RackFocus = ({
  from,
  to,
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.inOut(Easing.cubic),
  maxBlur = 0.8,
  breathe = false,
  breatheAmount = 0.03,
  fromZ = 1,
  toZ = -1,
}: RackFocusProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fromBlurRef = useRef<THREE.Mesh>(null);
  const toBlurRef = useRef<THREE.Mesh>(null);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);

  // "from" starts sharp, becomes blurred
  // "to" starts blurred, becomes sharp
  const fromBlur = easedProgress * maxBlur;
  const toBlur = (1 - easedProgress) * maxBlur;

  // Breathing: subtle scale change to simulate depth
  const fromScale = breathe ? 1 + easedProgress * breatheAmount : 1;
  const toScale = breathe ? 1 + (1 - easedProgress) * breatheAmount : 1;

  const aspect = width / height;
  const overlaySize = 20;

  const fromUniforms = useMemo(
    () => ({
      uBlur: { value: 0 },
      uColor: { value: new THREE.Color("#888888") },
    }),
    []
  );

  const toUniforms = useMemo(
    () => ({
      uBlur: { value: 0 },
      uColor: { value: new THREE.Color("#888888") },
    }),
    []
  );

  useFrame(() => {
    if (fromBlurRef.current) {
      const material = fromBlurRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlur.value = fromBlur;
    }
    if (toBlurRef.current) {
      const material = toBlurRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlur.value = toBlur;
    }
  });

  return (
    <group>
      {/* Background (to) layer */}
      <group position={[0, 0, toZ]} scale={[toScale, toScale, 1]}>
        {to}
        {/* Blur overlay for "to" */}
        {toBlur > 0.01 && (
          <mesh ref={toBlurRef} position={[0, 0, 0.5]} renderOrder={50}>
            <planeGeometry args={[overlaySize * aspect, overlaySize]} />
            <shaderMaterial
              vertexShader={blurVertexShader}
              fragmentShader={blurFragmentShader}
              uniforms={toUniforms}
              transparent
              depthTest={false}
              blending={THREE.MultiplyBlending}
            />
          </mesh>
        )}
      </group>

      {/* Foreground (from) layer */}
      <group position={[0, 0, fromZ]} scale={[fromScale, fromScale, 1]}>
        {from}
        {/* Blur overlay for "from" */}
        {fromBlur > 0.01 && (
          <mesh ref={fromBlurRef} position={[0, 0, 0.5]} renderOrder={100}>
            <planeGeometry args={[overlaySize * aspect, overlaySize]} />
            <shaderMaterial
              vertexShader={blurVertexShader}
              fragmentShader={blurFragmentShader}
              uniforms={fromUniforms}
              transparent
              depthTest={false}
              blending={THREE.MultiplyBlending}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
