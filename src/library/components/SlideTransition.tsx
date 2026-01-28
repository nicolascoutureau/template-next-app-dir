import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing, spring } from "remotion";

/**
 * Advanced slide effect types.
 */
export type SlideEffect =
  | "smooth"
  | "elastic"
  | "bounce"
  | "overshoot"
  | "spring"
  | "momentum";

/**
 * Slide direction.
 */
export type SlideDirection = "left" | "right" | "up" | "down";

/**
 * Props for the `SlideTransition` component.
 */
export type SlideTransitionProps = {
  /** Content to slide. */
  children: ReactNode;
  /** Direction of the slide. */
  direction?: SlideDirection;
  /** Frame at which slide starts. */
  startFrame?: number;
  /** Duration of the slide in frames. */
  durationInFrames?: number;
  /** Slide effect/easing style. */
  effect?: SlideEffect;
  /** Whether this is a slide in or out. */
  mode?: "in" | "out";
  /** Distance to slide (percentage of container). */
  distance?: number;
  /** Whether to blur during motion. */
  motionBlur?: boolean;
  /** Motion blur intensity (0-1). */
  blurIntensity?: number;
  /** Whether to fade during slide. */
  fade?: boolean;
  /** Whether to scale during slide. */
  scale?: boolean;
  /** Scale amount (1 = no scale). */
  scaleAmount?: number;
  /** Whether to rotate during slide (3D tilt). */
  rotate?: boolean;
  /** Rotation amount in degrees. */
  rotateAmount?: number;
  /** Whether to add shadow during motion. */
  shadow?: boolean;
  /** FPS for spring calculation. */
  fps?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Get easing function based on effect type.
 */
const getEasing = (effect: SlideEffect): ((t: number) => number) => {
  switch (effect) {
    case "smooth":
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    case "elastic":
      return Easing.elastic(1);
    case "bounce":
      return Easing.bounce;
    case "overshoot":
      return Easing.bezier(0.34, 1.56, 0.64, 1);
    case "momentum":
      return Easing.bezier(0.19, 1, 0.22, 1);
    case "spring":
      return (t: number) => t; // Spring is handled differently
    default:
      return Easing.out(Easing.cubic);
  }
};

/**
 * `SlideTransition` provides advanced directional slide effects.
 * Includes physics-based animations, motion blur, and 3D transforms.
 *
 * @example
 * ```tsx
 * // Elastic slide from left
 * <SlideTransition direction="left" effect="elastic">
 *   <Content />
 * </SlideTransition>
 *
 * // Bouncy slide with motion blur
 * <SlideTransition direction="up" effect="bounce" motionBlur>
 *   <Content />
 * </SlideTransition>
 *
 * // Spring physics slide with 3D rotation
 * <SlideTransition effect="spring" rotate scale>
 *   <Content />
 * </SlideTransition>
 *
 * // Slide out with shadow
 * <SlideTransition mode="out" direction="right" shadow fade>
 *   <Content />
 * </SlideTransition>
 * ```
 */
export const SlideTransition = ({
  children,
  direction = "left",
  startFrame = 0,
  durationInFrames = 30,
  effect = "smooth",
  mode = "in",
  distance = 100,
  motionBlur = false,
  blurIntensity = 0.5,
  fade = false,
  scale = false,
  scaleAmount = 0.9,
  rotate = false,
  rotateAmount = 15,
  shadow = false,
  fps = 30,
  className,
  style,
}: SlideTransitionProps) => {
  const frame = useCurrentFrame();

  // Calculate progress based on effect type
  let progress: number;

  if (effect === "spring") {
    progress = spring({
      frame: frame - startFrame,
      fps,
      config: {
        damping: 12,
        mass: 0.5,
        stiffness: 100,
      },
    });
  } else {
    const easing = getEasing(effect);
    const rawProgress = interpolate(
      frame,
      [startFrame, startFrame + durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    progress = easing(rawProgress);
  }

  // Apply mode (in vs out)
  const animProgress = mode === "in" ? progress : 1 - progress;

  // Calculate movement offset
  const getOffset = () => {
    const remaining = (1 - animProgress) * distance;
    switch (direction) {
      case "left":
        return { x: -remaining, y: 0 };
      case "right":
        return { x: remaining, y: 0 };
      case "up":
        return { x: 0, y: -remaining };
      case "down":
        return { x: 0, y: remaining };
    }
  };

  const offset = getOffset();

  // Motion blur based on velocity
  const velocity = Math.abs(1 - animProgress);
  const blur = motionBlur ? velocity * 20 * blurIntensity : 0;
  const blurDirection =
    direction === "left" || direction === "right" ? "X" : "Y";

  // Scale calculation
  const currentScale = scale
    ? scaleAmount + (1 - scaleAmount) * animProgress
    : 1;

  // Rotation calculation (3D tilt effect)
  const rotation = rotate
    ? (1 - animProgress) *
      rotateAmount *
      (direction === "right" || direction === "down" ? -1 : 1)
    : 0;
  const rotationAxis =
    direction === "left" || direction === "right" ? "Y" : "X";

  // Shadow based on distance from resting position
  const shadowOpacity = shadow ? velocity * 0.3 : 0;
  const shadowOffset = velocity * 20;

  // Opacity
  const opacity = fade ? animProgress : 1;

  const containerStyle: CSSProperties = {
    perspective: rotate ? "1000px" : undefined,
    ...style,
  };

  const contentStyle: CSSProperties = {
    transform: `
      translate(${offset.x}%, ${offset.y}%)
      scale(${currentScale})
      rotate${rotationAxis}(${rotation}deg)
    `,
    filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
    opacity,
    boxShadow:
      shadow && shadowOpacity > 0.01
        ? `${direction === "right" ? -shadowOffset : direction === "left" ? shadowOffset : 0}px 
         ${direction === "down" ? -shadowOffset : direction === "up" ? shadowOffset : 0}px 
         ${shadowOffset * 2}px 
         rgba(0, 0, 0, ${shadowOpacity})`
        : undefined,
    transformStyle: rotate ? "preserve-3d" : undefined,
  };

  // Motion blur layers
  if (motionBlur && blur > 1) {
    const layers = 5;
    return (
      <div className={className} style={containerStyle}>
        {Array.from({ length: layers }).map((_, i) => {
          const layerOffset = (i / (layers - 1) - 0.5) * blur * 0.5;
          const layerOpacity = 1 - Math.abs(i / (layers - 1) - 0.5) * 1.5;

          return (
            <div
              key={i}
              style={{
                ...contentStyle,
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                transform: `
                  translate(${offset.x + (blurDirection === "X" ? layerOffset : 0)}%, ${offset.y + (blurDirection === "Y" ? layerOffset : 0)}%)
                  scale(${currentScale})
                  rotate${rotationAxis}(${rotation}deg)
                `,
                opacity:
                  i === Math.floor(layers / 2)
                    ? opacity
                    : layerOpacity * opacity * 0.3,
                filter: `blur(${blur * 0.2}px)`,
              }}
            >
              {children}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};
