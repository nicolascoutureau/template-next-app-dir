import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `StripeGradientMesh` component.
 */
export type StripeGradientMeshProps = {
  /** Array of colors for the gradient mesh (4-6 colors work best). */
  colors?: string[];
  /** Speed of the animation (1 = normal). */
  speed?: number;
  /** Amplitude of the wave motion. */
  amplitude?: number;
  /** How much the colors blend together. */
  blendFactor?: number;
  /** Width of the canvas. */
  width?: number;
  /** Height of the canvas. */
  height?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform float uAmplitude;
  uniform float uBlendFactor;
  varying vec2 vUv;

  // Smooth noise function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 getGradientColor(float t) {
    // Create smooth 5-color gradient
    if (t < 0.25) {
      return mix(uColor1, uColor2, t * 4.0);
    } else if (t < 0.5) {
      return mix(uColor2, uColor3, (t - 0.25) * 4.0);
    } else if (t < 0.75) {
      return mix(uColor3, uColor4, (t - 0.5) * 4.0);
    } else {
      return mix(uColor4, uColor5, (t - 0.75) * 4.0);
    }
  }

  void main() {
    vec2 uv = vUv;
    
    // Create organic flowing mesh
    float time = uTime * 0.5;
    
    // Multiple layers of distortion
    vec2 distortion = vec2(
      fbm(uv * 3.0 + time * 0.3) * uAmplitude,
      fbm(uv * 3.0 + vec2(100.0) + time * 0.2) * uAmplitude
    );
    
    // Create flowing gradient positions
    float n1 = fbm((uv + distortion) * 2.0 + time * 0.1);
    float n2 = fbm((uv + distortion * 0.5) * 3.0 - time * 0.15);
    float n3 = fbm((uv - distortion * 0.3) * 1.5 + time * 0.08);
    
    // Combine for final gradient position
    float gradientPos = (n1 + n2 + n3) / 3.0;
    gradientPos = smoothstep(0.2, 0.8, gradientPos);
    
    // Get base color from gradient
    vec3 color = getGradientColor(gradientPos);
    
    // Add subtle color variation
    float variation = fbm(uv * 5.0 + time * 0.2) * 0.1;
    color += variation * uBlendFactor;
    
    // Subtle glow effect
    float glow = fbm(uv * 2.0 + time * 0.3);
    glow = smoothstep(0.4, 0.6, glow) * 0.15;
    color += glow;
    
    // Ensure colors stay vibrant
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GradientMeshPlane({
  colors,
  amplitude,
  blendFactor,
  speed,
}: {
  colors: THREE.Color[];
  amplitude: number;
  blendFactor: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: colors[0] },
      uColor2: { value: colors[1] },
      uColor3: { value: colors[2] },
      uColor4: { value: colors[3] },
      uColor5: { value: colors[4] },
      uAmplitude: { value: amplitude },
      uBlendFactor: { value: blendFactor },
    }),
    [colors, amplitude, blendFactor],
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = (frame / fps) * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/**
 * `StripeGradientMesh` creates a beautiful, flowing gradient mesh background
 * inspired by Stripe's iconic visual style. Features smooth color transitions
 * with organic movement.
 *
 * @example
 * ```tsx
 * // Stripe-style purple/blue
 * <StripeGradientMesh
 *   colors={["#7928CA", "#FF0080", "#FF4D4D", "#F9CB28", "#4DFFDF"]}
 * />
 *
 * // Ocean theme
 * <StripeGradientMesh
 *   colors={["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"]}
 *   amplitude={0.3}
 * />
 * ```
 */
export const StripeGradientMesh = ({
  colors = ["#7928CA", "#FF0080", "#FF4D4D", "#F9CB28", "#4DFFDF"],
  speed = 1,
  amplitude = 0.2,
  blendFactor = 0.5,
  width,
  height,
}: StripeGradientMeshProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const threeColors = useMemo(() => {
    // Ensure we have exactly 5 colors
    const normalizedColors = [...colors];
    while (normalizedColors.length < 5) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 5).map((c) => new THREE.Color(c));
  }, [colors]);

  return (
    <div style={{ width: w, height: h, position: "absolute", inset: 0 }}>
      <ThreeCanvas
        width={w}
        height={h}
        camera={{ position: [0, 0, 1], fov: 90 }}
      >
        <GradientMeshPlane
          colors={threeColors}
          amplitude={amplitude}
          blendFactor={blendFactor}
          speed={speed}
        />
      </ThreeCanvas>
    </div>
  );
};
