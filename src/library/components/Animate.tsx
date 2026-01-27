import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Built-in animation presets.
 */
export type AnimatePreset =
  | "fadeIn"
  | "fadeOut"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "scaleOut"
  | "scaleUp"
  | "scaleDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "zoomOut"
  | "rotateIn"
  | "rotateOut"
  | "flipX"
  | "flipY"
  | "bounceIn"
  | "elasticIn"
  | "pop";

/**
 * Animation timing mode.
 */
export type AnimateMode = "in" | "out" | "inOut" | "loop";

/**
 * Custom animation function that receives progress and returns styles.
 */
export type AnimateCustomFn = (params: {
  progress: number;
  frame: number;
}) => CSSProperties;

/**
 * Props for the `Animate` component.
 */
export type AnimateProps = {
  /** Content to animate. */
  children: ReactNode;
  /** Animation preset or custom function. */
  animation?: AnimatePreset | AnimateCustomFn;
  /** Animation timing mode. Defaults to "in". */
  mode?: AnimateMode;
  /** Frame at which animation starts. Defaults to 0. */
  startFrame?: number;
  /** Duration of the animation in frames. Defaults to 20. */
  durationInFrames?: number;
  /** Easing function. Defaults to Easing.out(Easing.cubic). */
  easing?: (t: number) => number;
  /** Distance for slide/fade animations. Defaults to 30. */
  distance?: number;
  /** Rotation degrees for rotate animations. Defaults to 180. */
  rotation?: number;
  /** Scale factor for scale animations. Defaults to 0. */
  scale?: number;
  /** Transform origin. Defaults to "center". */
  transformOrigin?: string;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
  /** Delay before animation starts (in frames). Defaults to 0. */
  delay?: number;
};

/**
 * Get preset animation styles based on progress.
 */
function getPresetStyles(
  preset: AnimatePreset,
  progress: number,
  distance: number,
  rotation: number,
  scale: number,
): CSSProperties {
  const invProgress = 1 - progress;

  switch (preset) {
    // Fade animations
    case "fadeIn":
      return { opacity: progress };
    case "fadeOut":
      return { opacity: invProgress };

    // Fade + translate animations
    case "fadeUp":
      return {
        opacity: progress,
        transform: `translateY(${invProgress * distance}px)`,
      };
    case "fadeDown":
      return {
        opacity: progress,
        transform: `translateY(${-invProgress * distance}px)`,
      };
    case "fadeLeft":
      return {
        opacity: progress,
        transform: `translateX(${invProgress * distance}px)`,
      };
    case "fadeRight":
      return {
        opacity: progress,
        transform: `translateX(${-invProgress * distance}px)`,
      };

    // Scale animations
    case "scaleIn":
      return {
        opacity: progress,
        transform: `scale(${scale + progress * (1 - scale)})`,
      };
    case "scaleOut":
      return {
        opacity: invProgress,
        transform: `scale(${1 - invProgress * (1 - scale)})`,
      };
    case "scaleUp":
      return {
        opacity: progress,
        transform: `scale(${scale + progress * (1 - scale)}) translateY(${invProgress * distance}px)`,
      };
    case "scaleDown":
      return {
        opacity: progress,
        transform: `scale(${scale + progress * (1 - scale)}) translateY(${-invProgress * distance}px)`,
      };

    // Slide animations (no fade)
    case "slideUp":
      return { transform: `translateY(${invProgress * distance}px)` };
    case "slideDown":
      return { transform: `translateY(${-invProgress * distance}px)` };
    case "slideLeft":
      return { transform: `translateX(${invProgress * distance}px)` };
    case "slideRight":
      return { transform: `translateX(${-invProgress * distance}px)` };

    // Zoom animations
    case "zoomIn":
      return {
        opacity: progress,
        transform: `scale(${0.5 + progress * 0.5})`,
      };
    case "zoomOut":
      return {
        opacity: invProgress,
        transform: `scale(${1 + invProgress * 0.5})`,
      };

    // Rotate animations
    case "rotateIn":
      return {
        opacity: progress,
        transform: `rotate(${invProgress * rotation}deg)`,
      };
    case "rotateOut":
      return {
        opacity: invProgress,
        transform: `rotate(${progress * rotation}deg)`,
      };

    // Flip animations
    case "flipX":
      return {
        opacity: progress > 0.5 ? 1 : progress * 2,
        transform: `perspective(400px) rotateX(${invProgress * 90}deg)`,
      };
    case "flipY":
      return {
        opacity: progress > 0.5 ? 1 : progress * 2,
        transform: `perspective(400px) rotateY(${invProgress * 90}deg)`,
      };

    // Special animations
    case "bounceIn": {
      // Overshoot and settle
      const bounce = Math.sin(progress * Math.PI * 2.5) * (1 - progress) * 0.3;
      return {
        opacity: Math.min(1, progress * 2),
        transform: `scale(${progress + bounce})`,
      };
    }
    case "elasticIn": {
      // Elastic spring effect
      const elastic = Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.2;
      return {
        opacity: progress,
        transform: `scale(${progress * (1 + elastic)}) translateY(${invProgress * distance * 0.5}px)`,
      };
    }
    case "pop": {
      // Quick scale overshoot
      const overshoot =
        progress < 0.7
          ? progress / 0.7
          : 1 + Math.sin(((progress - 0.7) / 0.3) * Math.PI) * 0.15;
      return {
        opacity: Math.min(1, progress * 1.5),
        transform: `scale(${overshoot})`,
      };
    }

    default:
      return {};
  }
}

