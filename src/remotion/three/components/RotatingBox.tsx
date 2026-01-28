import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

interface RotatingBoxProps {
  color: string;
  rotationSpeed?: number;
}

export const RotatingBox: React.FC<RotatingBoxProps> = ({
  color,
  rotationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  // Use spring for smooth entrance animation
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  // Calculate rotation based on frame
  const rotationY = (frame / fps) * Math.PI * rotationSpeed;
  const rotationX = (frame / fps) * Math.PI * 0.5 * rotationSpeed;

  // Scale animation for entrance
  const scale = entrance;

  // Optional: Use useFrame for smoother animations (works in preview)
  useFrame(() => {
    if (meshRef.current) {
      // This runs every frame in preview mode for smooth animations
      // The actual rotation is handled by Remotion's frame system
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[2, 2, 2]}
      radius={0.1}
      smoothness={4}
      scale={scale}
      rotation={[rotationX, rotationY, 0]}
    >
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </RoundedBox>
  );
};
