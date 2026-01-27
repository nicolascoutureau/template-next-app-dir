import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Hook that syncs a GSAP timeline with Remotion's frame system.
 * Creates a timeline that can be scrubbed frame-by-frame.
 *
 * @param gsapTimelineFactory - Factory function that creates and returns the GSAP timeline
 * @param deps - Dependencies array for memoizing the timeline factory
 * @returns A ref to attach to the animation scope element
 */
export const useGsapTimeline = <T extends HTMLElement>(
  gsapTimelineFactory: () => gsap.core.Timeline,
  deps: React.DependencyList = []
) => {
  const animationScopeRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const memoizedTimelineFactory = useCallback(gsapTimelineFactory, deps);

  useEffect(() => {
    const ctx = gsap.context(() => {
      timelineRef.current = memoizedTimelineFactory();
      timelineRef.current.pause();
    }, animationScopeRef);
    return () => ctx.revert();
  }, [memoizedTimelineFactory]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.seek(frame / fps);
    }
  }, [frame, fps]);

  return animationScopeRef;
};
