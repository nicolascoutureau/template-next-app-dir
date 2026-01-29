import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

/**
 * Grid style presets.
 */
export type GridStyle = "lines" | "dots" | "dashed" | "crosses";

/**
 * Props for GridBackground component.
 */
export interface GridBackgroundProps {
  /** Grid cell size in pixels */
  cellSize?: number;
  /** Line/dot color */
  color?: string;
  /** Line thickness */
  lineWidth?: number;
  /** Background color */
  backgroundColor?: string;
  /** Grid style */
  style?: GridStyle;
  /** Opacity of grid lines (0-1) */
  opacity?: number;
  /** Show major grid lines every N cells */
  majorGridEvery?: number;
  /** Major grid line color */
  majorGridColor?: string;
  /** Major grid line width */
  majorGridWidth?: number;
  /** Animate grid (subtle movement) */
  animate?: boolean;
  /** Animation speed */
  animationSpeed?: number;
  /** Fade edges */
  fadeEdges?: boolean;
  /** Perspective tilt (0 = flat, 1 = max tilt) */
  perspective?: number;
}

/**
 * Subtle grid background component.
 *
 * @example
 * // Basic subtle grid
 * <GridBackground cellSize={40} color="rgba(0,0,0,0.05)" />
 *
 * @example
 * // With major grid lines
 * <GridBackground
 *   cellSize={30}
 *   color="rgba(0,0,0,0.03)"
 *   majorGridEvery={5}
 *   majorGridColor="rgba(0,0,0,0.08)"
 * />
 *
 * @example
 * // Dot grid
 * <GridBackground style="dots" cellSize={24} color="rgba(0,0,0,0.1)" />
 */
