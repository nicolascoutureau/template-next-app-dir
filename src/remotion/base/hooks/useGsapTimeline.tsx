import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const useGsapTimeline = <T extends HTMLElement>(
  gsapTimelineFactory: () => gsap.core.Timeline,
  deps: React.DependencyList = [],
) => {
  const animationScopeRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedTimelineFactory = useCallback(gsapTimelineFactory, deps);

  useEffect(() => {
    const ctx = gsap.context(() => {
      timelineRef.current = memoizedTimelineFactory();
      timelineRef.current.pause();
    }, animationScopeRef);
    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [memoizedTimelineFactory]);

  // Seek to current frame - this is the hot path, keep it minimal
  const tl = timelineRef.current;
  if (tl) {
    tl.seek(frame / fps);
  }

  return animationScopeRef;
};
