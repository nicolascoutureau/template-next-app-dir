import React, { type CSSProperties } from "react";
import { Animate, type AnimatableProperties } from "./Animate";
import { type EasingName } from "../../presets/easings";
import { type DurationName } from "../../presets/durations";
import { type SpringName, type SpringConfig } from "../../presets/springs";

/**
 * Direction for fade animation with movement.
 */
export type FadeDirection = "up" | "down" | "left" | "right" | "none";

/**
 * Props for FadeIn component.
 */
export interface FadeInProps {
  children: React.ReactNode;
  /** Direction to fade from (adds movement) */
  direction?: FadeDirection;
  /** Distance to travel in pixels (when direction is set) */
  distance?: number;
  /** Animation duration in seconds or preset name */
  duration?: number | DurationName;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing preset name */
  ease?: EasingName | string;
  /** Use spring physics instead */
  spring?: SpringName | SpringConfig;
  /** Add blur during fade */
  blur?: boolean;
  /** Maximum blur amount in pixels */
  blurAmount?: number;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Fade in animation with optional direction and blur.
 *
 * @example
 * // Simple fade in
 * <FadeIn duration={0.5}>
 *   <Content />
 * </FadeIn>
 *
 * @example
 * // Fade in from bottom with spring
 * <FadeIn direction="up" distance={30} spring="bouncy">
 *   <Card />
 * </FadeIn>
 *
 * @example
 * // Fade in with blur effect
 * <FadeIn blur blurAmount={10} duration={0.8}>
 *   <Image />
 * </FadeIn>
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = "none",
  distance = 20,
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  blur = false,
  blurAmount = 8,
  style,
  className,
}) => {
  // Calculate from/to based on direction
  const from: AnimatableProperties = { opacity: 0 };
  const to: AnimatableProperties = { opacity: 1 };

  switch (direction) {
    case "up":
      from.y = distance;
      to.y = 0;
      break;
    case "down":
      from.y = -distance;
      to.y = 0;
      break;
    case "left":
      from.x = distance;
      to.x = 0;
      break;
    case "right":
      from.x = -distance;
      to.x = 0;
      break;
  }

  if (blur) {
    from.blur = blurAmount;
    to.blur = 0;
  }

  return (
    <Animate
      from={from}
      to={to}
      duration={duration}
      delay={delay}
      ease={ease}
      spring={spring}
      style={style}
      className={className}
    >
      {children}
    </Animate>
  );
};

/**
 * Props for FadeOut component.
 */
export interface FadeOutProps extends Omit<FadeInProps, "direction"> {
  /** Direction to fade to */
  direction?: FadeDirection;
}

/**
 * Fade out animation with optional direction and blur.
 *
 * @example
 * <FadeOut direction="down" duration={0.3}>
 *   <Content />
 * </FadeOut>
 */
export const FadeOut: React.FC<FadeOutProps> = ({
  children,
  direction = "none",
  distance = 20,
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  blur = false,
  blurAmount = 8,
  style,
  className,
}) => {
  // Calculate from/to based on direction (reversed from FadeIn)
  const from: AnimatableProperties = { opacity: 1 };
  const to: AnimatableProperties = { opacity: 0 };

  switch (direction) {
    case "up":
      from.y = 0;
      to.y = -distance;
      break;
    case "down":
      from.y = 0;
      to.y = distance;
      break;
    case "left":
      from.x = 0;
      to.x = -distance;
      break;
    case "right":
      from.x = 0;
      to.x = distance;
      break;
  }

  if (blur) {
    from.blur = 0;
    to.blur = blurAmount;
  }

  return (
    <Animate
      from={from}
      to={to}
      duration={duration}
      delay={delay}
      ease={ease}
      spring={spring}
      style={style}
      className={className}
    >
      {children}
    </Animate>
  );
};

export default FadeIn;
