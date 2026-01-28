import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedSphere } from "./AnimatedSphere";

interface OrbitingObjectsProps {
  count?: number;
  radius?: number;
  colors?: string[];
}

export const OrbitingObjects: React.FC<OrbitingObjectsProps> = ({
  count = 4,
  radius = 3,
  colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate positions for orbiting objects
  const objects = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (frame / fps) * 0.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2) * 0.5;

    return {
      position: [x, y, z] as [number, number, number],
      color: colors[i % colors.length],
      delay: i * 5,
    };
  });

  return (
    <>
      {objects.map((obj, index) => (
        <AnimatedSphere
          key={index}
          color={obj.color}
          position={obj.position}
          delay={obj.delay}
        />
      ))}
    </>
  );
};
