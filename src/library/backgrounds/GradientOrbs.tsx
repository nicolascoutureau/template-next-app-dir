import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `GradientOrbs` component.
 */
export type GradientOrbsProps = {
  /** Array of orb colors (2-3 recommended for subtlety). */
  colors?: string[];
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the animation (0.1-0.5 recommended for premium feel). */
  speed?: number;
  /** Blur/softness of the orbs (0.7-1.0 recommended). */
  blur?: number;
  /** Size of the orbs (0.4-0.6 recommended). */
  orbSize?: number;
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
  uniform vec3 uBackgroundColor;
  uniform float uBlur;
  uniform float uOrbSize;
  varying vec2 vUv;

  vec2 getOrbPosition(int index, float time) {
    float i = float(index);
    // Very slow, breathing motion
    float baseSpeed = 0.03 + i * 0.01;
    float angle = time * baseSpeed + i * 2.094; // 2*PI/3
    
    vec2 center = vec2(0.5, 0.5);
    // Gentle elliptical motion
    float radiusX = 0.12 + sin(time * 0.02 + i) * 0.04;
    float radiusY = 0.10 + cos(time * 0.025 + i) * 0.03;
    
    if (index == 0) {
      // Top-left area
      return vec2(0.35, 0.4) + vec2(cos(angle) * radiusX, sin(angle) * radiusY);
    } else if (index == 1) {
      // Center-right area
      return vec2(0.6, 0.55) + vec2(sin(angle * 0.8) * radiusX, cos(angle * 0.8) * radiusY);
    } else {
      // Bottom area
      return vec2(0.45, 0.65) + vec2(cos(angle * 0.6 + 1.0) * radiusX * 0.9, sin(angle * 0.6 + 1.0) * radiusY * 0.9);
    }
  }

  vec3 getOrbColor(int index) {
    if (index == 0) return uColor1;
    if (index == 1) return uColor2;
    return uColor3;
  }

  float getOrbSize(int index, float time) {
    float i = float(index);
    float base = uOrbSize * (0.9 + i * 0.05);
    // Very subtle breathing
    float pulse = sin(time * (0.08 + i * 0.02)) * 0.03 + 1.0;
    return base * pulse;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Start with background
    vec3 color = uBackgroundColor;
    
    // Add each orb with visible blending
    for (int i = 0; i < 3; i++) {
      vec2 orbPos = getOrbPosition(i, time);
      vec3 orbColor = getOrbColor(i);
      float orbSize = getOrbSize(i, time);
      
      // Distance from orb center
      float dist = length(uv - orbPos);
      
      // Soft but visible falloff
      float falloff = 1.0 - smoothstep(0.0, orbSize * (1.0 + uBlur * 0.5), dist);
      falloff = pow(falloff, 1.1);
      
      // Strong blend
      color = mix(color, orbColor, falloff * 0.85);
    }
    
    // Subtle film grain
    float noise = fract(sin(dot(uv * 500.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.012;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv - 0.5) * 1.1);
    color *= 0.9 + vignette * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `GradientOrbs` creates soft, floating gradient orbs with slow, breathing motion.
 * Designed for premium, subtle backgrounds that don't distract from content.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <GradientOrbs
 *     colors={["#3b4a6b", "#5a4a6b", "#4a5a6b"]}
 *     backgroundColor="#1a1a2e"
 *     speed={0.3}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const GradientOrbs = ({
  colors = ["#4a6090", "#6a5090", "#5a7090"],
  backgroundColor = "#1a1a2e",
  speed = 0.3,
  blur = 0.6,
  orbSize = 0.55,
}: GradientOrbsProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Use ref to pass current frame to useFrame callback (avoids stale closure)
  const frameRef = useRef(frame);
  frameRef.current = frame;

  // Calculate plane dimensions to fill viewport at fov=90, z=1
  const aspect = width / height;
  const planeHeight = 2;
  const planeWidth = planeHeight * aspect;

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 3) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 3).map((c) => new THREE.Color(c));
  }, [colors]);

  const bgColor = useMemo(
    () => new THREE.Color(backgroundColor),
    [backgroundColor],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uBackgroundColor: { value: bgColor },
      uBlur: { value: blur },
      uOrbSize: { value: orbSize },
    }),
    [threeColors, bgColor, blur, orbSize],
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = (frameRef.current / fps) * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};
