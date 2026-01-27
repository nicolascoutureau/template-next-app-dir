import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * A single segment in the chain.
 */
export type ChainSegment = {
  /** Duration of this segment in frames. */
  duration: number;
  /** Optional label for this segment. */
  label?: string;
  /** Easing for this segment (defaults to linear within segment). */
  easing?: (t: number) => number;
};

/**
 * Configuration for useChain.
 */
export type UseChainConfig = {
  /** Array of segments. */
  segments: ChainSegment[];
  /** Frame at which the chain starts. */
  startFrame?: number;
};

/**
 * Return value from useChain.
 */
export type UseChainResult = {
  /** Overall progress through the entire chain (0-1). */
  progress: number;
  /** Index of the currently active segment. */
  activeIndex: number;
  /** Label of the currently active segment (if provided). */
  activeLabel: string | undefined;
  /** Progress within the current segment (0-1). */
  segmentProgress: number;
  /** Whether the entire chain has completed. */
  isComplete: boolean;
  /** Get progress for a specific segment by index or label. */
  getSegmentProgress: (indexOrLabel: number | string) => number;
};

/**
 * `useChain` handles multi-step animation sequences.
 * Most animations follow a pattern: enter → hold → exit.
 * Currently requires calculating frame ranges manually for each segment.
 *
 * @example
 * ```tsx
 * // Basic enter → hold → exit
 * const { activeLabel, segmentProgress } = useChain({
 *   segments: [
 *     { duration: 20, label: "enter" },
 *     { duration: 40, label: "hold" },
 *     { duration: 20, label: "exit" },
 *   ],
 * });
 *
 * // Use active segment for conditional rendering
 * const opacity = activeLabel === "enter" ? segmentProgress 
 *               : activeLabel === "exit" ? 1 - segmentProgress 
 *               : 1;
 *
 * // Complex multi-step sequence
 * const { activeIndex, segmentProgress, getSegmentProgress } = useChain({
 *   segments: [
 *     { duration: 15, label: "fadeIn", easing: Easing.out(Easing.cubic) },
 *     { duration: 10, label: "scaleUp", easing: Easing.out(Easing.back) },
 *     { duration: 30, label: "hold" },
 *     { duration: 15, label: "fadeOut", easing: Easing.in(Easing.cubic) },
 *   ],
 *   startFrame: 10,
 * });
 *
 * // Get specific segment progress (useful for overlapping effects)
 * const fadeInProgress = getSegmentProgress("fadeIn");
 * ```
 */
export function useChain(config: UseChainConfig): UseChainResult {
  const { segments, startFrame = 0 } = config;
  const frame = useCurrentFrame();

  // Calculate total duration and segment boundaries
  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
  
  // Overall progress
  const progress = interpolate(
    frame,
    [startFrame, startFrame + totalDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Find active segment
  let activeIndex = 0;
  let segmentStart = startFrame;
  let segmentProgress = 0;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const segmentEnd = segmentStart + segment.duration;

    if (frame >= segmentStart && frame < segmentEnd) {
      activeIndex = i;
      const rawProgress = interpolate(
        frame,
        [segmentStart, segmentEnd],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      const easing = segment.easing ?? ((t: number) => t);
      segmentProgress = easing(rawProgress);
      break;
    } else if (frame >= segmentEnd) {
      activeIndex = i;
      segmentProgress = 1;
    }

    segmentStart = segmentEnd;
  }

  // Handle case where we're past all segments
  const isComplete = frame >= startFrame + totalDuration;
  if (isComplete) {
    activeIndex = segments.length - 1;
    segmentProgress = 1;
  }

  // Get progress for specific segment
  const getSegmentProgress = (indexOrLabel: number | string): number => {
    let targetIndex: number;
    
    if (typeof indexOrLabel === "string") {
      targetIndex = segments.findIndex((s) => s.label === indexOrLabel);
      if (targetIndex === -1) return 0;
    } else {
      targetIndex = indexOrLabel;
    }

    if (targetIndex < 0 || targetIndex >= segments.length) return 0;

    // Calculate start frame for this segment
    let targetStart = startFrame;
    for (let i = 0; i < targetIndex; i++) {
      targetStart += segments[i].duration;
    }
    const targetEnd = targetStart + segments[targetIndex].duration;

    const rawProgress = interpolate(frame, [targetStart, targetEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const easing = segments[targetIndex].easing ?? ((t: number) => t);
    return easing(rawProgress);
  };

  return {
    progress,
    activeIndex,
    activeLabel: segments[activeIndex]?.label,
    segmentProgress,
    isComplete,
    getSegmentProgress,
  };
}
