import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolateColors,
  AbsoluteFill,
} from "remotion";

/**
 * Position configuration for a color point.
 */
export interface ColorPoint {
  /** X position (0-100, percentage from left) */
  x: number;
  /** Y position (0-100, percentage from top) */
  y: number;
}

/**
 * Preset positions for 4-color gradients.
 */
export const gradientPositions = {
  /** Colors at each corner */
  corners: {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 100, y: 0 },
    bottomLeft: { x: 0, y: 100 },
    bottomRight: { x: 100, y: 100 },
  },
  /** Colors centered on each edge */
  edges: {
    topLeft: { x: 25, y: 25 },
    topRight: { x: 75, y: 25 },
    bottomLeft: { x: 25, y: 75 },
    bottomRight: { x: 75, y: 75 },
  },
  /** Colors in a diamond pattern */
  diamond: {
    topLeft: { x: 50, y: 10 },
    topRight: { x: 90, y: 50 },
    bottomLeft: { x: 10, y: 50 },
    bottomRight: { x: 50, y: 90 },
  },
  /** Colors clustered toward center */
  centered: {
    topLeft: { x: 30, y: 30 },
    topRight: { x: 70, y: 30 },
    bottomLeft: { x: 30, y: 70 },
    bottomRight: { x: 70, y: 70 },
  },
};

/**
 * Preset color palettes - subtle and professional.
 */
export const gradientPalettes = {
  // Aurora borealis - vibrant greens and purples
  aurora: {
    topLeft: "#22d3ee", // cyan
    topRight: "#a855f7", // purple
    bottomLeft: "#10b981", // emerald
    bottomRight: "#6366f1", // indigo
  },
  // Warm sunset - elegant oranges and pinks
  sunset: {
    topLeft: "#fb923c", // orange
    topRight: "#f472b6", // pink
    bottomLeft: "#fbbf24", // amber
    bottomRight: "#f87171", // red
  },
  // Deep ocean - rich blues and teals
  ocean: {
    topLeft: "#06b6d4", // cyan
    topRight: "#3b82f6", // blue
    bottomLeft: "#0891b2", // dark cyan
    bottomRight: "#1d4ed8", // dark blue
  },
  // Natural forest - greens and earth tones
  forest: {
    topLeft: "#4ade80", // green
    topRight: "#86efac", // light green
    bottomLeft: "#22c55e", // emerald
    bottomRight: "#a3e635", // lime
  },
  // Fire/amber - warm reds and oranges
  fire: {
    topLeft: "#f97316", // orange
    topRight: "#ef4444", // red
    bottomLeft: "#fbbf24", // amber
    bottomRight: "#dc2626", // dark red
  },
  // Candy - playful pinks and purples
  candy: {
    topLeft: "#f472b6", // pink
    topRight: "#c084fc", // purple
    bottomLeft: "#fb7185", // rose
    bottomRight: "#a78bfa", // violet
  },
  // Deep midnight - dark moody gradient
  midnight: {
    topLeft: "#3b82f6", // blue
    topRight: "#8b5cf6", // violet
    bottomLeft: "#1e3a8a", // dark blue
    bottomRight: "#4c1d95", // dark purple
  },
  // Light pastel - soft and airy
  pastel: {
    topLeft: "#fdf4ff", // very light pink
    topRight: "#f0f9ff", // very light blue
    bottomLeft: "#fefce8", // very light yellow
    bottomRight: "#f5f3ff", // very light purple
  },
  // Subtle neon - toned down vibrance
  neon: {
    topLeft: "#a8e0c0",
    topRight: "#a0d0e0",
    bottomLeft: "#d0a8d0",
    bottomRight: "#e0d8a0",
  },
  // Clean monochrome - professional grayscale
  monochrome: {
    topLeft: "#e8e8e8",
    topRight: "#b0b0b0",
    bottomLeft: "#989898",
    bottomRight: "#606060",
  },
  // Corporate blue - business professional
  corporate: {
    topLeft: "#c8d4e8",
    topRight: "#a8b8d0",
    bottomLeft: "#98a8c0",
    bottomRight: "#8898b0",
  },
  // Warm neutral - sophisticated beige
  neutral: {
    topLeft: "#e8e0d8",
    topRight: "#d8d0c8",
    bottomLeft: "#d0c8c0",
    bottomRight: "#c8c0b8",
  },
  // Soft lavender - calming purple
  lavender: {
    topLeft: "#e0d8e8",
    topRight: "#d0c8e0",
    bottomLeft: "#d8d0e8",
    bottomRight: "#c8c0d8",
  },
  // Sage green - natural and fresh
  sage: {
    topLeft: "#d8e0d0",
    topRight: "#c8d8c0",
    bottomLeft: "#c0d0b8",
    bottomRight: "#b8c8b0",
  },
};

