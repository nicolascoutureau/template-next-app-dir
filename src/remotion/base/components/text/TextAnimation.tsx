import { useGsapTimeline } from "../../hooks/useGsapTimeline";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

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
 *
 * @example
 * // Word by word reveal
 * <TextAnimation
 *   createTimeline={({ textRef, tl, SplitText }) => {
 *     const split = new SplitText(textRef.current, { type: "words" });
 *     tl.from(split.words, { opacity: 0, x: -20, stagger: 0.1 });
 *     return tl;
 *   }}
 * >
 *   This is a sentence
 * </TextAnimation>
 *
 * @example
 * // Line by line with scale
 * <TextAnimation
 *   createTimeline={({ textRef, tl, SplitText }) => {
 *     const split = new SplitText(textRef.current, { type: "lines" });
 *     tl.from(split.lines, { opacity: 0, scale: 0.8, stagger: 0.15 });
 *     return tl;
 *   }}
 * >
 *   <h1>Multiple Lines</h1>
 *   <p>Of text content</p>
 * </TextAnimation>
 */
export const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  createTimeline,
  className,
  style,
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
    <div ref={animationContainerRef} className={className} style={style}>
      <div ref={textRef}>{children}</div>
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
 *
 * @example
 * <FadeInChars stagger={0.03}>Hello World</FadeInChars>
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
 *
 * @example
 * <FadeInWords stagger={0.1}>This is a sentence</FadeInWords>
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
 *
 * @example
 * <RevealLines stagger={0.15}>
 *   <p>Line one</p>
 *   <p>Line two</p>
 * </RevealLines>
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
 * Scramble/decode text effect - characters appear to scramble before revealing.
 *
 * @example
 * <ScrambleText duration={1}>Decoded Message</ScrambleText>
 */
export const ScrambleText: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.02,
  duration = 0.8,
  ease = "none",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, {
        opacity: 0,
        scale: 0,
        rotationX: -90,
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
 * Elastic bounce in effect for each character.
 *
 * @example
 * <BounceChars>Bouncy!</BounceChars>
 */
export const BounceChars: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.04,
  duration = 0.8,
  ease = "elastic.out(1, 0.3)",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, {
        opacity: 0,
        y: -50,
        scale: 0.5,
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
 * Wave animation - characters animate in a wave pattern.
 *
 * @example
 * <WaveText>Wavy Text</WaveText>
 */
export const WaveText: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.05,
  duration = 0.6,
  ease = "power2.inOut",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, {
        opacity: 0,
        y: 30,
        rotationZ: 10,
        duration,
        stagger: {
          each: stagger,
          from: "start",
        },
        ease,
      });
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * Slide in from left effect.
 *
 * @example
 * <SlideInText>Sliding Text</SlideInText>
 */
export const SlideInText: React.FC<TextAnimationPresetProps> = ({
  children,
  stagger = 0.03,
  duration = 0.5,
  ease = "power3.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }) => {
      const split = new SplitText(textRef.current, { type: "chars" });
      tl.from(split.chars, {
        opacity: 0,
        x: -30,
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
 * Props for TypewriterText component.
 */
export interface TypewriterTextProps {
  children: ReactNode;
  /** Time per character in seconds */
  speed?: number;
  /** Show blinking cursor */
  cursor?: boolean;
  /** Cursor character */
  cursorChar?: string;
  /** Cursor color */
  cursorColor?: string;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}

/**
 * Typewriter effect - reveals text character by character like typing.
 *
 * @example
 * <TypewriterText speed={0.05}>Hello, World!</TypewriterText>
 *
 * @example
 * <TypewriterText speed={0.03} cursor cursorChar="|" cursorColor="#60a5fa">
 *   Typing with cursor...
 * </TypewriterText>
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  children,
  speed = 0.05,
  cursor = true,
  cursorChar = "|",
  cursorColor = "currentColor",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Convert children to string
  const text = typeof children === "string" ? children : String(children);
  
  // Calculate how many characters should be visible based on current frame
  const charsToShow = Math.floor(frame / (speed * fps));
  const visibleText = text.slice(0, Math.min(charsToShow, text.length));
  const isComplete = charsToShow >= text.length;
  
  // Blinking cursor animation based on frame
  const cursorVisible = Math.floor(frame / (fps * 0.4)) % 2 === 0;
  
  return (
    <span className={className} style={style}>
      {visibleText}
      {cursor && (
        <span
          style={{
            color: cursorColor,
            opacity: cursorVisible ? 1 : 0,
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TextAnimation;