/**
 * `Animate` wraps children with common animation effects.
 * Provides quick access to entrance, exit, and loop animations
 * without writing interpolation logic.
 *
 * @example
 * ```tsx
 * // Simple fade up entrance
 * <Animate animation="fadeUp" durationInFrames={20}>
 *   <h1>Hello World</h1>
 * </Animate>
 *
 * // Scale in with bounce
 * <Animate animation="bounceIn" durationInFrames={30}>
 *   <Card />
 * </Animate>
 *
 * // Exit animation
 * <Animate animation="fadeOut" mode="out" startFrame={60}>
 *   <Content />
 * </Animate>
 *
 * // In/out animation (enter then exit)
 * <Animate animation="scaleIn" mode="inOut" durationInFrames={15}>
 *   <Logo />
 * </Animate>
 *
 * // Custom animation function
 * <Animate
 *   animation={({ progress }) => ({
 *     opacity: progress,
 *     transform: `translateX(${(1 - progress) * 100}px) rotate(${progress * 360}deg)`,
 *   })}
 * >
 *   <Element />
 * </Animate>
 *
 * // With delay
 * <Animate animation="fadeUp" delay={15}>
 *   <Content />
 * </Animate>
 * ```
 */
export const Animate = ({
  children,
  animation = "fadeIn",
  mode = "in",
  startFrame = 0,
  durationInFrames = 20,
  easing = Easing.out(Easing.cubic),
  distance = 30,
  rotation = 180,
  scale = 0,
  transformOrigin = "center",
  className,
  style,
  delay = 0,
}: AnimateProps) => {
  const frame = useCurrentFrame();
  const effectiveStartFrame = startFrame + delay;

  let progress: number;

  if (mode === "loop") {
    // Looping animation
    const loopFrame = (frame - effectiveStartFrame) % durationInFrames;
    const loopProgress = loopFrame / durationInFrames;
    // Create a smooth loop (0 -> 1 -> 0)
    progress =
      frame >= effectiveStartFrame
        ? Math.sin(loopProgress * Math.PI * 2) * 0.5 + 0.5
        : 0;
  } else if (mode === "inOut") {
    // In/out: animate in, hold, animate out
    // Assumes composition has space for both animations
    const inEnd = effectiveStartFrame + durationInFrames;

    if (frame < effectiveStartFrame) {
      progress = 0;
    } else if (frame <= inEnd) {
      const rawProgress = (frame - effectiveStartFrame) / durationInFrames;
      progress = easing(Math.min(1, Math.max(0, rawProgress)));
    } else {
      progress = 1;
    }
  } else if (mode === "out") {
    // Exit animation (starts visible, ends hidden)
    const rawProgress = interpolate(
      frame,
      [effectiveStartFrame, effectiveStartFrame + durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    progress = easing(rawProgress);
  } else {
    // Entrance animation (default)
    const rawProgress = interpolate(
      frame,
      [effectiveStartFrame, effectiveStartFrame + durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    progress = easing(rawProgress);
  }

  // Get animation styles
  const animationStyles: CSSProperties =
    typeof animation === "function"
      ? animation({ progress, frame })
      : getPresetStyles(animation, progress, distance, rotation, scale);

  const containerStyle: CSSProperties = {
    transformOrigin,
    ...animationStyles,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};
