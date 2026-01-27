import {
  type CSSProperties,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Stagger direction.
 */
export type StaggerDirection = "forward" | "reverse" | "center-out" | "center-in";

/**
 * Animation render prop params.
 */
export type StaggerAnimationParams = {
  /** Progress 0-1 for this child's animation. */
  progress: number;
  /** Index of the child. */
  index: number;
  /** Total number of children. */
  total: number;
};

/**
 * Built-in animation presets.
 */
export type StaggerPreset = "fadeUp" | "fadeDown" | "fadeIn" | "scale" | "slideLeft" | "slideRight";

/**
 * Props for the `Stagger` component.
 */
export type StaggerProps = {
  /** Children to stagger. */
  children: ReactNode;
  /** Delay in frames between each child's animation start. */
  delay?: number;
  /** Frame at which the stagger sequence starts. */
  startFrame?: number;
  /** Duration of each child's animation in frames. */
  durationInFrames?: number;
  /** Direction of the stagger. */
  direction?: StaggerDirection;
  /** Easing function for each child's animation. */
  easing?: (t: number) => number;
  /** 
   * Animation preset or custom render function.
   * Preset applies built-in transforms.
   * Function receives progress and returns style object.
   */
  animation?: StaggerPreset | ((params: StaggerAnimationParams) => CSSProperties);
  /** Optional className for wrapper. */
  className?: string;
  /** Optional style for wrapper. */
  style?: CSSProperties;
};

/**
 * Gets the delay for each child based on direction.
 */
function getDelayOrder(
  index: number,
  total: number,
  direction: StaggerDirection
): number {
  switch (direction) {
    case "forward":
      return index;
    case "reverse":
      return total - 1 - index;
    case "center-out": {
      const center = (total - 1) / 2;
      return Math.abs(index - center);
    }
    case "center-in": {
      const center = (total - 1) / 2;
      return center - Math.abs(index - center);
    }
    default:
      return index;
  }
}

/**
 * Built-in animation presets.
 */
function getPresetStyle(preset: StaggerPreset, progress: number): CSSProperties {
  switch (preset) {
    case "fadeUp":
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
      };
    case "fadeDown":
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * -30}px)`,
      };
    case "fadeIn":
      return {
        opacity: progress,
      };
    case "scale":
      return {
        opacity: progress,
        transform: `scale(${0.8 + progress * 0.2})`,
      };
    case "slideLeft":
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * 50}px)`,
      };
    case "slideRight":
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * -50}px)`,
      };
    default:
      return { opacity: progress };
  }
}

/**
 * `Stagger` wraps children and automatically applies staggered animation timing.
 * The #1 animation pattern in motion design — lists, grids, feature cards all stagger in.
 *
 * @example
 * ```tsx
 * // Basic stagger with fadeUp preset
 * <Stagger delay={5} animation="fadeUp">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Stagger>
 *
 * // Custom animation function
 * <Stagger
 *   delay={3}
 *   animation={({ progress, index }) => ({
 *     opacity: progress,
 *     transform: `translateX(${(1 - progress) * 100}px) rotate(${(1 - progress) * 10}deg)`,
 *   })}
 * >
 *   {items.map(item => <Item key={item.id} />)}
 * </Stagger>
 *
 * // Center-out stagger (middle items animate first)
 * <Stagger delay={4} direction="center-out" animation="scale">
 *   {items.map(item => <Item key={item.id} />)}
 * </Stagger>
 *
 * // With custom easing
 * <Stagger delay={5} easing={Easing.bezier(0.34, 1.56, 0.64, 1)}>
 *   {items}
 * </Stagger>
 * ```
 */
export const Stagger = ({
  children,
  delay = 5,
  startFrame = 0,
  durationInFrames = 20,
  direction = "forward",
  easing = Easing.out(Easing.cubic),
  animation = "fadeUp",
  className,
  style,
}: StaggerProps) => {
  const frame = useCurrentFrame();
  const childArray = Children.toArray(children);
  const total = childArray.length;

  const staggeredChildren = childArray.map((child, index) => {
    if (!isValidElement(child)) return child;

    const delayOrder = getDelayOrder(index, total, direction);
    const childStartFrame = startFrame + delayOrder * delay;

    const progress = interpolate(
      frame,
      [childStartFrame, childStartFrame + durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const easedProgress = easing(progress);

    // Get animation styles
    const animationStyle = typeof animation === "function"
      ? animation({ progress: easedProgress, index, total })
      : getPresetStyle(animation, easedProgress);

    // Clone element with animation styles
    return cloneElement(child as ReactElement, {
      style: {
        ...(child.props as { style?: CSSProperties }).style,
        ...animationStyle,
      },
      key: (child as ReactElement).key ?? index,
    });
  });

  return (
    <div className={className} style={style}>
      {staggeredChildren}
    </div>
  );
};
