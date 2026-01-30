import { useGsapTimeline } from "../../hooks/useGsapTimeline";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

gsap.registerPlugin(SplitText);

/**
 * Timeline creation context passed to createTimeline function.
 */
export interface TimelineContext {
  /** Reference to the text container element */
  textRef: RefObject<HTMLDivElement | null>;
  /** GSAP timeline to add animations to */
  tl: gsap.core.Timeline;
  /** SplitText utility for splitting text into chars/words/lines */
  SplitText: typeof SplitText;
}

/**
 * Props for TextAnimation component.
 */
export interface TextAnimationProps {
  /** Content to animate - can be text or any React elements */
  children: ReactNode;
  /** Function to create the GSAP timeline animation */
  createTimeline: (ctx: TimelineContext) => gsap.core.Timeline;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Enable 3D perspective */
  perspective?: number;
}

/**
 * GSAP-powered text animation component.
 * Provides access to SplitText for character, word, and line-based animations.
 *
 * @example
 * // Fade in characters one by one
 * <TextAnimation
 *   createTimeline={({ textRef, tl, SplitText }) => {
 *     const split = new SplitText(textRef.current, { type: "chars" });
 *     tl.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, ease: "power2.out" });
 *     return tl;
 *   }}
 * >
 *   Hello World
 * </TextAnimation>
 */
export const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  createTimeline,
  className,
  style,
  perspective = 1000,
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  const animationContainerRef = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    return createTimeline({
      textRef,
      tl,
      SplitText,
    });
  });

  return (
    <div 
      ref={animationContainerRef} 
      className={className} 
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        ...style
      }}
    >
      <div ref={textRef} style={{ transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
};

// ============================================
// Pre-built animation presets
// ============================================

/**
 * Props for preset text animations.
 */
export interface TextAnimationPresetProps {
  children: ReactNode;
  /** Stagger delay between elements in seconds */
  stagger?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** GSAP easing */
  ease?: string;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}

/**
 * Fade in text character by character from below.
 */
export const FadeInChars: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.03,
  duration = 0.5,
  ease = "power2.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, { opacity: 0, y: 20, duration, stagger, ease });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * Fade in text word by word.
 */
export const FadeInWords: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.1,
  duration = 0.5,
  ease = "power2.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, { opacity: 0, y: 15, duration, stagger, ease });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * Reveal text line by line.
 */
export const RevealLines: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.15,
  duration = 0.6,
  ease = "power3.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "lines" });
      tl.from(split.lines, { opacity: 0, y: 30, duration, stagger, ease });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * 3D Flip in characters (rotate X).
 */
export const FlipInChars: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.03,
  duration = 0.6,
  ease = "back.out(1.7)",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    perspective={800}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, {
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -50",
        duration,
        stagger,
        ease,
      });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * 3D Rotate in words (rotate Y).
 */
export const RotateInWords: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.1,
  duration = 0.7,
  ease = "power2.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    perspective={1000}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        rotationY: 90,
        transformOrigin: "0% 50% -50",
        duration,
        stagger,
        ease,
      });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * Slide in text from a direction.
 */
export const SlideInText: React.FC<TextAnimationPresetProps & { 
  direction?: "left" | "right" | "top" | "bottom";
  distance?: number;
}> = ({
  children,
  stagger = 0.05,
  duration = 0.6,
  ease = "power3.out",
  direction = "left",
  distance = 100,
  className,
  style,
}) => {
  const getOffset = () => {
    switch (direction) {
      case "left": return { x: -distance, y: 0 };
      case "right": return { x: distance, y: 0 };
      case "top": return { x: 0, y: -distance };
      case "bottom": return { x: 0, y: distance };
    }
  };
  
  const offset = getOffset();
  
  return (
    <TextAnimation
      className={className}
      style={style}
      createTimeline={({ textRef, tl, SplitText }) => {
        const split = new SplitText(textRef.current, { type: "chars" });
        tl.from(split.chars, {
          ...offset,
          opacity: 0,
          duration,
          stagger,
          ease,
        });
        return tl;
      }}
    >
      {children}
    </TextAnimation>
  );
};

export default TextAnimation;
