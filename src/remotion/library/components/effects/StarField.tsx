import React, { useMemo, useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface StarFieldProps {
  /** Number of stars */
  count?: number;
  /** Speed of movement (positive = forward/warp, negative = backward) */
  speed?: number;
  /** Star color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Star size range [min, max] */
  size?: [number, number];
  /** Field depth (perspective) */
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 3D Starfield / Warp speed effect.
 * 
 * @example
 * <StarField speed={2} count={2000} />
 */
export const StarField: React.FC<StarFieldProps> = ({
  count = 1000,
  speed = 5,
  color = "#ffffff",
  backgroundColor = "#000000",
  size = [0.5, 3],
  depth = 1000,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Generate stars with deterministic positions based on count
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Deterministic random
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1; // -1 to 1 range logic handled below
      const y = (Math.cos(i * 12.9898) * 43758.5453) % 1;
      const z = (Math.sin(i * 78.233) * 43758.5453) % 1;
      
      arr.push({
        x: (x - 0.5) * 2 * width, // -width to width
        y: (y - 0.5) * 2 * height, // -height to height
        z: Math.abs(z) * depth, // 0 to depth
        size: size[0] + Math.abs(x * y) * (size[1] - size[0]),
      });
    }
    return arr;
  }, [count, width, height, depth, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const time = frame / fps;
    const zOffset = time * speed * 100;

    ctx.fillStyle = color;

    for (let i = 0; i < count; i++) {
      const star = stars[i];
      
      // Move star Z
      // Wrap around depth
      let z = (star.z - zOffset) % depth;
      if (z < 0) z += depth;
      
      // Project 3D to 2D
      // Perspective formula: x' = x * (focalLength / z)
      // We avoid z=0 division
      const scale = depth / (z || 1);
      const x2d = star.x * scale + cx;
      const y2d = star.y * scale + cy;

      // Draw only if within bounds
      if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
        // Size scales with proximity
        const s = Math.max(0.1, star.size * scale * (scale / 10)); // Scale correction
        
        // Opacity fades at distance
        const opacity = Math.min(1, scale / 2);
        
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x2d, y2d, s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [frame, fps, width, height, stars, speed, color, backgroundColor, depth, count]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};

export default StarField;
