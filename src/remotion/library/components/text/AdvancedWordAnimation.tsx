import React, { type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { TextAnimation, type TimelineContext } from "./TextAnimation";

/**
 * Common props for advanced word animations.
 */
export interface AdvancedWordAnimationProps {
  children: ReactNode;
  /** Stagger delay between words in seconds */
  stagger?: number;
  /** Animation duration per word in seconds */
  duration?: number;
  /** GSAP easing */
  ease?: string;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}

/**
 * Slide Up Reveal: Words slide up with a clean fade.
 * A classic, professional animation.
 */
export const SlideUpWordReveal: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.1,
  duration = 0.6,
  ease = "power3.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        y: "100%",
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

/**
 * Cinematic Reveal: Words fade in with a blur and scale effect.
 * Creates a dreamy, high-end feel.
 */
export const CinematicWordReveal: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.15,
  duration = 0.8,
  ease = "power2.out",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        filter: "blur(15px)",
        scale: 1.5,
        y: 20,
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
 * Elastic Pop: Words pop in with a strong elastic bounce.
 * Energetic and playful.
 */
export const ElasticWordPop: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.05,
  duration = 0.8,
  ease = "elastic.out(1, 0.5)",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        scale: 0,
        y: 50,
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
 * Glitch Reveal: Words flicker and distort as they appear.
 * Cyberpunk / Tech feel.
 */
export const GlitchWordReveal: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.1,
  duration = 0.5,
  ease = "steps(1)", // rough easing
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      
      // Animate each word with a glitchy timeline
      split.words.forEach((word: Element, i: number) => {
          const startTime = i * stagger;
          
          // Initial hidden state
          tl.set(word, { opacity: 0 }, 0);
          
          // Glitch sequence
          const wordTl = gsap.timeline({ defaults: { duration: duration / 5 } });
          
          wordTl.to(word, { opacity: 1, scale: 1.2, x: 5, color: "#f00" })
                .to(word, { opacity: 0, x: -5, scale: 0.9, color: "#0ff" })
                .to(word, { opacity: 1, scale: 1.1, x: 0, filter: "blur(2px)", color: "inherit" })
                .to(word, { opacity: 0, scale: 1 })
                .to(word, { opacity: 1, filter: "blur(0px)" });
                
          tl.add(wordTl, startTime);
      });
      
      return tl;
    }}
  >
    {children}
  </TextAnimation>
);

/**
 * Perspective Rotate: Words rotate in 3D space with a swinging motion.
 * Adds depth and sophistication.
 */
export const PerspectiveWordRotate: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.1,
  duration = 0.8,
  ease = "back.out(1.7)",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={{ perspective: "1000px", ...style }}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        rotationX: -90,
        y: -30,
        z: -100,
        transformOrigin: "50% 0%",
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
 * Typewriter Word: Words appear discretely one by one.
 * Good for reading comprehension or specific timing.
 */
export const TypewriterWord: React.FC<AdvancedWordAnimationProps> = ({
  children,
  stagger = 0.2,
  duration = 0.01, // Instant appearance
  ease = "none",
  className,
  style,
}) => (
  <TextAnimation
    className={className}
    style={style}
    createTimeline={({ textRef, tl, SplitText }: TimelineContext) => {
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        display: "none", // Ensure layout doesn't shift if possible, but opacity 0 usually enough
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
