import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Aurora style preset - muted, sophisticated palettes.
 */
export type AuroraStyle = "midnight" | "dusk" | "dawn" | "forest" | "ocean";

/** @deprecated Use AuroraStyle instead */
export type PlasmaStyle = AuroraStyle;

/**
 * Props for the `AuroraBackground` component.
 */
export type AuroraBackgroundProps = {
  /** Aurora style preset. */
  style?: AuroraStyle;
  /** Custom colors (overrides style preset). */
  colors?: string[];
  /** Speed of the animation (0.1-0.4 recommended for premium feel). */
  speed?: number;
  /** Intensity of the aurora effect (0.3-0.7 for subtle). */
  intensity?: number;
};

/** @deprecated Use AuroraBackgroundProps instead */
export type PlasmaBackgroundProps = AuroraBackgroundProps;

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
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Rich flowing waves
    float wave = 0.0;
    
    // Horizontal drift
    wave += sin(uv.x * 3.5 + time * 0.25) * 0.5;
    
    // Vertical undulation
    wave += sin(uv.y * 3.0 + time * 0.2) * 0.4;
    
    // Diagonal flow
    wave += sin((uv.x + uv.y) * 2.0 + time * 0.15) * 0.3;
    
    // Circular breathing from center
    float cx = uv.x - 0.5;
    float cy = uv.y - 0.5;
    wave += sin(sqrt(cx * cx + cy * cy) * 6.0 - time * 0.2) * 0.3;
    
    // Normalize to 0-1
    wave = wave * 0.35 + 0.5;
    wave = clamp(wave, 0.0, 1.0);
    
    // Smooth color transitions
    vec3 color;
    float t = wave;
    
    // Smooth interpolation between colors
    if (t < 0.5) {
      color = mix(uColor1, uColor2, t * 2.0);
    } else {
      color = mix(uColor2, uColor3, (t - 0.5) * 2.0);
    }
    
    // Strong blend - intensity controls visibility
    color = mix(uColor1, color, uIntensity * 1.3);
    
    // Subtle film grain
    float grain = fract(sin(dot(uv * 400.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.01;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 1.1);
    color *= 0.92 + vignette * 0.08;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Rich color palettes with strong contrast
const stylePresets: Record<AuroraStyle, string[]> = {
  midnight: ["#1a1a2e", "#4a4a70", "#7070a0"],
  dusk: ["#1f1d2b", "#4a4065", "#705a90"],
  dawn: ["#1a1a2e", "#4a4560", "#6a6080"],
  forest: ["#1a2420", "#355a45", "#4a7a5a"],
  ocean: ["#1a1f2e", "#355570", "#4a7090"],
};

/**
 * `AuroraBackground` creates a subtle, flowing aurora-like effect.
 * Designed for premium motion design with gentle color transitions.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <AuroraBackground style="midnight" speed={0.25} />
 * </ThreeCanvas>
 * ```
 */
export const AuroraBackground = ({
  style = "midnight",
  colors,
  speed = 0.25,
  intensity = 0.85,
}: AuroraBackgroundProps) => {
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
    const colorArray = colors || stylePresets[style];
    const normalized = [...colorArray];
    while (normalized.length < 3) {
      normalized.push(normalized[normalized.length - 1]);
    }
    return normalized.slice(0, 3).map((c) => new THREE.Color(c));
  }, [colors, style]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uIntensity: { value: intensity },
    }),
    [threeColors, intensity],
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

/** @deprecated Use AuroraBackground instead */
export const PlasmaBackground = AuroraBackground;
