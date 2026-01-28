import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Plasma style preset.
 */
export type PlasmaStyle = "classic" | "neon" | "fire" | "ocean" | "psychedelic";

/**
 * Props for the `PlasmaBackground` component.
 */
export type PlasmaBackgroundProps = {
  /** Plasma style preset. */
  style?: PlasmaStyle;
  /** Custom colors (overrides style preset). */
  colors?: string[];
  /** Speed of the animation. */
  speed?: number;
  /** Complexity of the plasma pattern. */
  complexity?: number;
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
  uniform float uComplexity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Multiple sine waves for plasma effect
    float plasma = 0.0;
    
    // Layer 1: Horizontal waves
    plasma += sin(uv.x * 10.0 * uComplexity + time * 2.0);
    
    // Layer 2: Vertical waves
    plasma += sin(uv.y * 10.0 * uComplexity + time * 1.5);
    
    // Layer 3: Diagonal waves
    plasma += sin((uv.x + uv.y) * 8.0 * uComplexity + time * 1.0);
    
    // Layer 4: Circular waves
    float cx = uv.x - 0.5;
    float cy = uv.y - 0.5;
    plasma += sin(sqrt(cx * cx + cy * cy) * 20.0 * uComplexity - time * 3.0);
    
    // Layer 5: Complex interference
    plasma += sin(uv.x * 5.0 * uComplexity + sin(uv.y * 8.0 + time));
    plasma += sin(uv.y * 5.0 * uComplexity + sin(uv.x * 8.0 + time * 0.8));
    
    // Normalize
    plasma = plasma / 6.0;
    plasma = plasma * 0.5 + 0.5;
    
    // Create color bands
    vec3 color;
    float t = plasma;
    
    if (t < 0.25) {
      color = mix(uColor1, uColor2, t * 4.0);
    } else if (t < 0.5) {
      color = mix(uColor2, uColor3, (t - 0.25) * 4.0);
    } else if (t < 0.75) {
      color = mix(uColor3, uColor4, (t - 0.5) * 4.0);
    } else {
      color = mix(uColor4, uColor1, (t - 0.75) * 4.0);
    }
    
    // Add subtle glow
    float glow = smoothstep(0.3, 0.7, plasma) * 0.2;
    color += glow;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function PlasmaPlane({
  colors,
  complexity,
  speed,
}: {
  colors: THREE.Color[];
  complexity: number;
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
      uComplexity: { value: complexity },
    }),
    [colors, complexity],
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

const stylePresets: Record<PlasmaStyle, string[]> = {
  classic: ["#000080", "#0080ff", "#00ff80", "#ffff00"],
  neon: ["#ff00ff", "#00ffff", "#ff0080", "#8000ff"],
  fire: ["#1a0000", "#8b0000", "#ff4500", "#ffd700"],
  ocean: ["#001f3f", "#003366", "#006699", "#00ccff"],
  psychedelic: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
};

/**
 * `PlasmaBackground` creates a classic plasma effect with modern aesthetics.
 * Features smooth color cycling and wave interference patterns.
 *
 * @example
 * ```tsx
 * // Classic blue plasma
 * <PlasmaBackground style="classic" />
 *
 * // Neon cyberpunk
 * <PlasmaBackground style="neon" complexity={1.5} />
 *
 * // Custom colors
 * <PlasmaBackground
 *   colors={["#1a1a2e", "#e94560", "#ff6b6b", "#ffd93d"]}
 * />
 * ```
 */
export const PlasmaBackground = ({
  style = "classic",
  colors,
  speed = 1,
  complexity = 1,
  width,
  height,
}: PlasmaBackgroundProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const threeColors = useMemo(() => {
    const colorArray = colors || stylePresets[style];
    return colorArray.slice(0, 4).map((c) => new THREE.Color(c));
  }, [colors, style]);

  return (
    <div style={{ width: w, height: h, position: "absolute", inset: 0 }}>
      <ThreeCanvas
        width={w}
        height={h}
        camera={{ position: [0, 0, 1], fov: 90 }}
      >
        <PlasmaPlane colors={threeColors} complexity={complexity} speed={speed} />
      </ThreeCanvas>
    </div>
  );
};
