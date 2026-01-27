import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Configuration for useStagger.
 */
export type UseStaggerConfig = {
  /** Number of items to generate progress values for. */
  count: number;
  /** Delay in frames between each item. */
  delay?: number;
  /** Frame at which the first item starts. */
  startFrame?: number;
  /** Duration of each item's animation in frames. */
  durationInFrames?: number;
  /** Easing function for each item. */
  easing?: (t: number) => number;
};

/**
 * Return value from useStagger.
 */
export type UseStaggerResult = {
  /** Array of progress values (0-1) for each item. */
  progress: number[];
  /** Array of raw (pre-easing) progress values. */
  rawProgress: number[];
  /** Index of the first item that hasn't completed yet (-1 if all complete). */
  activeIndex: number;
  /** Whether all items have completed their animations. */
  isComplete: boolean;
};

/**
 * `useStagger` returns an array of progress values, each delayed by N frames.
 * The math for staggered animations is simple but written repeatedly.
 * This makes it a one-liner.
 *
 * @example
 * ```tsx
 * // Basic stagger for 5 items
 * const { progress } = useStagger({ count: 5, delay: 5 });
 * 
 * return (
 *   <>
 *     {items.map((item, i) => (
 *       <div style={{ opacity: progress[i] }}>{item}</div>
 *     ))}
 *   </>
 * );
 *
 * // With custom timing
 * const { progress, activeIndex } = useStagger({
 *   count: 10,
 *   delay: 3,
 *   startFrame: 15,
 *   durationInFrames: 20,
 *   easing: Easing.bezier(0.34, 1.56, 0.64, 1),
 * });
 *
 * // Use activeIndex to know which item is currently animating
 * console.log(`Currently animating item ${activeIndex}`);
 * ```
 */
export function useStagger(config: UseStaggerConfig): UseStaggerResult {
  const {
    count,
    delay = 5,
    startFrame = 0,
    durationInFrames = 20,
    easing = Easing.out(Easing.cubic),
  } = config;

  const frame = useCurrentFrame();

  const rawProgress: number[] = [];
  const progress: number[] = [];
  let activeIndex = -1;
  let completeCount = 0;

  for (let i = 0; i < count; i++) {
    const itemStart = startFrame + i * delay;
    const itemEnd = itemStart + durationInFrames;

    const raw = interpolate(frame, [itemStart, itemEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    rawProgress.push(raw);
    progress.push(easing(raw));

    if (raw > 0 && raw < 1 && activeIndex === -1) {
      activeIndex = i;
    }

    if (raw >= 1) {
      completeCount++;
    }
  }

  return {
    progress,
    rawProgress,
    activeIndex,
    isComplete: completeCount === count,
  };
}
