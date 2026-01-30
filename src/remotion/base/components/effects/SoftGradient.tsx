import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Props for SoftGradient component.
 */
export interface SoftGradientProps {
  children?: ReactNode;
  /** Array of colors for mesh points */
  colors: string[];
  /** Animation speed */
  speed?: number;
  /** Blur amount for soft blending */
  blur?: number;
  /** Number of blobs (defaults to colors.length) */
  blobCount?: number;
  /** Opacity of the blobs */
  opacity?: number;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Soft mesh gradient background with animated overlapping radial gradients.
 *
 * @example
 * // Basic mesh gradient
 * <SoftGradient colors={["#667eea", "#764ba2"]}>
 *   <Content />
 * </SoftGradient>
 *
 * @example
 * // Multi-color with custom speed
 * <SoftGradient
 *   colors={["#ff6b6b", "#feca57", "#48dbfb", "#22c55e"]}
 *   speed={0.5}
 *   blur={100}
 * >
 *   <Content />
 * </SoftGradient>
 *
 * @example
 * // Subtle background
 * <SoftGradient
 *   colors={["#1a1a2e", "#16213e", "#0f3460"]}
 *   speed={0.2}
 *   opacity={0.6}
 * />
 */
export const SoftGradient: React.FC<SoftGradientProps> = ({
  children,
  colors,
  speed = 0.3,
  blur = 80,
  blobCount,
  opacity = 0.8,
  width = "100%",
  height = "100%",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame / fps;
  const numBlobs = blobCount ?? colors.length;

  // Generate animated blob positions
  const blobs = useMemo(() => {
    return Array.from({ length: numBlobs }, (_, index) => {
      const colorIndex = index % colors.length;
      const color = colors[colorIndex];

      const baseAngle = (index / numBlobs) * Math.PI * 2;
      const animatedAngle = baseAngle + time * speed;

      // Circular motion with different radii
      const radius = 20 + (index % 3) * 10;
      const x = 50 + Math.cos(animatedAngle) * radius;
      const y = 50 + Math.sin(animatedAngle) * radius;

      return {
        color,
        x,
        y,
        size: 60 + (index % 2) * 20,
      };
    });
  }, [colors, numBlobs, time, speed]);

  const containerStyle: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    background: colors[0],
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Mesh blobs */}
      {blobs.map((blob, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}%`,
            height: `${blob.size}%`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: `blur(${blur}px)`,
            opacity,
          }}
        />
      ))}

      {/* Content */}
      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default SoftGradient;
