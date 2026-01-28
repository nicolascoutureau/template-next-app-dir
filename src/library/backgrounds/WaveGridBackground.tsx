import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `SubtleGrid` component.
 */
export type SubtleGridProps = {
  /** Grid line color. */
  lineColor?: string;
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the subtle animation (0.1-0.3 recommended). */
  speed?: number;
  /** Grid density (8-15 for subtle). */
  gridDensity?: number;
  /** Line opacity (0.05-0.2 for subtle). */
  lineOpacity?: number;
  /** Enable gentle breathing animation. */
  breathing?: boolean;
};

/** @deprecated Use SubtleGridProps instead */
export type WaveGridBackgroundProps = SubtleGridProps;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uLineColor;
  uniform vec3 uBackgroundColor;
  uniform float uGridDensity;
  uniform float uLineOpacity;
  uniform bool uBreathing;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Grid coordinates
    vec2 gridCoord = uv * uGridDensity;
    
    // Calculate grid lines using smoothstep for consistent rendering
    float lineWidth = 0.04; // Line thickness
    vec2 gridFract = fract(gridCoord);
    
    // Create lines at grid edges
    float lineX = smoothstep(0.0, lineWidth, gridFract.x) * smoothstep(0.0, lineWidth, 1.0 - gridFract.x);
    float lineY = smoothstep(0.0, lineWidth, gridFract.y) * smoothstep(0.0, lineWidth, 1.0 - gridFract.y);
    
    // Combine for grid pattern (1 = no line, 0 = line)
    float gridMask = lineX * lineY;
    float line = 1.0 - gridMask;
    
    // Breathing effect on opacity
    float breathingFactor = 1.0;
    if (uBreathing) {
      breathingFactor = 0.7 + sin(time * 0.2) * 0.3;
    }
    
    // Position-based variation (slightly brighter at center)
    float posVariation = 1.0 - length(uv - 0.5) * 0.3;
    
    // Final line intensity
    float lineIntensity = line * uLineOpacity * breathingFactor * posVariation;
    
    // Color blend
    vec3 color = mix(uBackgroundColor, uLineColor, lineIntensity);
    
    // Subtle film grain
    float grain = fract(sin(dot(uv * 300.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.008;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.6, 1.5, length(uv - 0.5) * 1.0);
    color *= 0.95 + vignette * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `SubtleGrid` creates a minimal, elegant grid pattern with optional breathing animation.
 * Designed for premium backgrounds that add structure without distraction.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <SubtleGrid
 *     lineColor="#3a3a4a"
 *     backgroundColor="#1a1a2e"
 *     lineOpacity={0.12}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const SubtleGrid = ({
  lineColor = "#6a6a8a",
  backgroundColor = "#1a1a2e",
  speed = 0.2,
  gridDensity = 10,
  lineOpacity = 0.5,
  breathing = true,
}: SubtleGridProps) => {
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

  const line = useMemo(() => new THREE.Color(lineColor), [lineColor]);
  const background = useMemo(() => new THREE.Color(backgroundColor), [backgroundColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLineColor: { value: line },
      uBackgroundColor: { value: background },
      uGridDensity: { value: gridDensity },
      uLineOpacity: { value: lineOpacity },
      uBreathing: { value: breathing },
    }),
    [line, background, gridDensity, lineOpacity, breathing],
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

/** @deprecated Use SubtleGrid instead */
export const WaveGridBackground = SubtleGrid;
