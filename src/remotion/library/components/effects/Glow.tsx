import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Props for the Glow component.
 */
export interface GlowProps {
  children: React.ReactNode;
  /** Glow color */
  color?: string;
  /** Multi-layer glow configuration */
  layers?: GlowLayer[];
  /** Glow intensity (blur radius in pixels) */
  intensity?: number;
  /** Enable pulsating animation */
  pulsate?: boolean;
  /** Duration of one pulse cycle in seconds */
  pulseDuration?: number;
  /** Minimum intensity when pulsating (0-1 of intensity) */
  pulseMin?: number;
  /** Spread of the glow (additional spread beyond blur) */
  spread?: number;
  /** Blend mode for glow */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Config for multi-layer glow.
 */
export interface GlowLayer {
  color?: string;
  blur?: number;
  opacity?: number;
  x?: number;
  y?: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const full =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((c) => c + c)
          .join("")
      : sanitized;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyOpacity(color: string, opacity?: number): string {
  if (opacity === undefined) return color;
  if (color.startsWith("#")) return hexToRgba(color, opacity);
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  if (color.startsWith("rgba(")) {
    return color.replace(/rgba\(([^)]+),\s*([0-9.]+)\)/, (_, rgb) => {
      return `rgba(${rgb}, ${opacity})`;
    });
  }
  return color;
}

function buildGlowFilter(layers: GlowLayer[], fallbackColor: string): string {
  return layers
    .map((layer) => {
      const color = applyOpacity(layer.color ?? fallbackColor, layer.opacity);
      const x = layer.x ?? 0;
      const y = layer.y ?? 0;
      const blur = Math.max(0, layer.blur ?? 0);
      return `drop-shadow(${x}px ${y}px ${blur}px ${color})`;
    })
    .join(" ");
}

/**
 * Glow effect wrapper with optional pulsation.
 *
 * @example
 * // Static glow
 * <Glow color="#3b82f6" intensity={20}>
 *   <Icon />
 * </Glow>
 *
 * @example
 * // Pulsating glow
 * <Glow color="#f59e0b" intensity={30} pulsate pulseDuration={2}>
 *   <Logo />
 * </Glow>
 *
 * @example
 * // Subtle glow with spread
 * <Glow color="#10b981" intensity={15} spread={5}>
 *   <Badge>New</Badge>
 * </Glow>
 */
export const Glow: React.FC<GlowProps> = ({
  children,
  color = "#3b82f6",
  layers,
  intensity = 20,
  pulsate = false,
  pulseDuration = 2,
  pulseMin = 0.5,
  spread = 0,
  blendMode,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentIntensity = useMemo(() => {
    if (!pulsate) return intensity;

    const durationFrames = pulseDuration * fps;
    const progress = (frame % durationFrames) / durationFrames;

    // Sine wave oscillation between pulseMin and 1
    const oscillation = Math.sin(progress * Math.PI * 2);
    const normalizedOscillation = (oscillation + 1) / 2; // 0 to 1
    const scaledIntensity = pulseMin + normalizedOscillation * (1 - pulseMin);

    return intensity * scaledIntensity;
  }, [pulsate, intensity, pulseDuration, pulseMin, frame, fps]);

  const computedLayers = useMemo<GlowLayer[]>(() => {
    if (layers && layers.length > 0) {
      return layers.map((layer) => ({
        ...layer,
        blur: layer.blur ?? currentIntensity,
        color: layer.color ?? color,
      }));
    }

    return [
      {
        color,
        blur: Math.max(0, currentIntensity * 0.6),
        opacity: 0.6,
      },
      {
        color,
        blur: Math.max(0, currentIntensity),
        opacity: 0.35,
      },
      {
        color,
        blur: Math.max(0, currentIntensity * 1.6 + spread),
        opacity: 0.2,
      },
    ];
  }, [layers, currentIntensity, color, spread]);

  const glowStyle: CSSProperties = {
    filter: currentIntensity > 0 ? buildGlowFilter(computedLayers, color) : undefined,
    mixBlendMode: blendMode,
    ...style,
  };

  return (
    <div className={className} style={glowStyle}>
      {children}
    </div>
  );
};

/**
 * Props for AnimatedGlow - glow that animates in.
 */
export interface AnimatedGlowProps extends Omit<GlowProps, "pulsate"> {
  /** Duration of glow fade-in in seconds */
  duration?: number;
  /** Delay before glow starts in seconds */
  delay?: number;
  /** Continue pulsating after fade-in */
  pulsateAfter?: boolean;
}

/**
 * Glow effect that animates in and optionally pulsates.
 *
 * @example
 * <AnimatedGlow color="#8b5cf6" intensity={25} duration={0.5} pulsateAfter>
 *   <Card />
 * </AnimatedGlow>
 */
export const AnimatedGlow: React.FC<AnimatedGlowProps> = ({
  children,
  color = "#3b82f6",
  layers,
  intensity = 20,
  duration = 0.5,
  delay = 0,
  pulseDuration = 2,
  pulseMin = 0.5,
  pulsateAfter = false,
  spread = 0,
  blendMode,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const durationFrames = Math.round(duration * fps);

  const currentIntensity = useMemo(() => {
    const effectiveFrame = frame - delayFrames;

    // Fade in phase
    if (effectiveFrame < 0) return 0;
    if (effectiveFrame < durationFrames) {
      const progress = interpolate(
        effectiveFrame,
        [0, durationFrames],
        [0, 1],
        {
          easing: Easing.out(Easing.cubic),
        },
      );
      return intensity * progress;
    }

    // After fade-in
    if (!pulsateAfter) return intensity;

    // Pulsate phase
    const pulseDurationFrames = pulseDuration * fps;
    const pulseFrame = effectiveFrame - durationFrames;
    const pulseProgress =
      (pulseFrame % pulseDurationFrames) / pulseDurationFrames;
    const oscillation = Math.sin(pulseProgress * Math.PI * 2);
    const normalizedOscillation = (oscillation + 1) / 2;
    const scaledIntensity = pulseMin + normalizedOscillation * (1 - pulseMin);

    return intensity * scaledIntensity;
  }, [
    frame,
    delayFrames,
    durationFrames,
    intensity,
    pulsateAfter,
    pulseDuration,
    pulseMin,
    fps,
  ]);

  const computedLayers = useMemo<GlowLayer[]>(() => {
    if (layers && layers.length > 0) {
      return layers.map((layer) => ({
        ...layer,
        blur: layer.blur ?? currentIntensity,
        color: layer.color ?? color,
      }));
    }

    return [
      {
        color,
        blur: Math.max(0, currentIntensity * 0.6),
        opacity: 0.6,
      },
      {
        color,
        blur: Math.max(0, currentIntensity),
        opacity: 0.35,
      },
      {
        color,
        blur: Math.max(0, currentIntensity * 1.6 + spread),
        opacity: 0.2,
      },
    ];
  }, [layers, currentIntensity, color, spread]);

  const glowStyle: CSSProperties = {
    filter:
      currentIntensity > 0 ? buildGlowFilter(computedLayers, color) : undefined,
    mixBlendMode: blendMode,
    ...style,
  };

  return (
    <div className={className} style={glowStyle}>
      {children}
    </div>
  );
};

export default Glow;
