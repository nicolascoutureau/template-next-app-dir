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
    // 5-color gradient
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
    float time = uTime;
    
    // Create flowing distortion
    vec2 distortion = vec2(
      fbm(uv * 3.0 + time * 0.2) * uAmplitude,
      fbm(uv * 3.0 + vec2(5.0, 5.0) + time * 0.15) * uAmplitude
    );
    
    // Apply distortion to create flowing effect
    vec2 distortedUv = uv + distortion;
    
    // Create multiple noise layers for gradient
    float n1 = fbm(distortedUv * 2.0 + time * 0.1);
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

/**
 * `StripeGradientMesh` creates a beautiful, flowing gradient mesh background
 * inspired by Stripe's iconic visual style. Features smooth color transitions
 * with organic movement.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <StripeGradientMesh
 *     colors={["#7928CA", "#FF0080", "#FF4D4D", "#F9CB28", "#4DFFDF"]}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const StripeGradientMesh = ({
  colors = ["#7928CA", "#FF0080", "#FF4D4D", "#F9CB28", "#4DFFDF"],
  speed = 1,
  amplitude = 0.2,
  blendFactor = 0.5,
}: StripeGradientMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 5) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 5).map((c) => new THREE.Color(c));
  }, [colors]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uColor4: { value: threeColors[3] },
      uColor5: { value: threeColors[4] },
      uAmplitude: { value: amplitude },
      uBlendFactor: { value: blendFactor },
    }),
    [threeColors, amplitude, blendFactor],
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
};
