import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import * as THREE from "three";

interface AnimatedSphereProps {
  color: string;
  position?: [number, number, number];
  delay?: number;
}

export const AnimatedSphere: React.FC<AnimatedSphereProps> = ({
  color,
  position = [0, 0, 0],
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  // Entrance animation with spring
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 80,
      stiffness: 150,
      mass: 0.8,
    },
    delay,
  });

  // Pulsing animation
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 4),
    [-1, 1],
    [0.95, 1.05]
  );

  const scale = entrance * pulse;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};
