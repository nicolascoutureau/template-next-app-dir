import React, { type CSSProperties } from "react";
import { Animate, type AnimatableProperties } from "./Animate";
import { type EasingName } from "../../presets/easings";
import { type DurationName } from "../../presets/durations";
import { type SpringName, type SpringConfig } from "../../presets/springs";

/**
 * Axis for rotation.
 */
export type RotateAxis = "z" | "x" | "y";

/**
 * Props for Rotate component.
 */
export interface RotateProps {
  children: React.ReactNode;
  /** Starting rotation in degrees */
  from?: number;
  /** Ending rotation in degrees */
  to?: number;
  /** Rotation axis */
  axis?: RotateAxis;
  /** Animation duration in seconds or preset name */
  duration?: number | DurationName;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing preset name */
  ease?: EasingName | string;
  /** Use spring physics instead */
  spring?: SpringName | SpringConfig;
  /** Also fade during rotation */
  fade?: boolean;
  /** Also scale during rotation */
  scale?: boolean;
  /** Scale range when scale is enabled */
  scaleRange?: [number, number];
  /** Perspective for 3D rotations (rotateX/rotateY) */
  perspective?: number;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Rotation animation with optional fade and scale.
 *
 * @example
 * // Simple rotation
 * <Rotate from={-180} to={0} duration={0.5}>
 *   <Icon />
 * </Rotate>
 *
 * @example
 * // Rotation with spring and fade
 * <Rotate from={-90} to={0} spring="bouncy" fade>
 *   <Logo />
 * </Rotate>
 *
 * @example
 * // 3D flip rotation
 * <Rotate from={180} to={0} axis="y" perspective={1000} spring="smooth">
 *   <Card />
 * </Rotate>
 */
export const Rotate: React.FC<RotateProps> = ({
  children,
  from: fromRotation = -180,
  to: toRotation = 0,
  axis = "z",
  duration = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  fade = false,
  scale: enableScale = false,
  scaleRange = [0.5, 1],
  perspective = 1000,
  style,
  className,
}) => {
  const from: AnimatableProperties = {};
  const to: AnimatableProperties = {};

  // Set rotation based on axis
  switch (axis) {
    case "x":
      from.rotateX = fromRotation;
      to.rotateX = toRotation;
      break;
    case "y":
      from.rotateY = fromRotation;
      to.rotateY = toRotation;
      break;
    case "z":
    default:
      from.rotate = fromRotation;
      to.rotate = toRotation;
      break;
  }

  if (fade) {
    from.opacity = 0;
    to.opacity = 1;
  }

  if (enableScale) {
    from.scale = scaleRange[0];
    to.scale = scaleRange[1];
  }

  // Add perspective for 3D rotations
  const needsPerspective = axis === "x" || axis === "y";

  return (
    <div
      style={
        needsPerspective
          ? { perspective: `${perspective}px`, perspectiveOrigin: "center" }
          : undefined
      }
    >
      <Animate
        from={from}
        to={to}
        duration={duration}
        delay={delay}
        ease={ease}
        spring={spring}
        style={{
          ...style,
          transformStyle: needsPerspective ? "preserve-3d" : undefined,
          backfaceVisibility: needsPerspective ? "hidden" : undefined,
        }}
        className={className}
      >
        {children}
      </Animate>
    </div>
  );
};

/**
 * Continuous rotation animation (for spinners, loading indicators).
 */
export interface SpinProps {
  children: React.ReactNode;
  /** Rotation speed (rotations per second) */
  speed?: number;
  /** Rotation direction */
  direction?: "clockwise" | "counterclockwise";
  /** Rotation axis */
  axis?: RotateAxis;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Continuous spinning animation.
 *
 * @example
 * <Spin speed={1}>
 *   <LoadingIcon />
 * </Spin>
 */
export const Spin: React.FC<SpinProps> = ({
  children,
  speed = 1,
  direction = "clockwise",
  axis = "z",
  style,
  className,
}) => {
  // Calculate rotation per second
  const rotationPerSecond = direction === "clockwise" ? 360 : -360;
  const duration = 1 / speed;

  // For continuous rotation, we don't use spring - just linear timing
  return (
    <Animate
      from={{ rotate: 0 }}
      to={{ rotate: rotationPerSecond }}
      duration={duration}
      ease="linear"
      fillMode="none"
      style={style}
      className={className}
    >
      {children}
    </Animate>
  );
};

export default Rotate;
