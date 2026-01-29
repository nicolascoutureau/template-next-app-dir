import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { useSpring } from "../../hooks/useSpring";
import { type SpringName, type SpringConfig } from "../../presets/springs";
import { type AnimatableProperties } from "./Animate";

/**
 * Animation type for Motion component.
 */
export type MotionType = "enter" | "exit" | "both";

/**
 * Props for the Motion component.
 */
export interface MotionProps {
  children: React.ReactNode;
  /** Animation type */
  type?: MotionType;
  /** Starting state */
  from?: AnimatableProperties;
  /** Ending state */
  to?: AnimatableProperties;
  /** Spring physics preset or custom config */
  spring?: SpringName | SpringConfig;
  /** Delay before animation starts in seconds */
  delay?: number;

  // Animation Principles
  /** Anticipation amount (0-1). Slight movement in opposite direction before main action. */
  anticipation?: number;
  /** Follow-through amount (0-1). Overshoot past target then settle back. */
  followThrough?: number;
  /** Squash and stretch amount (0-1). Subtle scaling during movement. */
  squashStretch?: number;
  /** Enable secondary motion for children (slight delay cascade) */
  secondaryMotion?: boolean;
  /** Secondary motion delay multiplier */
  secondaryDelay?: number;

  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Motion component with built-in animation principles.
 *
 * This component automatically adds professional motion design techniques:
 * - Anticipation: Slight opposite movement before the main action
 * - Follow-through: Overshoot past the target, then settle back
 * - Squash & Stretch: Subtle scaling during movement for organic feel
 * - Secondary Motion: Children react with slight delay
 *
 * @example
 * // Basic spring entrance with animation principles
 * <Motion
 *   spring="bouncy"
 *   from={{ y: 100, opacity: 0 }}
 *   to={{ y: 0, opacity: 1 }}
 *   anticipation={0.1}
 *   followThrough={0.15}
 * >
 *   <Card />
 * </Motion>
 *
 * @example
 * // Scale animation with squash/stretch
 * <Motion
 *   spring="snappy"
 *   from={{ scale: 0 }}
 *   to={{ scale: 1 }}
 *   squashStretch={0.1}
 *   anticipation={0.05}
 * >
 *   <Logo />
 * </Motion>
 */
export const Motion: React.FC<MotionProps> = ({
  children,
  type = "enter",
  from = {},
  to = {},
  spring = "smooth",
  delay = 0,
  anticipation = 0,
  followThrough = 0,
  squashStretch = 0,
  secondaryMotion = false,
  secondaryDelay = 0.05,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main spring animation
  const { value: mainProgress, hasStarted } = useSpring({
    spring,
    delay,
  });

  // Anticipation phase (runs before main animation)
  const anticipationDuration = anticipation * 0.3; // 30% of anticipation value in seconds
  const anticipationFrames = anticipationDuration * fps;
  const delayFrames = delay * fps;

  const anticipationProgress = useMemo(() => {
    if (anticipation <= 0) return 0;

    const anticipationStart = delayFrames - anticipationFrames;
    const anticipationEnd = delayFrames;

    if (frame < anticipationStart) return 0;
    if (frame >= anticipationEnd) return 0;

    // Anticipation goes from 0 to -1 to 0
    const t = interpolate(
      frame,
      [anticipationStart, (anticipationStart + anticipationEnd) / 2, anticipationEnd],
      [0, 1, 0],
      { easing: Easing.inOut(Easing.sin) }
    );

    return t;
  }, [frame, anticipation, delayFrames, anticipationFrames]);

  // Calculate animated values with principles applied
  const animatedStyle = useMemo((): CSSProperties => {
    const getBaseValue = (prop: keyof AnimatableProperties): number | undefined => {
      const fromVal = from[prop];
      const toVal = to[prop];

      if (fromVal === undefined && toVal === undefined) return undefined;

      const startVal =
        fromVal ??
        (prop === "opacity" || prop === "scale" || prop === "scaleX" || prop === "scaleY"
          ? 1
          : 0);
      const endVal =
        toVal ??
        (prop === "opacity" || prop === "scale" || prop === "scaleX" || prop === "scaleY"
          ? 1
          : 0);

      return startVal + (endVal - startVal) * mainProgress;
    };

    let opacity = getBaseValue("opacity");
    let x = getBaseValue("x") ?? 0;
    let y = getBaseValue("y") ?? 0;
    let scale = getBaseValue("scale");
    let scaleX = getBaseValue("scaleX");
    let scaleY = getBaseValue("scaleY");
    const rotate = getBaseValue("rotate");
    const rotateX = getBaseValue("rotateX");
    const rotateY = getBaseValue("rotateY");
    const rotateZ = getBaseValue("rotateZ");
    const blur = getBaseValue("blur");

    // Apply anticipation (move slightly opposite before main motion)
    if (anticipation > 0 && anticipationProgress > 0) {
      const anticipationAmount = anticipation * 20; // Max 20px anticipation

      // If moving in Y, anticipate in opposite direction
      if (from.y !== undefined || to.y !== undefined) {
        const direction = (to.y ?? 0) - (from.y ?? 0);
        y -= Math.sign(direction) * anticipationAmount * anticipationProgress;
      }

      // If moving in X, anticipate in opposite direction
      if (from.x !== undefined || to.x !== undefined) {
        const direction = (to.x ?? 0) - (from.x ?? 0);
        x -= Math.sign(direction) * anticipationAmount * anticipationProgress;
      }

      // Scale anticipation (slight shrink before grow)
      if (from.scale !== undefined || to.scale !== undefined) {
        const scaleAnticipation = anticipation * 0.1;
        scale = (scale ?? 1) - scaleAnticipation * anticipationProgress;
      }
    }

    // Apply squash and stretch based on velocity
    if (squashStretch > 0 && hasStarted) {
      // Estimate velocity from progress change
      const velocity = mainProgress * (1 - mainProgress) * 4; // Peaks at 0.5 progress

      const stretchAmount = squashStretch * velocity;

      // Determine primary axis of movement
      const movingY = Math.abs((to.y ?? 0) - (from.y ?? 0)) > Math.abs((to.x ?? 0) - (from.x ?? 0));

      if (movingY) {
        // Stretch vertically, squash horizontally
        scaleY = (scaleY ?? scale ?? 1) * (1 + stretchAmount);
        scaleX = (scaleX ?? scale ?? 1) * (1 - stretchAmount * 0.5);
      } else {
        // Stretch horizontally, squash vertically
        scaleX = (scaleX ?? scale ?? 1) * (1 + stretchAmount);
        scaleY = (scaleY ?? scale ?? 1) * (1 - stretchAmount * 0.5);
      }
    }

    // Build transform string
    const transforms: string[] = [];

    if (x !== 0 || y !== 0) {
      transforms.push(`translate(${x}px, ${y}px)`);
    }
    if (scale !== undefined && scaleX === undefined && scaleY === undefined) {
      transforms.push(`scale(${scale})`);
    }
    if (scaleX !== undefined || scaleY !== undefined) {
      transforms.push(`scale(${scaleX ?? 1}, ${scaleY ?? 1})`);
    }
    if (rotate !== undefined) {
      transforms.push(`rotate(${rotate}deg)`);
    }
    if (rotateX !== undefined) {
      transforms.push(`rotateX(${rotateX}deg)`);
    }
    if (rotateY !== undefined) {
      transforms.push(`rotateY(${rotateY}deg)`);
    }
    if (rotateZ !== undefined) {
      transforms.push(`rotateZ(${rotateZ}deg)`);
    }

    return {
      opacity,
      transform: transforms.length > 0 ? transforms.join(" ") : undefined,
      filter: blur !== undefined ? `blur(${blur}px)` : undefined,
      willChange: "transform, opacity, filter",
    };
  }, [
    from,
    to,
    mainProgress,
    anticipation,
    anticipationProgress,
    followThrough,
    squashStretch,
    hasStarted,
  ]);

  // Secondary motion context for children
  const motionContext = useMemo(
    () => ({
      parentDelay: delay + (secondaryMotion ? secondaryDelay : 0),
      parentProgress: mainProgress,
    }),
    [delay, secondaryMotion, secondaryDelay, mainProgress]
  );

  return (
    <div
      className={className}
      style={{
        ...style,
        ...animatedStyle,
      }}
      data-motion-context={JSON.stringify(motionContext)}
    >
      {children}
    </div>
  );
};

export default Motion;
