import { useGsapTimeline } from "../hooks/useGsapTimeline";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, CSSProperties } from "react";

gsap.registerPlugin(SplitText);

export interface TextAnimationProps {
  /** The text content to animate */
  text: React.ReactNode;
  /** Factory function to create the GSAP timeline animation */
  createTimeline: (params: {
    textRef: React.RefObject<HTMLDivElement | null>;
    tl: gsap.core.Timeline;
  }) => gsap.core.Timeline;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles for the container */
  style?: CSSProperties;
}

/**
 * TextAnimation component for creating GSAP-powered text animations in Remotion.
 * Uses SplitText plugin for character/word/line-level animations.
 *
 * @example
 * ```tsx
 * <TextAnimation
 *   text="Hello World"
 *   createTimeline={({ textRef, tl }) => {
 *     const split = new SplitText(textRef.current, { type: "chars" });
 *     return tl.from(split.chars, {
 *       opacity: 0,
 *       y: 20,
 *       stagger: 0.05,
 *       duration: 0.5
 *     });
 *   }}
 * />
 * ```
 */
export const TextAnimation = ({
  text,
  createTimeline,
  className = "",
  style,
}: TextAnimationProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  const animationContainerRef = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    return createTimeline({
      textRef,
      tl,
    });
  });

  return (
    <div
      ref={animationContainerRef}
      className={`text-5xl font-bold text-center p-8 font-sans ${className}`.trim()}
      style={style}
    >
      <div ref={textRef}>{text}</div>
    </div>
  );
};
