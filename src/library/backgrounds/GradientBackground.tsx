import type { CSSProperties } from "react";

/**
 * Gradient type.
 */
export type GradientType = "linear" | "radial" | "conic";

/**
 * Props for the `GradientBackground` component.
 */
export type GradientBackgroundProps = {
  /** Type of gradient. */
  type?: GradientType;
  /** Array of color stops. */
  colors: string[];
  /** Angle for linear gradients (in degrees). */
  angle?: number;
  /** Position for radial/conic gradients (e.g., "center", "top left"). */
  position?: string;
  /** Width of the gradient (defaults to 100%). */
  width?: number | string;
  /** Height of the gradient (defaults to 100%). */
  height?: number | string;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * `GradientBackground` creates simple CSS gradient backgrounds.
 * Useful for quick backgrounds without WebGL overhead.
 *
 * @example
 * ```tsx
 * // Linear gradient
 * <GradientBackground
 *   type="linear"
 *   colors={["#ff0080", "#7928ca", "#0070f3"]}
 *   angle={135}
 * />
 *
 * // Radial gradient
 * <GradientBackground
 *   type="radial"
 *   colors={["#ffffff", "#000000"]}
 *   position="center"
 * />
 * ```
 */
export const GradientBackground = ({
  type = "linear",
  colors,
  angle = 180,
  position = "center",
  width = "100%",
  height = "100%",
  className,
  style,
}: GradientBackgroundProps) => {
  const colorStops = colors.join(", ");

  let gradient: string;
  switch (type) {
    case "radial":
      gradient = `radial-gradient(circle at ${position}, ${colorStops})`;
      break;
    case "conic":
      gradient = `conic-gradient(from ${angle}deg at ${position}, ${colorStops})`;
      break;
    case "linear":
    default:
      gradient = `linear-gradient(${angle}deg, ${colorStops})`;
      break;
  }

  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: gradient,
        position: "absolute",
        inset: 0,
        ...style,
      }}
    />
  );
};
