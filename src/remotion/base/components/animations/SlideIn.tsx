import React, { type CSSProperties } from "react";
import { Animate, type AnimatableProperties } from "./Animate";
import { type EasingName } from "../../presets/easings";
import { type DurationName } from "../../presets/durations";
import { type SpringName, type SpringConfig } from "../../presets/springs";

/**
 * Direction for slide animation.
 */
export type SlideDirection = "up" | "down" | "left" | "right";

/**
 * Props for SlideIn component.
 */
export interface SlideInProps {
  children: React.ReactNode;
  /** Direction to slide from */
  direction?: SlideDirection;
  /** Distance to travel in pixels */
  distance?: number;
  /** Animation duration in seconds or preset name */
  duration?: number | DurationName;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing preset name */
  ease?: EasingName | string;
  /** Use spring physics instead */
  spring?: SpringName | SpringConfig;
  /** Also fade in during slide */
  fade?: boolean;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Slide in animation from any direction.
 *
 * @example
 * // Slide in from left
 * <SlideIn direction="left" distance={100}>
 *   <Panel />
 * </SlideIn>
 *
 * @example
 * // Slide in from bottom with spring and fade
 * <SlideIn direction="up" spring="bouncy" fade>
 *   <Card />
 * </SlideIn>
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "left",
  distance = 100,
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  fade = false,
  style,
  className,
}) => {
  const from: AnimatableProperties = {};
  const to: AnimatableProperties = {};

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

  if (fade) {
    from.opacity = 0;
    to.opacity = 1;
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
 * Props for SlideOut component.
 */
export interface SlideOutProps extends SlideInProps {
  /** Direction to slide to */
  direction?: SlideDirection;
}

/**
 * Slide out animation to any direction.
 *
 * @example
 * <SlideOut direction="right" duration={0.3} fade>
 *   <Panel />
 * </SlideOut>
 */
export const SlideOut: React.FC<SlideOutProps> = ({
  children,
  direction = "left",
  distance = 100,
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  fade = false,
  style,
  className,
}) => {
  const from: AnimatableProperties = {};
  const to: AnimatableProperties = {};

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

  if (fade) {
    from.opacity = 1;
    to.opacity = 0;
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

export default SlideIn;
