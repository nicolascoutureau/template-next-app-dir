import { useGsapTimeline } from "../hooks/useGsapTimeline";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, CSSProperties, useMemo } from "react";

gsap.registerPlugin(SplitText);

/**
 * Available animation presets for TextAnimation.
 */
export type TextAnimationPreset =
  | "fadeUp"
  | "fadeDown"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "scale"
  | "scaleUp"
  | "scaleDown"
  | "typewriter"
  | "blur"
  | "rotateIn"
  | "elastic"
  | "bounce"
  | "flip"
  | "wave";

/**
 * Split type for text animation.
 */
export type SplitType = "chars" | "words" | "lines";

/**
 * Direction for directional animations.
 */
export type AnimationDirection = "left" | "right" | "up" | "down";

/**
 * Base props shared by all TextAnimation variants.
 */
interface TextAnimationBaseProps {
  /** The text content to animate */
  text: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles for the container */
  style?: CSSProperties;
}

/**
 * Props for preset-based animations (fast path).
 */
interface TextAnimationPresetProps extends TextAnimationBaseProps {
  /** Animation preset to use */
  preset: TextAnimationPreset;
  /** How to split the text for animation */
  splitBy?: SplitType;
  /** Stagger delay between elements (in seconds) */
  stagger?: number;
  /** Animation duration (in seconds) */
  duration?: number;
  /** Direction for directional presets (slideIn, etc.) */
  direction?: AnimationDirection;
  /** Easing function name or custom ease */
  ease?: string;
  /** Distance for movement animations (in pixels) */
  distance?: number;
  /** Don't use createTimeline with preset mode */
  createTimeline?: never;
}

/**
 * Props for custom timeline animations (power path).
 */
interface TextAnimationCustomProps extends TextAnimationBaseProps {
  /** Factory function to create the GSAP timeline animation */
  createTimeline: (params: {
    textRef: React.RefObject<HTMLDivElement | null>;
    tl: gsap.core.Timeline;
    SplitText: typeof SplitText;
  }) => gsap.core.Timeline;
  /** Don't use preset with custom mode */
  preset?: never;
  splitBy?: never;
  stagger?: never;
  duration?: never;
  direction?: never;
  ease?: never;
  distance?: never;
}

export type TextAnimationProps = TextAnimationPresetProps | TextAnimationCustomProps;

/**
 * Creates a GSAP timeline for a given preset configuration.
 */
