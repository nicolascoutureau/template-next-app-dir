import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Zoom blur direction.
 */
export type ZoomDirection = "in" | "out";

/**
 * Props for the `ZoomBlur` component.
 */
export type ZoomBlurProps = {
  /** Content to apply zoom blur to. */
  children: ReactNode;
  /** Frame at which effect starts. */
  startFrame?: number;
  /** Duration of the effect in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Direction of zoom blur. */
  direction?: ZoomDirection;
  /** Number of blur layers (more = smoother but heavier). */
  layers?: number;
  /** Maximum scale difference for blur trail. */
  intensity?: number;
  /** Origin point for zoom (CSS transform-origin). */
  origin?: string;
  /** Whether to fade in/out during effect. */
  fade?: boolean;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * `ZoomBlur` creates radial motion blur effects.
 * Simulates the speed/impact feeling of rapid zoom movements.
 * Uses multiple layers to create a convincing motion trail.
 *
 * @example
 * ```tsx
 * // Zoom blur in (impact entrance)
 * <ZoomBlur direction="in" durationInFrames={20}>
 *   <Content />
 * </ZoomBlur>
 *
 * // Zoom blur out (speed exit)
 * <ZoomBlur direction="out" startFrame={60}>
 *   <Content />
 * </ZoomBlur>
 *
 * // High intensity from corner
 * <ZoomBlur intensity={0.5} origin="top left" layers={12}>
 *   <Content />
 * </ZoomBlur>
 * ```
 */
export const ZoomBlur = ({
  children,
  startFrame = 0,
  durationInFrames = 20,
  easing = Easing.out(Easing.cubic),
  direction = "in",
  layers = 8,
  intensity = 0.3,
  origin = "center",
  fade = true,
  className,
  style,
}: ZoomBlurProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  
  // Effect strength decreases as we approach the end
  const effectStrength = direction === "in" 
    ? 1 - easedProgress 
    : easedProgress;

  // Base opacity
  const baseOpacity = direction === "in" ? easedProgress : 1 - easedProgress;

  const containerStyle: CSSProperties = {
    position: "relative",
    transformOrigin: origin,
    ...style,
  };

  // If effect is complete or not started, just show content
  if (effectStrength < 0.01) {
    return (
      <div className={className} style={{ ...containerStyle, opacity: fade ? baseOpacity : 1 }}>
        {children}
      </div>
    );
  }

  // Generate blur layers
  const blurLayers = Array.from({ length: layers }).map((_, i) => {
    const layerProgress = i / (layers - 1);
    
    // Scale varies from 1 to 1+intensity based on layer
    const scaleOffset = layerProgress * intensity * effectStrength;
    const scale = direction === "in" 
      ? 1 + scaleOffset 
      : 1 - scaleOffset * 0.5;
    
    // Blur increases for outer layers
    const blur = layerProgress * 3 * effectStrength;
    
    // Opacity decreases for outer layers
    const layerOpacity = (1 - layerProgress * 0.7) / layers;
    
    return { scale, blur, layerOpacity };
  });

  return (
    <div className={className} style={containerStyle}>
      {blurLayers.map((layer, i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: i === 0 ? undefined : 0,
            transform: `scale(${layer.scale})`,
            transformOrigin: origin,
            filter: `blur(${layer.blur}px)`,
            opacity: i === 0 
              ? (fade ? baseOpacity : 1) 
              : layer.layerOpacity * (fade ? baseOpacity : 1),
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
