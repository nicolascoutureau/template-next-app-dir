import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export interface LightSweepProps {
  children: ReactNode;
  /** Sweep color */
  color?: string;
  /** Sweep opacity (0-1) */
  intensity?: number;
  /** Sweep width as percentage of the band (0-100) */
  width?: number;
  /** Feather softness (0-1) */
  softness?: number;
  /** Sweep angle in degrees */
  angle?: number;
  /** Duration of one sweep in seconds */
  duration?: number;
  /** Delay before sweep starts in seconds */
  delay?: number;
  /** Loop the sweep animation */
  loop?: boolean;
  /** Blend mode for the sweep layer */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Additional styles for the wrapper */
  style?: CSSProperties;
  className?: string;
}

/**
 * Premium light sweep / specular highlight effect.
 */
export const LightSweep: React.FC<LightSweepProps> = ({
  children,
  color = "rgba(255, 255, 255, 0.9)",
  intensity = 0.8,
  width = 18,
  softness = 0.35,
  angle = -20,
  duration = 1.6,
  delay = 0,
  loop = true,
  blendMode = "screen",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = Math.max(1, Math.round(duration * fps));
  const delayFrames = Math.round(delay * fps);

  const progress = useMemo(() => {
    const localFrame = frame - delayFrames;
    if (!loop) {
      return interpolate(localFrame, [0, durationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
    }
    const loopFrame = ((localFrame % durationFrames) + durationFrames) % durationFrames;
    return interpolate(loopFrame, [0, durationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  }, [frame, delayFrames, durationFrames, loop]);

  const sweepPosition = interpolate(progress, [0, 1], [-120, 120]);
  const clampedWidth = Math.max(6, Math.min(60, width));
  const feather = clampedWidth * Math.max(0, Math.min(1, softness));

  const stops = useMemo(() => {
    const half = clampedWidth / 2;
    const start = Math.max(0, 50 - half - feather);
    const midStart = Math.max(0, 50 - half);
    const midEnd = Math.min(100, 50 + half);
    const end = Math.min(100, 50 + half + feather);
    return { start, midStart, midEnd, end };
  }, [clampedWidth, feather]);

  const sweepStyle: CSSProperties = {
    position: "absolute",
    inset: -120,
    backgroundImage: `linear-gradient(${angle}deg, transparent ${stops.start}%, ${color} ${stops.midStart}%, ${color} ${stops.midEnd}%, transparent ${stops.end}%)`,
    backgroundSize: "200% 200%",
    backgroundPosition: `${sweepPosition}% 50%`,
    opacity: Math.max(0, Math.min(1, intensity)),
    mixBlendMode: blendMode,
    pointerEvents: "none",
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
      <div style={sweepStyle} />
    </div>
  );
};

export default LightSweep;