export type GradientPalette = keyof typeof gradientPalettes;

/**
 * Props for FourColorGradient component.
 */
export interface FourColorGradientProps {
  /** Top-left color */
  topLeft?: string;
  /** Top-right color */
  topRight?: string;
  /** Bottom-left color */
  bottomLeft?: string;
  /** Bottom-right color */
  bottomRight?: string;
  /** Use a preset palette */
  palette?: GradientPalette;
  /** Custom positions for color points (default: corners) */
  positions?: {
    topLeft?: ColorPoint;
    topRight?: ColorPoint;
    bottomLeft?: ColorPoint;
    bottomRight?: ColorPoint;
  };
  /** Blend radius/softness (higher = softer blend, default: 70) */
  blend?: number;
  /** Animate the gradient */
  animate?: boolean;
  /** Animation speed (lower = slower, default: 0.5) */
  speed?: number;
  /** Animation type */
  animationType?: "rotate" | "pulse" | "shift" | "wave";
  /** Noise/grain overlay intensity (0-1, default: 0) */
  noise?: number;
  /** Children to render on top */
  children?: ReactNode;
  /** Additional styles */
  style?: CSSProperties;
  className?: string;
}

/**
 * FourColorGradient component that mimics After Effects' 4-color gradient.
 * Creates smooth blends between 4 colors positioned at different points.
 *
 * @example
 * // Using preset palette
 * <FourColorGradient palette="aurora" />
 *
 * @example
 * // Custom colors
 * <FourColorGradient
 *   topLeft="#ff0000"
 *   topRight="#00ff00"
 *   bottomLeft="#0000ff"
 *   bottomRight="#ffff00"
 * />
 *
 * @example
 * // Animated gradient
 * <FourColorGradient
 *   palette="sunset"
 *   animate
 *   animationType="rotate"
 *   speed={0.3}
 * />
 */
