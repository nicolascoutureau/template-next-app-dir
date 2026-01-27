import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";

/**
 * Shape types for floating elements.
 */
export type FloatingShape = "circle" | "ring" | "square" | "dot" | "blob";

/**
 * Individual element configuration (auto-generated if not provided).
 */
export type FloatingElement = {
  shape: FloatingShape;
  x: number;
  y: number;
  size: number;
  color: string;
  blur?: number;
  opacity?: number;
  speed?: number;
  rotationSpeed?: number;
};

/**
 * Props for the `FloatingElements` component.
 */
export type FloatingElementsProps = {
  /** Number of elements to generate. */
  count?: number;
  /** Shapes to use (randomly selected per element). */
  shapes?: FloatingShape[];
  /** Colors to use (randomly selected per element). */
  colors?: string[];
  /** Size range [min, max] in pixels. */
  sizeRange?: [number, number];
  /** Animation speed multiplier. */
  speed?: number;
  /** Area width in pixels. */
  width?: number;
  /** Area height in pixels. */
  height?: number;
  /** Whether some elements should be blurred for depth. */
  blur?: boolean;
  /** Seed for deterministic generation. */
  seed?: number;
  /** Pre-defined elements (overrides count/generation). */
  elements?: FloatingElement[];
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Seeded random number generator.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generates smooth noise value for organic motion.
 */
function noise(x: number, seed: number): number {
  const random = seededRandom(Math.floor(x) + seed);
  const random2 = seededRandom(Math.floor(x) + 1 + seed);
  const t = x - Math.floor(x);
  // Smooth interpolation
  const smoothT = t * t * (3 - 2 * t);
  return random() * (1 - smoothT) + random2() * smoothT;
}

/**
 * Renders a single shape.
 */
function renderShape(
  shape: FloatingShape,
  size: number,
  color: string
): JSX.Element {
  switch (shape) {
    case "circle":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
          }}
        />
      );
    case "ring":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `${size * 0.1}px solid ${color}`,
            background: "transparent",
          }}
        />
      );
    case "square":
      return (
        <div
          style={{
            width: size,
            height: size,
            background: color,
            borderRadius: size * 0.1,
          }}
        />
      );
    case "dot":
      return (
        <div
          style={{
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: color,
          }}
        />
      );
    case "blob":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            background: color,
          }}
        />
      );
    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
          }}
        />
      );
  }
}

/**
 * `FloatingElements` renders ambient background elements with organic motion.
 * Floating circles, rings, dots, and blurred shapes add depth and life to
 * any composition. Appears in nearly every modern motion piece.
 *
 * @example
 * ```tsx
 * // Basic floating circles
 * <FloatingElements
 *   count={15}
 *   colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
 *   speed={0.5}
 * />
 *
 * // Mixed shapes with depth blur
 * <FloatingElements
 *   count={20}
 *   shapes={["circle", "ring", "dot"]}
 *   colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)"]}
 *   blur
 *   sizeRange={[20, 100]}
 * />
 *
 * // Deterministic (same every render)
 * <FloatingElements count={10} seed={12345} />
 * ```
 */
export const FloatingElements = ({
  count = 10,
  shapes = ["circle"],
  colors = ["rgba(255, 255, 255, 0.1)"],
  sizeRange = [20, 80],
  speed = 1,
  width = 1920,
  height = 1080,
  blur = false,
  seed = 42,
  elements: predefinedElements,
  className,
  style,
}: FloatingElementsProps) => {
  const frame = useCurrentFrame();
  const random = seededRandom(seed);

  // Generate elements if not predefined
  const elements: FloatingElement[] = predefinedElements ?? Array.from({ length: count }, (_, i) => ({
    shape: shapes[Math.floor(random() * shapes.length)],
    x: random() * width,
    y: random() * height,
    size: sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]),
    color: colors[Math.floor(random() * colors.length)],
    blur: blur ? (random() > 0.5 ? 5 + random() * 15 : 0) : 0,
    opacity: 0.3 + random() * 0.7,
    speed: 0.5 + random() * 1,
    rotationSpeed: (random() - 0.5) * 2,
  }));

  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width,
    height,
    overflow: "hidden",
    pointerEvents: "none",
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {elements.map((el, i) => {
        const elSeed = seed + i * 1000;
        const time = frame / 30 * speed * (el.speed ?? 1);
        
        // Organic motion using noise
        const xOffset = (noise(time * 0.3, elSeed) - 0.5) * 100;
        const yOffset = (noise(time * 0.25 + 100, elSeed) - 0.5) * 80;
        const opacityPulse = 0.8 + noise(time * 0.5 + 200, elSeed) * 0.4;
        const rotation = time * 20 * (el.rotationSpeed ?? 0);

        const elementStyle: CSSProperties = {
          position: "absolute",
          left: el.x + xOffset,
          top: el.y + yOffset,
          opacity: (el.opacity ?? 1) * opacityPulse,
          filter: el.blur ? `blur(${el.blur}px)` : undefined,
          transform: `rotate(${rotation}deg)`,
          transition: "none",
        };

        return (
          <div key={i} style={elementStyle}>
            {renderShape(el.shape, el.size, el.color)}
          </div>
        );
      })}
    </div>
  );
};
