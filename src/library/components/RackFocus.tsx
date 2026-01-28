import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Props for the `RackFocus` component.
 */
export type RackFocusProps = {
  /** Content initially in focus (foreground subject). */
  from: ReactNode;
  /** Content to focus on (background subject). */
  to: ReactNode;
  /** Frame at which rack focus starts. */
  startFrame?: number;
  /** Duration of the focus pull in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Maximum blur amount in pixels. */
  maxBlur?: number;
  /** Whether to add subtle scale breathing (simulates depth). */
  breathe?: boolean;
  /** Scale amount for breathing effect. */
  breatheAmount?: number;
  /** Optional className for container. */
  className?: string;
  /** Additional styles for container. */
  style?: CSSProperties;
};

/**
 * `RackFocus` creates a cinematic focus pull between two subjects.
 * Simulates the classic camera technique of shifting focus from
 * foreground to background (or vice versa).
 *
 * @example
 * ```tsx
 * // Focus from foreground text to background image
 * <RackFocus
 *   from={<h1 className="text-9xl">HELLO</h1>}
 *   to={<img src="/background.jpg" />}
 *   durationInFrames={30}
 * />
 *
 * // With breathing effect for more depth
 * <RackFocus
 *   from={<ForegroundContent />}
 *   to={<BackgroundContent />}
 *   breathe
 *   breatheAmount={0.05}
 * />
 *
 * // Slow cinematic pull
 * <RackFocus
 *   from={<Subject1 />}
 *   to={<Subject2 />}
 *   durationInFrames={60}
 *   maxBlur={25}
 * />
 * ```
 */
export const RackFocus = ({
  from,
  to,
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.inOut(Easing.cubic),
  maxBlur = 15,
  breathe = false,
  breatheAmount = 0.03,
  className,
  style,
}: RackFocusProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const easedProgress = easing(progress);

  // "from" starts sharp, becomes blurred
  // "to" starts blurred, becomes sharp
  const fromBlur = easedProgress * maxBlur;
  const toBlur = (1 - easedProgress) * maxBlur;

  // Opacity: "from" fades slightly as it goes out of focus
  const fromOpacity = 1 - easedProgress * 0.3;
  const toOpacity = 0.7 + easedProgress * 0.3;

  // Breathing: subtle scale change to simulate depth
  const fromScale = breathe ? 1 + easedProgress * breatheAmount : 1;
  const toScale = breathe ? 1 + (1 - easedProgress) * breatheAmount : 1;

  const containerStyle: CSSProperties = {
    position: "relative",
    ...style,
  };

  const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
  };

  const fromStyle: CSSProperties = {
    ...layerStyle,
    filter: `blur(${fromBlur}px)`,
    opacity: fromOpacity,
    transform: `scale(${fromScale})`,
    zIndex: easedProgress < 0.5 ? 2 : 1,
  };

  const toStyle: CSSProperties = {
    ...layerStyle,
    filter: `blur(${toBlur}px)`,
    opacity: toOpacity,
    transform: `scale(${toScale})`,
    zIndex: easedProgress < 0.5 ? 1 : 2,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={toStyle}>{to}</div>
      <div style={fromStyle}>{from}</div>
    </div>
  );
};
