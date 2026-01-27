import type { CSSProperties } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Dot animation pattern.
 */
export type DotAnimation = "pulse" | "wave" | "radial" | "rain" | "none";

/**
 * Props for the `DotGrid` component.
 */
export type DotGridProps = {
  /** Grid width in pixels. */
  width?: number;
  /** Grid height in pixels. */
  height?: number;
  /** Spacing between dots in pixels. */
  spacing?: number;
  /** Dot radius in pixels. */
  dotSize?: number;
  /** Dot color. */
  dotColor?: string;
  /** Dot opacity (0..1). */
  dotOpacity?: number;
  /** Animation pattern. */
  animation?: DotAnimation;
  /** Frame at which animation begins. */
  startFrame?: number;
  /** Duration of one animation cycle in frames. */
  durationInFrames?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Whether the animation loops. */
  loop?: boolean;
  /** For radial animation, center X (0..1). */
  centerX?: number;
  /** For radial animation, center Y (0..1). */
  centerY?: number;
  /** Optional className on the wrapper svg. */
  className?: string;
  /** Inline styles for the wrapper svg. */
  style?: CSSProperties;
};

/**
 * `DotGrid` creates an animated dot pattern background.
 * Perfect for modern tech/SaaS backgrounds in product videos.
 *
 * @example
 * ```tsx
 * <DotGrid
 *   width={1920}
 *   height={1080}
 *   spacing={40}
 *   dotSize={2}
 *   animation="wave"
 *   dotColor="#3b82f6"
 *   dotOpacity={0.3}
 * />
 * ```
 */
export const DotGrid = ({
  width = 800,
  height = 600,
  spacing = 30,
  dotSize = 2,
  dotColor = "#ffffff",
  dotOpacity = 0.2,
  animation = "pulse",
  startFrame = 0,
  durationInFrames = 60,
  speed = 1,
  loop = true,
  centerX = 0.5,
  centerY = 0.5,
  className,
  style,
}: DotGridProps) => {
  const progress = useFrameProgress({
    startFrame,
    durationInFrames: durationInFrames / speed,
    clamp: !loop,
  });

  const cycleProgress = loop ? progress % 1 : progress;

  // Calculate grid dimensions
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  // Generate dots with animation
  const dots: JSX.Element[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing;
      const y = row * spacing;
      
      // Normalize position for animations
      const normalizedX = col / cols;
      const normalizedY = row / rows;
      
      // Calculate dot opacity based on animation
      let animatedOpacity = dotOpacity;
      let scale = 1;
      
      switch (animation) {
        case "pulse": {
          // All dots pulse together
          const pulsePhase = Math.sin(cycleProgress * Math.PI * 2);
          animatedOpacity = dotOpacity * (0.5 + 0.5 * pulsePhase);
          scale = 0.8 + 0.4 * (0.5 + 0.5 * pulsePhase);
          break;
        }
        
        case "wave": {
          // Wave traveling across the grid
          const wavePhase = (normalizedX + cycleProgress) % 1;
          const waveFactor = Math.sin(wavePhase * Math.PI * 2);
          animatedOpacity = dotOpacity * (0.3 + 0.7 * (0.5 + 0.5 * waveFactor));
          scale = 0.7 + 0.6 * (0.5 + 0.5 * waveFactor);
          break;
        }
        
        case "radial": {
          // Radial pulse from center
          const dx = normalizedX - centerX;
          const dy = normalizedY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radialPhase = (distance * 2 - cycleProgress * 2) % 1;
          const radialFactor = Math.max(0, Math.sin(radialPhase * Math.PI));
          animatedOpacity = dotOpacity * (0.2 + 0.8 * radialFactor);
          scale = 0.6 + 0.8 * radialFactor;
          break;
        }
        
        case "rain": {
          // Falling rain effect
          const rainPhase = (normalizedY + col * 0.1 + cycleProgress * 2) % 1;
          const rainFactor = rainPhase < 0.2 ? rainPhase / 0.2 : rainPhase < 0.3 ? 1 : 1 - (rainPhase - 0.3) / 0.7;
          animatedOpacity = dotOpacity * rainFactor;
          scale = 0.5 + 1 * rainFactor;
          break;
        }
        
        case "none":
        default:
          // Static grid
          break;
      }

      dots.push(
        <circle
          key={`${col}-${row}`}
          cx={x}
          cy={y}
          r={dotSize * scale}
          fill={dotColor}
          opacity={Math.max(0, Math.min(1, animatedOpacity))}
        />
      );
    }
  }

  const svgStyle: CSSProperties = {
    ...style,
    width,
    height,
  };

  return (
    <svg className={className} style={svgStyle} viewBox={`0 0 ${width} ${height}`}>
      {dots}
    </svg>
  );
};
