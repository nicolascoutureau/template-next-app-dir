import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `WaveGridBackground` component.
 */
export type WaveGridBackgroundProps = {
  /** Grid line color. */
  lineColor?: string;
  /** Glow color for the lines. */
  glowColor?: string;
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the wave animation. */
  speed?: number;
  /** Grid density (lines per unit). */
  gridDensity?: number;
  /** Wave amplitude. */
  amplitude?: number;
  /** Perspective tilt (0-1). */
  perspective?: number;
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
  uniform vec3 uLineColor;
  uniform vec3 uGlowColor;
  uniform vec3 uBackgroundColor;
  uniform float uGridDensity;
  uniform float uAmplitude;
  uniform float uPerspective;
  varying vec2 vUv;

  float wave(vec2 p, float time) {
    return sin(p.x * 3.0 + time) * sin(p.y * 2.0 + time * 0.7) * uAmplitude;
  }

  float grid(vec2 p, float width) {
    vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    return min(grid.x, grid.y);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Apply perspective transformation
    vec2 perspUv = uv;
    perspUv.y = pow(perspUv.y, 1.0 + uPerspective);
    
    // Scale based on perspective (further = denser grid)
    float perspScale = 1.0 + (1.0 - uv.y) * uPerspective * 3.0;
    
    // Create wave distortion
    float waveOffset = wave(perspUv * 5.0, time);
    vec2 distortedUv = perspUv + vec2(waveOffset * 0.1, waveOffset * 0.05);
    
    // Grid coordinates
    vec2 gridCoord = distortedUv * uGridDensity * perspScale;
    
    // Calculate grid lines
    float gridLine = grid(gridCoord, 1.0);
    float line = 1.0 - smoothstep(0.0, 1.5, gridLine);
    
    // Add glowing effect based on wave height
    float glowIntensity = (waveOffset + uAmplitude) / (2.0 * uAmplitude);
    glowIntensity = smoothstep(0.3, 0.8, glowIntensity);
    
    // Color the grid
    vec3 gridColor = mix(uLineColor, uGlowColor, glowIntensity);
    
    // Add horizon glow
    float horizonGlow = smoothstep(0.0, 0.3, uv.y) * 0.3;
    vec3 horizonColor = uGlowColor * horizonGlow;
    
    // Fade grid with distance (perspective)
    float distanceFade = smoothstep(0.0, 0.5, uv.y);
    line *= distanceFade;
    
    // Add scanline effect
    float scanline = sin(uv.y * 200.0 + time * 10.0) * 0.02 + 0.98;
    
    // Final color
    vec3 color = uBackgroundColor + horizonColor;
    color = mix(color, gridColor, line * 0.8);
    color *= scanline;
    
    // Add subtle bloom on lines
    float bloom = line * glowIntensity * 0.3;
    color += uGlowColor * bloom;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `WaveGridBackground` creates a retro-futuristic grid with wave animation.
 * Perfect for synthwave, vaporwave, or sci-fi aesthetics.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <WaveGridBackground
 *     lineColor="#ff00ff"
 *     glowColor="#00ffff"
 *     backgroundColor="#0a0015"
 *   />
 * </ThreeCanvas>
 * ```
 */
export const WaveGridBackground = ({
  lineColor = "#ff00ff",
  glowColor = "#00ffff",
  backgroundColor = "#0a0015",
  speed = 1,
  gridDensity = 20,
  amplitude = 0.2,
  perspective = 0.5,
}: WaveGridBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line = useMemo(() => new THREE.Color(lineColor), [lineColor]);
  const glow = useMemo(() => new THREE.Color(glowColor), [glowColor]);
  const background = useMemo(() => new THREE.Color(backgroundColor), [backgroundColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLineColor: { value: line },
      uGlowColor: { value: glow },
      uBackgroundColor: { value: background },
      uGridDensity: { value: gridDensity },
      uAmplitude: { value: amplitude },
      uPerspective: { value: perspective },
    }),
    [line, glow, background, gridDensity, amplitude, perspective],
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
