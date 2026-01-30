import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Noise } from "./Noise";

export interface GradientMeshProps {
  colors?: string[];
  speed?: number;
  blur?: number;
  opacity?: number;
  noise?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * High-quality fluid gradient mesh background.
 * Creates an organic, moving gradient effect using multiple colored blobs.
 * 
 * @example
 * <GradientMesh 
 *   colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00"]} 
 *   speed={0.5} 
 *   blur={100} 
 * />
 */
export const GradientMesh: React.FC<GradientMeshProps> = ({
  colors = ["#4158D0", "#C850C0", "#FFCC70", "#4158D0"],
  speed = 0.5,
  blur = 120,
  opacity = 1,
  noise = 0.05,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Generate blob positions based on time
  const blobs = useMemo(() => {
    const time = (frame / fps) * speed;
    
    return colors.map((color, i) => {
      // Create pseudo-random movement for each blob
      // Using sin/cos with different frequencies to avoid repetition
      const seed = i * 1000;
      const x = 50 + Math.sin(time * 0.5 + seed) * 30; // 20% to 80%
      const y = 50 + Math.cos(time * 0.3 + seed * 1.5) * 30; // 20% to 80%
      const scale = 1 + Math.sin(time * 0.2 + seed) * 0.3; // Pulse size
      
      return {
        color,
        x,
        y,
        scale,
      };
    });
  }, [colors, frame, fps, speed]);

  return (
    <AbsoluteFill 
      className={className} 
      style={{ 
        backgroundColor: colors[0], 
        overflow: "hidden",
        opacity,
        ...style 
      }}
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: "60%",
            height: "60%",
            backgroundColor: blob.color,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${blob.scale})`,
            filter: `blur(${blur}px)`,
            opacity: 0.8,
          }}
        />
      ))}
      
      {noise > 0 && <Noise opacity={noise} />}
    </AbsoluteFill>
  );
};

export default GradientMesh;