function createPresetTimeline(
  textRef: React.RefObject<HTMLDivElement | null>,
  tl: gsap.core.Timeline,
  preset: TextAnimationPreset,
  options: {
    splitBy: SplitType;
    stagger: number;
    duration: number;
    direction: AnimationDirection;
    ease: string;
    distance: number;
  }
): gsap.core.Timeline {
  const { splitBy, stagger, duration, direction, ease, distance } = options;
  
  if (!textRef.current) return tl;
  
  const split = new SplitText(textRef.current, { type: splitBy });
  const elements = split[splitBy];

  // Direction-based offsets
  const getDirectionalOffset = () => {
    switch (direction) {
      case "left": return { x: -distance, y: 0 };
      case "right": return { x: distance, y: 0 };
      case "up": return { x: 0, y: -distance };
      case "down": return { x: 0, y: distance };
    }
  };

  switch (preset) {
    case "fadeUp":
      return tl.from(elements, {
        opacity: 0,
        y: distance,
        stagger,
        duration,
        ease,
      });

    case "fadeDown":
      return tl.from(elements, {
        opacity: 0,
        y: -distance,
        stagger,
        duration,
        ease,
      });

    case "fadeIn":
      return tl.from(elements, {
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "slideLeft":
      return tl.from(elements, {
        x: distance,
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "slideRight":
      return tl.from(elements, {
        x: -distance,
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "slideUp":
      return tl.from(elements, {
        y: distance,
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "slideDown":
      return tl.from(elements, {
        y: -distance,
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "scale":
    case "scaleUp":
      return tl.from(elements, {
        scale: 0,
        opacity: 0,
        stagger,
        duration,
        ease: ease || "back.out(1.7)",
      });

    case "scaleDown":
      return tl.from(elements, {
        scale: 1.5,
        opacity: 0,
        stagger,
        duration,
        ease,
      });

    case "typewriter":
      return tl.from(elements, {
        opacity: 0,
        stagger: stagger || 0.03,
        duration: 0.01,
        ease: "none",
      });

    case "blur":
      return tl.from(elements, {
        opacity: 0,
        filter: "blur(10px)",
        stagger,
        duration,
        ease,
      });

    case "rotateIn":
      return tl.from(elements, {
        opacity: 0,
        rotation: direction === "left" ? -90 : 90,
        transformOrigin: direction === "left" ? "left center" : "right center",
        stagger,
        duration,
        ease: ease || "back.out(1.7)",
      });

    case "elastic":
      return tl.from(elements, {
        opacity: 0,
        scale: 0,
        stagger,
        duration: duration || 0.8,
        ease: "elastic.out(1, 0.3)",
      });

    case "bounce":
      return tl.from(elements, {
        opacity: 0,
        y: -distance,
        stagger,
        duration: duration || 0.6,
        ease: "bounce.out",
      });

    case "flip":
      return tl.from(elements, {
        opacity: 0,
        rotationX: -90,
        transformOrigin: "top center",
        stagger,
        duration,
        ease: ease || "power2.out",
      });

    case "wave":
      return tl.from(elements, {
        opacity: 0,
        y: distance,
        stagger: {
          each: stagger,
          from: "start",
        },
        duration,
        ease: "sine.inOut",
      });

    default:
      return tl.from(elements, {
        opacity: 0,
        stagger,
        duration,
        ease,
      });
  }
}

/**
 * TextAnimation component for creating GSAP-powered text animations in Remotion.
 * Uses SplitText plugin for character/word/line-level animations.
 *
 * Supports two modes:
 * 1. **Preset mode** (fast path): Use built-in presets for common animations
 * 2. **Custom mode** (power path): Full control with createTimeline factory
 *
 * @example
 * // Fast path — preset-based animation
 * ```tsx
 * <TextAnimation text="Launch Day" preset="fadeUp" splitBy="chars" stagger={0.05} />
 * <TextAnimation text="Subtitle" preset="slideLeft" splitBy="words" />
 * <TextAnimation text="CTA" preset="scale" splitBy="chars" />
 * <TextAnimation text="Loading..." preset="typewriter" />
 * ```
 *
 * @example
 * // Power path — full custom control
 * ```tsx
 * <TextAnimation
 *   text="Custom Animation"
 *   createTimeline={({ textRef, tl, SplitText }) => {
 *     const split = new SplitText(textRef.current, { type: "chars" });
 *     return tl.from(split.chars, {
 *       opacity: 0,
 *       y: 20,
 *       rotation: 15,
 *       stagger: 0.05,
 *       duration: 0.5
 *     });
 *   }}
 * />
 * ```
 */
export const TextAnimation = (props: TextAnimationProps) => {
  const {
    text,
    className,
    style,
  } = props;

  const textRef = useRef<HTMLDivElement>(null);

  // Determine if using preset or custom mode
  const isPresetMode = "preset" in props && props.preset !== undefined;

  // Memoize preset options to prevent unnecessary re-renders
  const presetOptions = useMemo(() => {
    if (!isPresetMode) return null;
    const presetProps = props as TextAnimationPresetProps;
    return {
      splitBy: presetProps.splitBy ?? "chars",
      stagger: presetProps.stagger ?? 0.05,
      duration: presetProps.duration ?? 0.5,
      direction: presetProps.direction ?? "left",
      ease: presetProps.ease ?? "power2.out",
      distance: presetProps.distance ?? 30,
    };
  }, [isPresetMode, props]);

  const animationContainerRef = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    
    if (isPresetMode && presetOptions) {
      const presetProps = props as TextAnimationPresetProps;
      return createPresetTimeline(textRef, tl, presetProps.preset, presetOptions);
    } else {
      const customProps = props as TextAnimationCustomProps;
      return customProps.createTimeline({
        textRef,
        tl,
        SplitText,
      });
    }
  }, [isPresetMode, presetOptions]);

  return (
    <div
      ref={animationContainerRef}
      className={className}
      style={style}
    >
      <div ref={textRef}>{text}</div>
    </div>
  );
};
