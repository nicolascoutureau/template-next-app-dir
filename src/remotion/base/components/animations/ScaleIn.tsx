import React, { type CSSProperties } from "react";
import { Animate, type AnimatableProperties } from "./Animate";
import { type EasingName } from "../../presets/easings";
import { type DurationName } from "../../presets/durations";
import { type SpringName, type SpringConfig } from "../../presets/springs";

/**
 * Transform origin for scale animations.
 */
export type ScaleOrigin =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * Props for ScaleIn component.
 */
export interface ScaleInProps {
  children: React.ReactNode;
  /** Starting scale (0-1) */
  from?: number;
  /** Ending scale */
  to?: number;
  /** Transform origin */
  origin?: ScaleOrigin;
  /** Animation duration in seconds or preset name */
  duration?: number | DurationName;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing preset name */
  ease?: EasingName | string;
  /** Use spring physics instead */
  spring?: SpringName | SpringConfig;
  /** Also fade in during scale */
  fade?: boolean;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Convert origin name to CSS transform-origin value.
 */
function getTransformOrigin(origin: ScaleOrigin): string {
  const originMap: Record<ScaleOrigin, string> = {
    center: "center center",
    top: "center top",
    bottom: "center bottom",
    left: "left center",
    right: "right center",
    "top-left": "left top",
    "top-right": "right top",
    "bottom-left": "left bottom",
    "bottom-right": "right bottom",
  };
  return originMap[origin];
}

/**
 * Scale in animation with configurable origin.
 *
 * @example
 * // Simple scale in from 0
 * <ScaleIn spring="bouncy">
 *   <Logo />
 * </ScaleIn>
 *
 * @example
 * // Scale in from corner
 * <ScaleIn from={0} origin="top-left" duration={0.5}>
 *   <Menu />
 * </ScaleIn>
 *
 * @example
 * // Subtle scale with fade
 * <ScaleIn from={0.9} fade spring="smooth">
 *   <Card />
 * </ScaleIn>
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  from: fromScale = 0,
  to: toScale = 1,
  origin = "center",
  duration = 0.5,
  delay = 0,
  ease = "bouncy",
  spring,
  fade = false,
  style,
  className,
}) => {
  const from: AnimatableProperties = { scale: fromScale };
  const to: AnimatableProperties = { scale: toScale };

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
      style={{
        ...style,
        transformOrigin: getTransformOrigin(origin),
      }}
      className={className}
    >
      {children}
    </Animate>
  );
};

/**
 * Props for ScaleOut component.
 */
export interface ScaleOutProps extends Omit<ScaleInProps, "from" | "to"> {
  /** Starting scale */
  from?: number;
  /** Ending scale (0-1) */
  to?: number;
}

/**
 * Scale out animation with configurable origin.
 *
 * @example
 * <ScaleOut origin="center" duration={0.3} fade>
 *   <Modal />
 * </ScaleOut>
 */
export const ScaleOut: React.FC<ScaleOutProps> = ({
  children,
  from: fromScale = 1,
  to: toScale = 0,
  origin = "center",
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  fade = false,
  style,
  className,
}) => {
  const from: AnimatableProperties = { scale: fromScale };
  const to: AnimatableProperties = { scale: toScale };

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
      style={{
        ...style,
        transformOrigin: getTransformOrigin(origin),
      }}
      className={className}
    >
      {children}
    </Animate>
  );
};

export default ScaleIn;
