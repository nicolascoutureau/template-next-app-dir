import { type CSSProperties, useRef, useEffect, useCallback } from "react";
import { useCurrentFrame } from "remotion";

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
  /** Opacity of the noise overlay (0..1). Defaults to 0.04 (4%). */
  opacity?: number;
  /** How often noise regenerates (1 = every frame, 2 = every other frame). Defaults to 1. */
  speed?: number;
  /** Grain size in pixels. Defaults to 1. */
  size?: number;
  /** Whether noise is monochrome (true) or colored (false). Defaults to true. */
  monochrome?: boolean;
  /** Blend mode for the overlay. Defaults to "overlay". */
  blendMode?: NoiseBlendMode;
  /** Width in pixels. Required for canvas sizing. */
  width?: number;
  /** Height in pixels. Required for canvas sizing. */
  height?: number;
  /** Seed for deterministic noise (for consistent renders). */
  seed?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Seeded random number generator for deterministic noise.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * `Noise` creates film grain overlays for cinematic video effects.
 * Canvas-based for performance at video resolution. Regenerates each frame
 * for authentic film grain texture.
 *
 * The single biggest tell between "made in code" and "made professionally"
 * is texture. Adding 2-4% noise instantly adds film-quality texture.
 *
 * @example
 * ```tsx
 * // Standard film grain (recommended for most videos)
 * <Noise opacity={0.04} />
 *
 * // Heavier grain for vintage look
 * <Noise opacity={0.08} size={2} />
 *
 * // Colored noise for stylized effect
 * <Noise opacity={0.05} monochrome={false} />
 *
 * // Slower refresh for performance (every 2 frames)
 * <Noise opacity={0.04} speed={2} />
 * ```
 */
export const Noise = ({
  opacity = 0.04,
  speed = 1,
  size = 1,
  monochrome = true,
  blendMode = "overlay",
  width = 1920,
  height = 1080,
  seed: seedProp,
  className,
  style,
}: NoiseProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  
  // Only regenerate noise based on speed setting
  const noiseSeed = seedProp !== undefined 
    ? seedProp + Math.floor(frame / speed)
    : frame * 12345 + Math.floor(frame / speed);

  const renderNoise = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale canvas for grain size
    const scaledWidth = Math.ceil(width / size);
    const scaledHeight = Math.ceil(height / size);
    
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const imageData = ctx.createImageData(scaledWidth, scaledHeight);
    const data = imageData.data;
    const random = seededRandom(noiseSeed);

    for (let i = 0; i < data.length; i += 4) {
      if (monochrome) {
        // Grayscale noise
        const value = Math.floor(random() * 256);
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
      } else {
        // Colored noise
        data[i] = Math.floor(random() * 256);     // R
        data[i + 1] = Math.floor(random() * 256); // G
        data[i + 2] = Math.floor(random() * 256); // B
      }
      data[i + 3] = 255; // Alpha (fully opaque, we control opacity via CSS)
    }

    ctx.putImageData(imageData, 0, 0);
  }, [width, height, size, monochrome, noiseSeed]);

  useEffect(() => {
    renderNoise();
  }, [renderNoise]);

  const canvasStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity,
    mixBlendMode: blendMode,
    pointerEvents: "none",
    zIndex: 1000,
    imageRendering: size > 1 ? "pixelated" : "auto",
    ...style,
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={canvasStyle}
    />
  );
};

/**
 * Alias for Noise.
 * @deprecated Use `<Noise />` directly.
 */
export const GrainOverlay = Noise;
