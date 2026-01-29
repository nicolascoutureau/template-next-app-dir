import React, { useRef, useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { getEasing, type EasingName } from "../../presets/easings";
import { getDuration, type DurationName } from "../../presets/durations";
import { useSpring, type UseSpringOptions } from "../../hooks/useSpring";
import { type SpringName, type SpringConfig } from "../../presets/springs";

/**
 * Animatable CSS properties.
 */
export interface AnimatableProperties {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
  blur?: number;
}

/**
 * Props for the Animate component.
 */
export interface AnimateProps {
  children: React.ReactNode;
  /** Starting state */
  from?: AnimatableProperties;
  /** Ending state */
  to?: AnimatableProperties;
  /** Animation duration in seconds or preset name */
  duration?: number | DurationName;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing preset name or custom easing string */
  ease?: EasingName | string;
  /** Use spring physics instead of duration-based animation */
  spring?: SpringName | SpringConfig;
  /** Starting frame (overrides delay) */
  startFrame?: number;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
  /** Fill mode: 'forwards' keeps end state, 'backwards' keeps start state, 'both' */
  fillMode?: "forwards" | "backwards" | "both" | "none";
}

/**
 * Convert easing name to Remotion Easing function.
 */
function getRemotionEasing(ease: EasingName | string): ((t: number) => number) | undefined {
  // Map common GSAP easings to Remotion equivalents
  const easingMap: Record<string, (t: number) => number> = {
    "power1.out": Easing.out(Easing.quad),
    "power1.in": Easing.in(Easing.quad),
    "power1.inOut": Easing.inOut(Easing.quad),
    "power2.out": Easing.out(Easing.cubic),
    "power2.in": Easing.in(Easing.cubic),
    "power2.inOut": Easing.inOut(Easing.cubic),
    "power3.out": Easing.out(Easing.poly(4)),
    "power3.in": Easing.in(Easing.poly(4)),
    "power3.inOut": Easing.inOut(Easing.poly(4)),
    "power4.out": Easing.out(Easing.poly(5)),
    "power4.in": Easing.in(Easing.poly(5)),
    "power4.inOut": Easing.inOut(Easing.poly(5)),
    "expo.out": Easing.out(Easing.exp),
    "expo.in": Easing.in(Easing.exp),
    "expo.inOut": Easing.inOut(Easing.exp),
    "circ.out": Easing.out(Easing.circle),
    "circ.in": Easing.in(Easing.circle),
    "circ.inOut": Easing.inOut(Easing.circle),
    "sine.out": Easing.out(Easing.sin),
    "sine.in": Easing.in(Easing.sin),
    "sine.inOut": Easing.inOut(Easing.sin),
    "back.out(1.4)": Easing.out(Easing.back(1.4)),
    "back.out(1.7)": Easing.out(Easing.back(1.7)),
    "back.out(2.5)": Easing.out(Easing.back(2.5)),
    "elastic.out(1, 0.3)": Easing.out(Easing.elastic(1)),
    "elastic.out(0.8, 0.4)": Easing.out(Easing.elastic(0.8)),
    "elastic.out(0.6, 0.5)": Easing.out(Easing.elastic(0.6)),
    none: (t: number) => t,
  };

  const gsapEase = getEasing(ease as EasingName);
  return easingMap[gsapEase] ?? Easing.out(Easing.cubic);
}

/**
 * Base animation component that wraps children with animated CSS transforms.
 *
 * @example
 * // Basic fade in
 * <Animate from={{ opacity: 0 }} to={{ opacity: 1 }} duration={0.5}>
 *   <div>Content</div>
 * </Animate>
 *
 * @example
 * // Slide up with spring physics
 * <Animate
 *   from={{ y: 100, opacity: 0 }}
 *   to={{ y: 0, opacity: 1 }}
 *   spring="bouncy"
 * >
 *   <Card />
 * </Animate>
 *
 * @example
 * // Complex animation
 * <Animate
 *   from={{ scale: 0, rotate: -180, opacity: 0 }}
 *   to={{ scale: 1, rotate: 0, opacity: 1 }}
 *   duration={0.8}
 *   ease="bouncy"
 *   delay={0.2}
 * >
 *   <Logo />
 * </Animate>
 */
export const Animate: React.FC<AnimateProps> = ({
  children,
  from = {},
  to = {},
  duration: durationProp = 0.5,
  delay = 0,
  ease = "smooth",
  spring,
  startFrame,
  style,
  className,
  fillMode = "both",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate timing
  const duration = getDuration(durationProp);
  const delayFrames = Math.round(delay * fps);
  const durationFrames = Math.round(duration * fps);
  const start = startFrame ?? delayFrames;
  const end = start + durationFrames;

  // Get animation progress
  const springOptions: UseSpringOptions | undefined = spring
    ? { spring, delay, from: startFrame }
    : undefined;

  const { value: springValue } = useSpring(springOptions ?? { spring: "smooth", delay });

  // Calculate progress based on spring or duration
  const progress = useMemo(() => {
    if (spring) {
      return springValue;
    }

    // Duration-based animation
    const easing = getRemotionEasing(ease);
    return interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: fillMode === "backwards" || fillMode === "both" ? "clamp" : "extend",
      extrapolateRight: fillMode === "forwards" || fillMode === "both" ? "clamp" : "extend",
      easing,
    });
  }, [spring, springValue, frame, start, end, ease, fillMode]);

  // Interpolate each property
  const animatedStyle = useMemo((): CSSProperties => {
    const getAnimatedValue = (prop: keyof AnimatableProperties): number | undefined => {
      const fromVal = from[prop];
      const toVal = to[prop];

      if (fromVal === undefined && toVal === undefined) return undefined;

      const startVal = fromVal ?? (prop === "opacity" || prop === "scale" || prop === "scaleX" || prop === "scaleY" ? 1 : 0);
      const endVal = toVal ?? (prop === "opacity" || prop === "scale" || prop === "scaleX" || prop === "scaleY" ? 1 : 0);

      return startVal + (endVal - startVal) * progress;
    };

    const opacity = getAnimatedValue("opacity");
    const x = getAnimatedValue("x");
    const y = getAnimatedValue("y");
    const scale = getAnimatedValue("scale");
    const scaleX = getAnimatedValue("scaleX");
    const scaleY = getAnimatedValue("scaleY");
    const rotate = getAnimatedValue("rotate");
    const rotateX = getAnimatedValue("rotateX");
    const rotateY = getAnimatedValue("rotateY");
    const rotateZ = getAnimatedValue("rotateZ");
    const skewX = getAnimatedValue("skewX");
    const skewY = getAnimatedValue("skewY");
    const blur = getAnimatedValue("blur");

    // Build transform string
    const transforms: string[] = [];

    if (x !== undefined || y !== undefined) {
      transforms.push(`translate(${x ?? 0}px, ${y ?? 0}px)`);
    }
    if (scale !== undefined) {
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
    if (skewX !== undefined || skewY !== undefined) {
      transforms.push(`skew(${skewX ?? 0}deg, ${skewY ?? 0}deg)`);
    }

    return {
      opacity,
      transform: transforms.length > 0 ? transforms.join(" ") : undefined,
      filter: blur !== undefined ? `blur(${blur}px)` : undefined,
      willChange: "transform, opacity, filter",
    };
  }, [from, to, progress]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...animatedStyle,
      }}
    >
      {children}
    </div>
  );
};

export default Animate;
