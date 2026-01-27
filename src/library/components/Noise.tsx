import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";

/**
 * Noise pattern type.
 */
export type NoiseType = "grain" | "static" | "film" | "subtle";

/**
 * Blend mode for the noise overlay.
 */
export type NoiseBlendMode =
  | "overlay"
  | "soft-light"
  | "multiply"
  | "screen"
  | "normal";

/**
 * Props for the `Noise` component.
 */
export type NoiseProps = {
  /** Type of noise pattern. Defaults to "grain". */
  type?: NoiseType;
  /** Opacity of the noise overlay (0..1). Defaults to 0.15. */
  opacity?: number;
  /** Blend mode for the overlay. Defaults to "overlay". */
  blendMode?: NoiseBlendMode;
  /** Whether the noise animates (changes each frame). Defaults to true. */
  animate?: boolean;
  /** Animation speed (frames between changes). Lower = faster. Defaults to 1. */
  animationSpeed?: number;
  /** Base color for the noise. Defaults to "#000000". */
  baseColor?: string;
  /** Scale of the noise pattern (1 = 100%). Defaults to 1. */
  scale?: number;
  /** Density of the noise (0..1). Higher = more visible noise. Defaults to 0.5. */
  density?: number;
  /** Width. Defaults to "100%". */
  width?: number | string;
  /** Height. Defaults to "100%". */
  height?: number | string;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Generates a unique seed based on frame for animation.
 */
function frameToSeed(frame: number, speed: number): number {
  return Math.floor(frame / speed);
}

/**
 * `Noise` creates film grain and static noise overlays for cinematic video effects.
 * Essential for adding texture and a professional film look to compositions.
 *
 * @example
 * ```tsx
 * // Subtle film grain
 * <Noise type="film" opacity={0.08} />
 *
 * // Heavier grain for vintage look
 * <Noise type="grain" opacity={0.2} density={0.7} />
 *
 * // Static TV noise
 * <Noise type="static" opacity={0.3} animate />
 *
 * // Non-animated subtle texture
 * <Noise type="subtle" opacity={0.05} animate={false} />
 * ```
 */
export const Noise = ({
  type = "grain",
  opacity = 0.15,
  blendMode = "overlay",
  animate = true,
  animationSpeed = 1,
  baseColor = "#000000",
  scale = 1,
  density = 0.5,
  width = "100%",
  height = "100%",
  className,
  style,
}: NoiseProps) => {
  const frame = useCurrentFrame();
  const seed = animate ? frameToSeed(frame, animationSpeed) : 0;

  // Generate noise pattern based on type
  const noisePattern = useMemo(() => {
    // Create a deterministic random function based on seed
    const seededRandom = (i: number): number => {
      const x = Math.sin(seed * 9999 + i * 1234.5678) * 10000;
      return x - Math.floor(x);
    };

    // Generate SVG-based noise patterns
    switch (type) {
      case "grain":
      case "film": {
        // Film grain: small, dense, subtle variations
        const grainSize = type === "film" ? 1 : 2;
        const grainCount = Math.floor(200 * density);
        const grains: string[] = [];
        
        for (let i = 0; i < grainCount; i++) {
          const x = seededRandom(i * 2) * 100;
          const y = seededRandom(i * 2 + 1) * 100;
          const size = grainSize * (0.5 + seededRandom(i * 3) * 0.5);
          const grainOpacity = 0.3 + seededRandom(i * 4) * 0.7;
          grains.push(
            `<circle cx="${x}" cy="${y}" r="${size}" fill="${baseColor}" opacity="${grainOpacity}"/>`
          );
        }
        
        return `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${grains.join("")}</svg>`
        )}")`;
      }

      case "static": {
        // TV static: larger, more blocky noise
        const cellSize = 4;
        const cols = Math.ceil(100 / cellSize);
        const rows = Math.ceil(100 / cellSize);
        const cells: string[] = [];
        
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = row * cols + col;
            if (seededRandom(i) < density) {
              const cellOpacity = seededRandom(i + 1000);
              cells.push(
                `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${baseColor}" opacity="${cellOpacity}"/>`
              );
            }
          }
        }
        
        return `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${cells.join("")}</svg>`
        )}")`;
      }

      case "subtle": {
        // Very subtle, fine noise
        const dotCount = Math.floor(100 * density);
        const dots: string[] = [];
        
        for (let i = 0; i < dotCount; i++) {
          const x = seededRandom(i * 2) * 100;
          const y = seededRandom(i * 2 + 1) * 100;
          const dotOpacity = 0.1 + seededRandom(i * 3) * 0.2;
          dots.push(
            `<circle cx="${x}" cy="${y}" r="0.5" fill="${baseColor}" opacity="${dotOpacity}"/>`
          );
        }
        
        return `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${dots.join("")}</svg>`
        )}")`;
      }

      default:
        return "none";
    }
  }, [type, seed, density, baseColor]);

  const noiseStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width,
    height,
    backgroundImage: noisePattern,
    backgroundSize: `${100 / scale}% ${100 / scale}%`,
    backgroundRepeat: "repeat",
    opacity,
    mixBlendMode: blendMode,
    pointerEvents: "none",
    zIndex: 1000,
    ...style,
  };

  return <div className={className} style={noiseStyle} />;
};

/**
 * Alias for Noise with grain preset.
 * @deprecated Use `<Noise type="grain" />` instead.
 */
export const GrainOverlay = Noise;
