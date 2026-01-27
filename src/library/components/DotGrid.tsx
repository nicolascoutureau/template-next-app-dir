import type { CSSProperties } from "react";
import { useMemo, memo } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Dot animation pattern.
 */
export type DotAnimation = "pulse" | "wave" | "radial" | "rain" | "spotlight" | "none";

/**
 * Spotlight configuration for the spotlight animation mode.
 */
export type SpotlightConfig = {
  /** X position of spotlight center (0..1 or pixel value). */
  x: number;
  /** Y position of spotlight center (0..1 or pixel value). */
  y: number;
  /** Whether x/y are in pixels (true) or normalized 0-1 (false). */
  absolute?: boolean;
  /** Radius of the spotlight glow (in grid units). Defaults to 5. */
  radius?: number;
  /** Intensity of the spotlight (multiplier). Defaults to 3. */
  intensity?: number;
  /** Falloff curve (0 = sharp edge, 1 = soft falloff). Defaults to 0.5. */
  falloff?: number;
};

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
  /** Spotlight configuration for "spotlight" animation mode. */
  spotlight?: SpotlightConfig;
  /** Optional className on the wrapper svg. */
  className?: string;
  /** Inline styles for the wrapper svg. */
  style?: CSSProperties;
};

/**
 * Pre-computed dot position for performance.
 */
type DotPosition = {
  x: number;
  y: number;
  col: number;
  row: number;
  normalizedX: number;
  normalizedY: number;
};

/**
 * Memoized single dot component for performance.
 */
const Dot = memo(({
  x,
  y,
  radius,
  color,
  opacity,
}: {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}) => (
  <circle cx={x} cy={y} r={radius} fill={color} opacity={opacity} />
));

Dot.displayName = "Dot";

/**
 * `DotGrid` creates an animated dot pattern background.
 * Perfect for modern tech/SaaS backgrounds in product videos.
 *
 * @example
 * ```tsx
 * // Basic wave animation
 * <DotGrid
 *   width={1920}
 *   height={1080}
 *   spacing={40}
 *   dotSize={2}
 *   animation="wave"
 *   dotColor="#3b82f6"
 *   dotOpacity={0.3}
 * />
 *
 * // Spotlight mode (follows a point)
 * <DotGrid
 *   width={1920}
 *   height={1080}
 *   animation="spotlight"
 *   spotlight={{
 *     x: cursorX,
 *     y: cursorY,
 *     absolute: true,
 *     radius: 8,
 *     intensity: 4,
 *   }}
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
  spotlight,
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

  // Pre-compute dot positions (memoized)
  const dotPositions = useMemo((): DotPosition[] => {
    const positions: DotPosition[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: col * spacing,
          y: row * spacing,
          col,
          row,
          normalizedX: col / cols,
          normalizedY: row / rows,
        });
      }
    }
    return positions;
  }, [cols, rows, spacing]);

  // Calculate dot properties based on animation
  const calculateDotProps = (dot: DotPosition): { opacity: number; scale: number } => {
    let animatedOpacity = dotOpacity;
    let scale = 1;

    switch (animation) {
      case "pulse": {
        const pulsePhase = Math.sin(cycleProgress * Math.PI * 2);
        animatedOpacity = dotOpacity * (0.5 + 0.5 * pulsePhase);
        scale = 0.8 + 0.4 * (0.5 + 0.5 * pulsePhase);
        break;
      }

      case "wave": {
        const wavePhase = (dot.normalizedX + cycleProgress) % 1;
        const waveFactor = Math.sin(wavePhase * Math.PI * 2);
        animatedOpacity = dotOpacity * (0.3 + 0.7 * (0.5 + 0.5 * waveFactor));
        scale = 0.7 + 0.6 * (0.5 + 0.5 * waveFactor);
        break;
      }

      case "radial": {
        const dx = dot.normalizedX - centerX;
        const dy = dot.normalizedY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radialPhase = (distance * 2 - cycleProgress * 2) % 1;
        const radialFactor = Math.max(0, Math.sin(radialPhase * Math.PI));
        animatedOpacity = dotOpacity * (0.2 + 0.8 * radialFactor);
        scale = 0.6 + 0.8 * radialFactor;
        break;
      }

      case "rain": {
        const rainPhase = (dot.normalizedY + dot.col * 0.1 + cycleProgress * 2) % 1;
        const rainFactor = rainPhase < 0.2 
          ? rainPhase / 0.2 
          : rainPhase < 0.3 
            ? 1 
            : 1 - (rainPhase - 0.3) / 0.7;
        animatedOpacity = dotOpacity * rainFactor;
        scale = 0.5 + 1 * rainFactor;
        break;
      }

      case "spotlight": {
        if (!spotlight) break;
        
        const spotRadius = spotlight.radius ?? 5;
        const intensity = spotlight.intensity ?? 3;
        const falloff = spotlight.falloff ?? 0.5;
        
        // Calculate spotlight position
        let spotX: number;
        let spotY: number;
        
        if (spotlight.absolute) {
          spotX = spotlight.x;
          spotY = spotlight.y;
        } else {
          spotX = spotlight.x * width;
          spotY = spotlight.y * height;
        }
        
        // Distance from spotlight center in spacing units
        const dx = (dot.x - spotX) / spacing;
        const dy = (dot.y - spotY) / spacing;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate brightness based on distance with falloff
        const normalizedDistance = distance / spotRadius;
        const brightness = normalizedDistance >= 1 
          ? 0 
          : Math.pow(1 - normalizedDistance, 1 / (1 - falloff + 0.01));
        
        animatedOpacity = dotOpacity + (1 - dotOpacity) * brightness * (intensity - 1) / intensity;
        scale = 1 + brightness * (intensity - 1) * 0.3;
        break;
      }

      case "none":
      default:
        break;
    }

    return {
      opacity: Math.max(0, Math.min(1, animatedOpacity)),
      scale,
    };
  };

  const svgStyle: CSSProperties = {
    ...style,
    width,
    height,
  };

  return (
    <svg className={className} style={svgStyle} viewBox={`0 0 ${width} ${height}`}>
      {dotPositions.map((dot) => {
        const { opacity, scale } = calculateDotProps(dot);
        return (
          <Dot
            key={`${dot.col}-${dot.row}`}
            x={dot.x}
            y={dot.y}
            radius={dotSize * scale}
            color={dotColor}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};
