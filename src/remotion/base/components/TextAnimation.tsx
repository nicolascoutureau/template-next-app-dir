import { useGsapTimeline } from "../hooks/useGsapTimeline";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(SplitText);

interface TextAnimationProps {
  text: React.ReactNode;
  createTimeline: ({
    textRef,
    tl,
  }: {
    textRef: React.RefObject<HTMLDivElement | null>;
    tl: gsap.core.Timeline;
  }) => gsap.core.Timeline;
  className?: string;
  style?: React.CSSProperties;
}

export const TextAnimation = ({
  text,
  createTimeline,
  className,
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
    <div ref={animationContainerRef} className={className} style={style}>
      <div ref={textRef}>{text}</div>
    </div>
  );
};