export const FourColorGradient: React.FC<FourColorGradientProps> = ({
  topLeft: topLeftProp,
  topRight: topRightProp,
  bottomLeft: bottomLeftProp,
  bottomRight: bottomRightProp,
  palette,
  positions: positionsProp,
  blend = 70,
  animate = false,
  speed = 0.5,
  animationType = "rotate",
  noise = 0,
  children,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Get colors from palette or props
  const paletteColors = palette ? gradientPalettes[palette] : null;
  const topLeft = topLeftProp || paletteColors?.topLeft || "#667eea";
  const topRight = topRightProp || paletteColors?.topRight || "#764ba2";
  const bottomLeft = bottomLeftProp || paletteColors?.bottomLeft || "#f093fb";
  const bottomRight =
    bottomRightProp || paletteColors?.bottomRight || "#f5576c";

  // Get positions
  const defaultPositions = gradientPositions.corners;
  const positions = {
    topLeft: positionsProp?.topLeft || defaultPositions.topLeft,
    topRight: positionsProp?.topRight || defaultPositions.topRight,
    bottomLeft: positionsProp?.bottomLeft || defaultPositions.bottomLeft,
    bottomRight: positionsProp?.bottomRight || defaultPositions.bottomRight,
  };

  // Animation calculations
  const animationProgress = useMemo(() => {
    if (!animate) return 0;
    return (frame / fps) * speed;
  }, [animate, frame, fps, speed]);

  // Calculate animated positions
  const animatedPositions = useMemo(() => {
    if (!animate) return positions;

    const t = animationProgress;

    switch (animationType) {
      case "rotate": {
        // Rotate positions around center
        const centerX = 50;
        const centerY = 50;
        const rotationAngle = t * Math.PI * 2;

        const rotatePoint = (p: ColorPoint): ColorPoint => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const cos = Math.cos(rotationAngle);
          const sin = Math.sin(rotationAngle);
          return {
            x: centerX + dx * cos - dy * sin,
            y: centerY + dx * sin + dy * cos,
          };
        };

        return {
          topLeft: rotatePoint(positions.topLeft),
          topRight: rotatePoint(positions.topRight),
          bottomLeft: rotatePoint(positions.bottomLeft),
          bottomRight: rotatePoint(positions.bottomRight),
        };
      }

      case "pulse": {
        // Pulse positions toward/away from center
        const scale = 0.8 + Math.sin(t * Math.PI * 2) * 0.2;
        const centerX = 50;
        const centerY = 50;

        const scalePoint = (p: ColorPoint): ColorPoint => ({
          x: centerX + (p.x - centerX) * scale,
          y: centerY + (p.y - centerY) * scale,
        });

        return {
          topLeft: scalePoint(positions.topLeft),
          topRight: scalePoint(positions.topRight),
          bottomLeft: scalePoint(positions.bottomLeft),
          bottomRight: scalePoint(positions.bottomRight),
        };
      }

      case "shift": {
        // Shift positions in a circular pattern
        const offsetX = Math.sin(t * Math.PI * 2) * 15;
        const offsetY = Math.cos(t * Math.PI * 2) * 15;

        return {
          topLeft: {
            x: positions.topLeft.x + offsetX,
            y: positions.topLeft.y + offsetY,
          },
          topRight: {
            x: positions.topRight.x - offsetX,
            y: positions.topRight.y + offsetY,
          },
          bottomLeft: {
            x: positions.bottomLeft.x + offsetX,
            y: positions.bottomLeft.y - offsetY,
          },
          bottomRight: {
            x: positions.bottomRight.x - offsetX,
            y: positions.bottomRight.y - offsetY,
          },
        };
      }

      case "wave": {
        // Wave-like motion
        const wave1 = Math.sin(t * Math.PI * 2) * 10;
        const wave2 = Math.sin(t * Math.PI * 2 + Math.PI / 2) * 10;

        return {
          topLeft: {
            x: positions.topLeft.x + wave1,
            y: positions.topLeft.y + wave2,
          },
          topRight: {
            x: positions.topRight.x + wave2,
            y: positions.topRight.y - wave1,
          },
          bottomLeft: {
            x: positions.bottomLeft.x - wave2,
            y: positions.bottomLeft.y + wave1,
          },
          bottomRight: {
            x: positions.bottomRight.x - wave1,
            y: positions.bottomRight.y - wave2,
          },
        };
      }

      default:
        return positions;
    }
  }, [animate, animationType, animationProgress, positions]);

  // Generate the gradient using radial gradients
  const gradientStyle = useMemo(() => {
    const {
      topLeft: tlPos,
      topRight: trPos,
      bottomLeft: blPos,
      bottomRight: brPos,
    } = animatedPositions;

    // Create 4 radial gradients, one for each color
    const gradients = [
      `radial-gradient(circle at ${tlPos.x}% ${tlPos.y}%, ${topLeft} 0%, transparent ${blend}%)`,
      `radial-gradient(circle at ${trPos.x}% ${trPos.y}%, ${topRight} 0%, transparent ${blend}%)`,
      `radial-gradient(circle at ${blPos.x}% ${blPos.y}%, ${bottomLeft} 0%, transparent ${blend}%)`,
      `radial-gradient(circle at ${brPos.x}% ${brPos.y}%, ${bottomRight} 0%, transparent ${blend}%)`,
    ];

    return gradients.join(", ");
  }, [animatedPositions, topLeft, topRight, bottomLeft, bottomRight, blend]);

  // Base color (average of all colors for better blending)
  const baseColor = useMemo(() => {
    // Simple average - could be improved with proper color mixing
    return interpolateColors(0.5, [0, 1], [topLeft, bottomRight]);
  }, [topLeft, bottomRight]);

  return (
    <AbsoluteFill
      className={className}
      style={{
        background: baseColor,
        ...style,
      }}
    >
      {/* Gradient layers */}
      <AbsoluteFill
        style={{
          background: gradientStyle,
          mixBlendMode: "normal",
        }}
      />

      {/* Optional noise overlay */}
      {noise > 0 && (
        <AbsoluteFill
          style={{
            opacity: noise,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}

      {children}
    </AbsoluteFill>
  );
};

// ============================================================================
// Animated Presets - Subtle and Professional
// ============================================================================

export interface AnimatedGradientProps {
  children?: ReactNode;
  speed?: number;
  noise?: number;
  blend?: number;
  style?: CSSProperties;
}

export const AuroraGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.08,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="aurora"
    animate
    animationType="wave"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const SunsetGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.06,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="sunset"
    animate
    animationType="shift"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const OceanGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.07,
  noise = 0,
  blend = 50,
  style,
}) => (
  <FourColorGradient
    palette="ocean"
    animate
    animationType="wave"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const NeonGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.1,
  noise = 0,
  blend = 80,
  style,
}) => (
  <FourColorGradient
    palette="neon"
    animate
    animationType="rotate"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const CandyGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.08,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="candy"
    animate
    animationType="pulse"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

// Additional professional presets
export const CorporateGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.05,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="corporate"
    animate
    animationType="shift"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const NeutralGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.06,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="neutral"
    animate
    animationType="pulse"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const LavenderGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.07,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="lavender"
    animate
    animationType="wave"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export const SageGradient: React.FC<AnimatedGradientProps> = ({
  children,
  speed = 0.05,
  noise = 0,
  blend = 70,
  style,
}) => (
  <FourColorGradient
    palette="sage"
    animate
    animationType="wave"
    speed={speed}
    noise={noise}
    blend={blend}
    style={style}
  >
    {children}
  </FourColorGradient>
);

export default FourColorGradient;