export const GridBackground: React.FC<GridBackgroundProps> = ({
  cellSize = 40,
  color = "rgba(0, 0, 0, 0.06)",
  lineWidth = 1,
  backgroundColor = "#fafafa",
  style = "lines",
  opacity = 1,
  majorGridEvery = 0,
  majorGridColor = "rgba(0, 0, 0, 0.12)",
  majorGridWidth = 1,
  animate = false,
  animationSpeed = 1,
  fadeEdges = false,
  perspective = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation offset
  const time = (frame / fps) * animationSpeed;
  const offsetX = animate ? Math.sin(time * 0.5) * 10 : 0;
  const offsetY = animate ? Math.cos(time * 0.3) * 10 : 0;

  // Generate grid pattern based on style
  const gridPattern = useMemo(() => {
    const patternSize = majorGridEvery > 0 ? cellSize * majorGridEvery : cellSize;

    switch (style) {
      case "dots":
        return `
          <circle cx="${cellSize / 2}" cy="${cellSize / 2}" r="${lineWidth}" fill="${color}" />
          ${majorGridEvery > 0 ? `<circle cx="${patternSize / 2}" cy="${patternSize / 2}" r="${majorGridWidth + 0.5}" fill="${majorGridColor}" />` : ""}
        `;

      case "dashed":
        return `
          <line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="4 4" />
          <line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="4 4" />
        `;

      case "crosses":
        const crossSize = Math.min(6, cellSize / 4);
        return `
          <line x1="${cellSize / 2 - crossSize}" y1="${cellSize / 2}" x2="${cellSize / 2 + crossSize}" y2="${cellSize / 2}" stroke="${color}" stroke-width="${lineWidth}" />
          <line x1="${cellSize / 2}" y1="${cellSize / 2 - crossSize}" x2="${cellSize / 2}" y2="${cellSize / 2 + crossSize}" stroke="${color}" stroke-width="${lineWidth}" />
        `;

      case "lines":
      default:
        return `
          <line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${color}" stroke-width="${lineWidth}" />
          <line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${color}" stroke-width="${lineWidth}" />
        `;
    }
  }, [style, cellSize, color, lineWidth, majorGridEvery, majorGridColor, majorGridWidth]);

  // Create SVG data URL
  const svgPattern = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}">
        ${gridPattern}
      </svg>
    `;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [cellSize, gridPattern]);

  // Major grid SVG (if enabled)
  const majorGridSvg = useMemo(() => {
    if (majorGridEvery <= 0 || style === "dots") return null;

    const majorSize = cellSize * majorGridEvery;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}">
        <line x1="0" y1="0" x2="${majorSize}" y2="0" stroke="${majorGridColor}" stroke-width="${majorGridWidth}" />
        <line x1="0" y1="0" x2="0" y2="${majorSize}" stroke="${majorGridColor}" stroke-width="${majorGridWidth}" />
      </svg>
    `;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [cellSize, majorGridEvery, majorGridColor, majorGridWidth, style]);

  // Fade mask gradient
  const fadeMask = fadeEdges
    ? `radial-gradient(ellipse at center, black 30%, transparent 80%)`
    : undefined;

  // Perspective transform
  const perspectiveStyle: CSSProperties = perspective > 0
    ? {
        transform: `perspective(${1000 / perspective}px) rotateX(${perspective * 60}deg)`,
        transformOrigin: "center bottom",
      }
    : {};

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {/* Main grid */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage: svgPattern,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`,
          opacity,
          maskImage: fadeMask,
          WebkitMaskImage: fadeMask,
          ...perspectiveStyle,
        }}
      />

      {/* Major grid overlay */}
      {majorGridSvg && (
        <div
          style={{
            position: "absolute",
            inset: -100,
            backgroundImage: majorGridSvg,
            backgroundSize: `${cellSize * majorGridEvery}px ${cellSize * majorGridEvery}px`,
            backgroundPosition: `${offsetX}px ${offsetY}px`,
            opacity,
            maskImage: fadeMask,
            WebkitMaskImage: fadeMask,
            ...perspectiveStyle,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Preset: Subtle paper grid (like the image).
 */
export const PaperGrid: React.FC<Omit<GridBackgroundProps, "style" | "color" | "backgroundColor">> = (props) => (
  <GridBackground
    {...props}
    style="lines"
    cellSize={props.cellSize ?? 50}
    color="rgba(0, 0, 0, 0.04)"
    backgroundColor="#f8f8fa"
    majorGridEvery={props.majorGridEvery ?? 4}
    majorGridColor="rgba(0, 0, 0, 0.08)"
  />
);

/**
 * Preset: Dark tech grid.
 */
export const TechGrid: React.FC<Omit<GridBackgroundProps, "style" | "color" | "backgroundColor">> = (props) => (
  <GridBackground
    {...props}
    style="lines"
    cellSize={props.cellSize ?? 40}
    color="rgba(100, 200, 255, 0.08)"
    backgroundColor="#0a0a12"
    majorGridEvery={props.majorGridEvery ?? 5}
    majorGridColor="rgba(100, 200, 255, 0.15)"
  />
);

/**
 * Preset: Minimal dot grid.
 */
export const DotGrid: React.FC<Omit<GridBackgroundProps, "style">> = (props) => (
  <GridBackground
    {...props}
    style="dots"
    cellSize={props.cellSize ?? 24}
    color={props.color ?? "rgba(0, 0, 0, 0.15)"}
    lineWidth={props.lineWidth ?? 1.5}
  />
);

/**
 * Preset: Blueprint style.
 */
export const BlueprintGrid: React.FC<Omit<GridBackgroundProps, "style" | "color" | "backgroundColor">> = (props) => (
  <GridBackground
    {...props}
    style="lines"
    cellSize={props.cellSize ?? 30}
    color="rgba(255, 255, 255, 0.1)"
    backgroundColor="#1e3a5f"
    majorGridEvery={props.majorGridEvery ?? 5}
    majorGridColor="rgba(255, 255, 255, 0.2)"
    lineWidth={0.5}
    majorGridWidth={1}
  />
);

export default GridBackground;
