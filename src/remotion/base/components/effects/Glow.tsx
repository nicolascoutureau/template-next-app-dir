import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Props for the Glow component.
 */
export interface GlowProps {
  children: React.ReactNode;
  /** Glow color */
  color?: string;
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
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
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
  intensity = 20,
  pulsate = false,
  pulseDuration = 2,
  pulseMin = 0.5,
  spread = 0,
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

  const glowStyle: CSSProperties = {
    filter: `drop-shadow(0 0 ${currentIntensity}px ${color})${
      spread > 0 ? ` drop-shadow(0 0 ${spread}px ${color})` : ""
    }`,
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
  intensity = 20,
  duration = 0.5,
  delay = 0,
  pulseDuration = 2,
  pulseMin = 0.5,
  pulsateAfter = false,
  spread = 0,
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

  const glowStyle: CSSProperties = {
    filter:
      currentIntensity > 0
        ? `drop-shadow(0 0 ${currentIntensity}px ${color})${
            spread > 0 ? ` drop-shadow(0 0 ${spread}px ${color})` : ""
          }`
        : undefined,
    ...style,
  };

  return (
    <div className={className} style={glowStyle}>
      {children}
    </div>
  );
};

export default Glow;
