import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Options for the useGsapTimeline hook.
 */
export interface GsapTimelineOptions {
  /**
   * Speed multiplier for the timeline. 
   * 1 = normal speed, 0.5 = half speed (slow-mo), 2 = double speed.
   * @default 1
   */
  timeScale?: number;
  /**
   * Delay before the timeline starts (in frames).
   * Alternative to wrapping in a <Sequence>.
   * @default 0
   */
  delayFrames?: number;
}

/**
 * Hook that syncs a GSAP timeline with Remotion's frame system.
 * Creates a timeline that can be scrubbed frame-by-frame.
 *
 * @param gsapTimelineFactory - Factory function that creates and returns the GSAP timeline
 * @param deps - Dependencies array for memoizing the timeline factory
 * @param options - Optional configuration for timeScale and delay
 * @returns A ref to attach to the animation scope element
 *
 * @example
 * ```tsx
 * // Basic usage
 * const ref = useGsapTimeline(() => {
 *   return gsap.timeline().from(".box", { opacity: 0, y: 50 });
 * });
 *
 * // With timeScale (slow motion)
 * const ref = useGsapTimeline(
 *   () => gsap.timeline().from(".box", { opacity: 0 }),
 *   [],
 *   { timeScale: 0.5 } // Half speed
 * );
 *
 * // With delay
 * const ref = useGsapTimeline(
 *   () => gsap.timeline().from(".box", { opacity: 0 }),
 *   [],
 *   { delayFrames: 30 } // Start after 30 frames
 * );
 * ```
 */
export const useGsapTimeline = <T extends HTMLElement>(
  gsapTimelineFactory: () => gsap.core.Timeline,
  deps: React.DependencyList = [],
  options: GsapTimelineOptions = {}
) => {
  const { timeScale = 1, delayFrames = 0 } = options;
  
  const animationScopeRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Apply delay: don't start until delayFrames has passed
      const effectiveFrame = Math.max(0, frame - delayFrames);
      
      // Apply timeScale: multiply the effective time
      const scaledTime = (effectiveFrame / fps) * timeScale;
      
      // Only animate if past the delay
      if (frame >= delayFrames) {
        timelineRef.current.seek(scaledTime);
      } else {
        // Before delay, stay at the beginning
        timelineRef.current.seek(0);
      }
    }
  }, [frame, fps, timeScale, delayFrames]);

  return animationScopeRef;
};
