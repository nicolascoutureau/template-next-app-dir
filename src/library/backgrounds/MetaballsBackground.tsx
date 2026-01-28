import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `MetaballsBackground` component.
 */
export type MetaballsBackgroundProps = {
  /** Primary blob color. */
  primaryColor?: string;
  /** Secondary blob color. */
  secondaryColor?: string;
  /** Background color. */
  backgroundColor?: string;
  /** Number of metaballs. */
  ballCount?: number;
  /** Speed of the animation. */
  speed?: number;
  /** Edge sharpness (0-1, lower = softer). */
  sharpness?: number;
  /** Enable glow effect. */
  glow?: boolean;
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
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uBackgroundColor;
  uniform float uSharpness;
  uniform bool uGlow;
  varying vec2 vUv;

  // Metaball positions are calculated based on time
  vec2 getBallPosition(int index, float time) {
    float i = float(index);
    float angle = time * (0.5 + i * 0.1) + i * 1.047; // Different speeds
    float radius = 0.2 + sin(time * 0.3 + i) * 0.1;
    
    if (index == 0) {
      return vec2(0.5 + cos(angle) * radius, 0.5 + sin(angle) * radius);
    } else if (index == 1) {
      return vec2(0.5 + cos(angle * 0.7 + 2.0) * radius * 1.2, 0.5 + sin(angle * 0.7 + 2.0) * radius * 1.2);
    } else if (index == 2) {
      return vec2(0.5 + cos(angle * 0.5 + 4.0) * radius * 0.8, 0.5 + sin(angle * 0.5 + 4.0) * radius * 0.8);
    } else if (index == 3) {
      return vec2(0.3 + sin(time * 0.4) * 0.15, 0.5 + cos(time * 0.6) * 0.2);
    } else if (index == 4) {
      return vec2(0.7 + cos(time * 0.35) * 0.15, 0.5 + sin(time * 0.55) * 0.2);
    } else if (index == 5) {
      return vec2(0.5 + sin(time * 0.25) * 0.25, 0.3 + cos(time * 0.45) * 0.15);
    } else if (index == 6) {
      return vec2(0.5 + cos(time * 0.3) * 0.2, 0.7 + sin(time * 0.5) * 0.15);
    } else {
      return vec2(0.5 + sin(time * 0.2 + i) * 0.3, 0.5 + cos(time * 0.3 + i) * 0.3);
    }
  }

  float getBallRadius(int index, float time) {
    float i = float(index);
    float base = 0.08 + i * 0.01;
    float pulse = sin(time * (1.0 + i * 0.2)) * 0.02;
    return base + pulse;
  }

  float metaball(vec2 uv, vec2 center, float radius) {
    float dist = length(uv - center);
    return (radius * radius) / (dist * dist + 0.001);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Accumulate metaball field
    float field = 0.0;
    float colorMix = 0.0;
    
    for (int i = 0; i < 8; i++) {
      vec2 pos = getBallPosition(i, time);
      float radius = getBallRadius(i, time);
      float contribution = metaball(uv, pos, radius);
      field += contribution;
      
      // Track color mixing based on distance
      float dist = length(uv - pos);
      colorMix += contribution * float(i) / 8.0;
    }
    
    // Normalize color mix
    if (field > 0.0) {
      colorMix /= field;
    }
    
    // Apply threshold with adjustable sharpness
    float threshold = 1.0;
    float edge = smoothstep(threshold - uSharpness, threshold + uSharpness * 0.1, field);
    
    // Color based on field strength and position
    vec3 blobColor = mix(uPrimaryColor, uSecondaryColor, colorMix);
    
    // Add internal shading
    float internalShade = smoothstep(threshold, threshold + 2.0, field);
    blobColor = mix(blobColor, blobColor * 1.3, internalShade * 0.3);
    
    // Glow effect
    vec3 glowColor = vec3(0.0);
    if (uGlow) {
      float glowField = smoothstep(threshold - 0.5, threshold, field);
      glowColor = mix(uPrimaryColor, uSecondaryColor, 0.5) * glowField * 0.3 * (1.0 - edge);
    }
    
    // Final color
    vec3 color = mix(uBackgroundColor + glowColor, blobColor, edge);
    
    // Subtle highlight on blobs
    float highlight = smoothstep(threshold + 1.0, threshold + 3.0, field) * 0.2;
    color += vec3(highlight);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function MetaballsPlane({
  primaryColor,
  secondaryColor,
  backgroundColor,
  sharpness,
  glow,
  speed,
}: {
  primaryColor: THREE.Color;
  secondaryColor: THREE.Color;
  backgroundColor: THREE.Color;
  sharpness: number;
  glow: boolean;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPrimaryColor: { value: primaryColor },
      uSecondaryColor: { value: secondaryColor },
      uBackgroundColor: { value: backgroundColor },
      uSharpness: { value: sharpness },
      uGlow: { value: glow },
    }),
    [primaryColor, secondaryColor, backgroundColor, sharpness, glow],
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
 * `MetaballsBackground` creates organic, blobby shapes that merge and separate.
 * Perfect for modern, playful backgrounds with a liquid feel.
 *
 * @example
 * ```tsx
 * // Purple blobs
 * <MetaballsBackground
 *   primaryColor="#8b5cf6"
 *   secondaryColor="#ec4899"
 *   backgroundColor="#1a1a2e"
 * />
 *
 * // Soft organic
 * <MetaballsBackground
 *   primaryColor="#22c55e"
 *   secondaryColor="#06b6d4"
 *   sharpness={0.3}
 *   glow={true}
 * />
 * ```
 */
export const MetaballsBackground = ({
  primaryColor = "#8b5cf6",
  secondaryColor = "#ec4899",
  backgroundColor = "#1a1a2e",
  speed = 1,
  sharpness = 0.5,
  glow = true,
  width,
  height,
}: MetaballsBackgroundProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const primary = useMemo(
    () => new THREE.Color(primaryColor),
    [primaryColor],
  );
  const secondary = useMemo(
    () => new THREE.Color(secondaryColor),
    [secondaryColor],
  );
  const background = useMemo(
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
        <MetaballsPlane
          primaryColor={primary}
          secondaryColor={secondary}
          backgroundColor={background}
          sharpness={sharpness}
          glow={glow}
          speed={speed}
        />
      </ThreeCanvas>
    </div>
  );
};
