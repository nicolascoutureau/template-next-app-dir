import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `SoftBlobs` component.
 */
export type SoftBlobsProps = {
  /** Primary blob color. */
  primaryColor?: string;
  /** Secondary blob color. */
  secondaryColor?: string;
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the animation (0.1-0.4 recommended for premium feel). */
  speed?: number;
  /** Softness of blob edges (0.5-1.0 for subtle). */
  softness?: number;
  /** Opacity of blobs against background (0.3-0.6 for subtle). */
  opacity?: number;
};

/** @deprecated Use SoftBlobsProps instead */
export type MetaballsBackgroundProps = SoftBlobsProps;

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
  uniform float uSoftness;
  uniform float uOpacity;
  varying vec2 vUv;

  // Slow, breathing positions for 4 blobs
  vec2 getBlobPosition(int index, float time) {
    float i = float(index);
    // Very slow motion
    float angle = time * (0.04 + i * 0.01) + i * 1.57; // PI/2 offset
    float radius = 0.08 + sin(time * 0.02 + i) * 0.03;
    
    if (index == 0) {
      // Top-left quadrant
      return vec2(0.35, 0.38) + vec2(cos(angle) * radius, sin(angle) * radius);
    } else if (index == 1) {
      // Top-right quadrant
      return vec2(0.62, 0.42) + vec2(sin(angle * 0.8) * radius, cos(angle * 0.8) * radius);
    } else if (index == 2) {
      // Bottom-center
      return vec2(0.48, 0.62) + vec2(cos(angle * 0.6 + 1.0) * radius * 0.9, sin(angle * 0.6 + 1.0) * radius * 0.9);
    } else {
      // Center-left
      return vec2(0.42, 0.5) + vec2(sin(angle * 0.5) * radius * 0.7, cos(angle * 0.5) * radius * 0.7);
    }
  }

  float getBlobRadius(int index, float time) {
    float i = float(index);
    float base = 0.12 + i * 0.02;
    // Very gentle breathing
    float pulse = sin(time * (0.06 + i * 0.01)) * 0.01;
    return base + pulse;
  }

  float softBlob(vec2 uv, vec2 center, float radius, float softness) {
    float dist = length(uv - center);
    // Soft gaussian-like falloff
    float blob = exp(-dist * dist / (radius * radius * (1.0 + softness)));
    return blob;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Start with background
    vec3 color = uBackgroundColor;
    
    // Accumulate blob contributions
    float totalInfluence = 0.0;
    vec3 blobColorSum = vec3(0.0);
    
    for (int i = 0; i < 4; i++) {
      vec2 pos = getBlobPosition(i, time);
      float radius = getBlobRadius(i, time);
      float blob = softBlob(uv, pos, radius, uSoftness);
      
      // Alternate between colors
      vec3 blobColor = (i % 2 == 0) ? uPrimaryColor : uSecondaryColor;
      
      blobColorSum += blobColor * blob;
      totalInfluence += blob;
    }
    
    // Strong blend - opacity has significant impact
    if (totalInfluence > 0.001) {
      vec3 blendedBlob = blobColorSum / max(totalInfluence, 1.0);
      float blendAmount = min(totalInfluence * 2.0, 1.0) * uOpacity * 1.3;
      color = mix(color, blendedBlob, blendAmount);
    }
    
    // Film grain
    float grain = fract(sin(dot(uv * 350.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.01;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 1.1);
    color *= 0.9 + vignette * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `SoftBlobs` creates gentle, organic shapes that slowly drift and merge.
 * Designed for premium, subtle backgrounds with soft focus aesthetic.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <SoftBlobs
 *     primaryColor="#4a5568"
 *     secondaryColor="#553c5e"
 *     backgroundColor="#1a1a2e"
 *     speed={0.25}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const SoftBlobs = ({
  primaryColor = "#5a6580",
  secondaryColor = "#6a4a70",
  backgroundColor = "#1a1a2e",
  speed = 0.25,
  softness = 0.7,
  opacity = 0.8,
}: SoftBlobsProps) => {
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

  const primary = useMemo(() => new THREE.Color(primaryColor), [primaryColor]);
  const secondary = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);
  const background = useMemo(() => new THREE.Color(backgroundColor), [backgroundColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPrimaryColor: { value: primary },
      uSecondaryColor: { value: secondary },
      uBackgroundColor: { value: background },
      uSoftness: { value: softness },
      uOpacity: { value: opacity },
    }),
    [primary, secondary, background, softness, opacity],
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

/** @deprecated Use SoftBlobs instead */
export const MetaballsBackground = SoftBlobs;
