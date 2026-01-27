import type { CSSProperties, ReactNode } from "react";

/**
 * Props for the `Glow` component.
 */
export type GlowProps = {
  /** Content to apply glow to. */
  children: ReactNode;
  /** Glow intensity (0-1). Defaults to 0.6. */
  intensity?: number;
  /** Glow color. Defaults to inherit from children. */
  color?: string;
  /** Blur radius in pixels. Defaults to 20. */
  radius?: number;
  /** Glow opacity (0-1). Defaults to 0.8. */
  opacity?: number;
  /** Number of blur layers for smoother falloff. Defaults to 2. */
  layers?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * `Glow` creates a light bloom effect behind its children.
 * Without glow, bright elements look flat against dark backgrounds.
 * Every neon effect, highlighted title, glowing button in professional
 * work has bloom.
 *
 * @example
 * ```tsx
 * // Basic glow on text
 * <Glow color="#3b82f6" radius={30}>
 *   <h1 style={{ color: "#3b82f6" }}>Glowing Title</h1>
 * </Glow>
 *
 * // Intense neon glow
 * <Glow color="#ff00ff" intensity={1} radius={40} layers={3}>
 *   <span>NEON</span>
 * </Glow>
 *
 * // Subtle highlight glow
 * <Glow color="#ffffff" intensity={0.3} radius={15}>
 *   <Button>Click Me</Button>
 * </Glow>
 * ```
 */
export const Glow = ({
  children,
  intensity = 0.6,
  color,
  radius = 20,
  opacity = 0.8,
  layers = 2,
  className,
  style,
}: GlowProps) => {
  const containerStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  // Build drop-shadow filters for the glow layer
  const dropShadows = Array.from({ length: layers }, (_, i) => {
    const layerRadius = radius * ((i + 1) / layers);
    const glowColor = color || "inherit";
    return `drop-shadow(0 0 ${layerRadius}px ${glowColor})`;
  }).join(" ");

  const glowLayerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    filter: dropShadows,
    opacity: opacity * intensity,
    pointerEvents: "none",
    // Inherit color from children if not specified
    color: color || "inherit",
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Glow layer - duplicate of children with drop-shadow */}
      <div style={glowLayerStyle} aria-hidden="true">
        {children}
      </div>
      {/* Actual content on top */}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
