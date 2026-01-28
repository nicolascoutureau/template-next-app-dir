import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `GradientOrbs` component.
 */
export type GradientOrbsProps = {
  /** Array of orb colors. */
  colors?: string[];
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the animation. */
  speed?: number;
  /** Blur/softness of the orbs (0-1). */
  blur?: number;
  /** Size of the orbs. */
  orbSize?: number;
  /** Number of orbs. */
  orbCount?: number;
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
  uniform vec3 uBackgroundColor;
  uniform float uBlur;
  uniform float uOrbSize;
  varying vec2 vUv;

  vec2 getOrbPosition(int index, float time) {
    float i = float(index);
    float baseSpeed = 0.2 + i * 0.05;
    float angle = time * baseSpeed + i * 1.2566; // 2*PI/5
    
    // Different orbit patterns for each orb
    vec2 center = vec2(0.5, 0.5);
    float radiusX = 0.2 + sin(time * 0.1 + i) * 0.1;
    float radiusY = 0.15 + cos(time * 0.15 + i) * 0.08;
    
    if (index == 0) {
      return center + vec2(cos(angle) * radiusX * 1.2, sin(angle) * radiusY * 1.2);
    } else if (index == 1) {
      return center + vec2(sin(angle * 0.8) * radiusX, cos(angle * 0.8) * radiusY * 1.5);
    } else if (index == 2) {
      return center + vec2(cos(angle * 0.6 + 1.0) * radiusX * 0.8, sin(angle * 0.6 + 1.0) * radiusY * 0.8);
    } else if (index == 3) {
      return vec2(0.3, 0.3) + vec2(sin(time * 0.3) * 0.15, cos(time * 0.25) * 0.15);
    } else {
      return vec2(0.7, 0.7) + vec2(cos(time * 0.35) * 0.15, sin(time * 0.3) * 0.15);
    }
  }

  vec3 getOrbColor(int index) {
    if (index == 0) return uColor1;
    if (index == 1) return uColor2;
    if (index == 2) return uColor3;
    if (index == 3) return uColor4;
    return uColor5;
  }

  float getOrbSize(int index, float time) {
    float i = float(index);
    float base = uOrbSize * (0.8 + i * 0.1);
    float pulse = sin(time * (0.5 + i * 0.2)) * 0.1 + 1.0;
    return base * pulse;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Start with background
    vec3 color = uBackgroundColor;
    
    // Add each orb with soft blending
    for (int i = 0; i < 5; i++) {
      vec2 orbPos = getOrbPosition(i, time);
      vec3 orbColor = getOrbColor(i);
      float orbSize = getOrbSize(i, time);
      
      // Distance from orb center
      float dist = length(uv - orbPos);
      
      // Soft falloff based on blur
      float falloff = 1.0 - smoothstep(0.0, orbSize * (1.0 + uBlur), dist);
      falloff = pow(falloff, 2.0 - uBlur);
      
      // Blend orb color
      color = mix(color, orbColor, falloff * 0.7);
    }
    
    // Add subtle noise for texture
    float noise = fract(sin(dot(uv * 1000.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.02;
    
    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.2);
    color *= 0.9 + vignette * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GradientOrbsPlane({
  colors,
  backgroundColor,
  blur,
  orbSize,
  speed,
}: {
  colors: THREE.Color[];
  backgroundColor: THREE.Color;
  blur: number;
  orbSize: number;
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
      uBackgroundColor: { value: backgroundColor },
      uBlur: { value: blur },
      uOrbSize: { value: orbSize },
    }),
    [colors, backgroundColor, blur, orbSize],
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
 * `GradientOrbs` creates soft, floating gradient orbs that move organically.
 * Similar to iOS/macOS dynamic wallpapers with beautiful color blending.
 *
 * @example
 * ```tsx
 * // Soft pastels
 * <GradientOrbs
 *   colors={["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"]}
 *   backgroundColor="#1e1b4b"
 * />
 *
 * // Vibrant
 * <GradientOrbs
 *   colors={["#ff0080", "#7928ca", "#0070f3", "#00dfd8", "#ff4d4d"]}
 *   blur={0.8}
 * />
 * ```
 */
export const GradientOrbs = ({
  colors = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"],
  backgroundColor = "#1e1b4b",
  speed = 1,
  blur = 0.6,
  orbSize = 0.3,
  width,
  height,
}: GradientOrbsProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 5) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 5).map((c) => new THREE.Color(c));
  }, [colors]);

  const bgColor = useMemo(
    () => new THREE.Color(backgroundColor),
    [backgroundColor],
  );

  return (
    <div style={{ width: w, height: h, position: "absolute", inset: 0 }}>
      <ThreeCanvas
        width={w}
        height={h}
        camera={{ position: [0, 0, 1], fov: 90 }}
      >
        <GradientOrbsPlane
          colors={threeColors}
          backgroundColor={bgColor}
          blur={blur}
          orbSize={orbSize}
          speed={speed}
        />
      </ThreeCanvas>
    </div>
  );
};
