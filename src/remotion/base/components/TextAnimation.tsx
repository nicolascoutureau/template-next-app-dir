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
}

export const TextAnimation = ({ text, createTimeline }: TextAnimationProps) => {
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
      className="text-5xl font-bold text-center p-8 font-sans"
    >
      <div ref={textRef}>{text}</div>
    </div>
  );
};
