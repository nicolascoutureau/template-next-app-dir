import { useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type ShimmerProps = {
  color?: string;
  width?: number;
  height?: number;
  speed?: number;
  angle?: number;
  thickness?: number;
  softness?: number;
  position?: [number, number, number];
  loop?: boolean;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uAngle;
  uniform float uThickness;
  uniform float uSoftness;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float cosA = cos(uAngle);
    float sinA = sin(uAngle);
    float rotatedX = center.x * cosA - center.y * sinA;

    float pos = rotatedX + 0.5;
    float shimmerPos = uProgress * 2.0 - 0.5;

    float dist = abs(pos - shimmerPos);
    float shimmer = 1.0 - smoothstep(0.0, uThickness + uSoftness, dist);
    shimmer *= smoothstep(uThickness, 0.0, dist - uSoftness * 0.5);

    gl_FragColor = vec4(uColor, shimmer);
  }
`;

export const Shimmer = ({
  color = "#ffffff",
  width = 4,
  height = 2,
  speed = 1,
  angle = -0.5,
  thickness = 0.1,
  softness = 0.15,
  position = [0, 0, 0],
  loop = true,
}: ShimmerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const shimmerColor = useMemo(() => new THREE.Color(color), [color]);

  const uniforms = useMemo(
    () => ({
      uColor: { value: shimmerColor },
      uProgress: { value: 0 },
      uAngle: { value: angle },
      uThickness: { value: thickness },
      uSoftness: { value: softness },
    }),
    [shimmerColor, angle, thickness, softness]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const cycleDuration = durationInFrames / speed;
      const progress = loop
        ? (frameRef.current % cycleDuration) / cycleDuration
        : Math.min(frameRef.current / cycleDuration, 1);
      material.uniforms.uProgress.value = progress;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
