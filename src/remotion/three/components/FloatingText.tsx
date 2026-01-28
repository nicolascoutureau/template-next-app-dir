import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Center } from "@react-three/drei";

interface FloatingTextProps {
  text: string;
  color?: string;
  position?: [number, number, number];
  size?: number;
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  color = "#ffffff",
  position = [0, -2, 0],
  size = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation with spring
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
    delay: 15,
  });

  // Floating animation
  const floatY = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [-0.1, 0.1]);

  const scale = entrance;
  const yOffset = position[1] + floatY;

  return (
    <Center position={[position[0], yOffset, position[2]]}>
      <mesh scale={scale}>
        <planeGeometry args={[text.length * size * 0.6, size * 1.2]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>
    </Center>
  );
};
