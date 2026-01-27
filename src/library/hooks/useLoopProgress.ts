import { useCurrentFrame } from "remotion";

/**
 * Configuration for useLoopProgress.
 */
export type UseLoopProgressConfig = {
  /** Duration of one loop cycle in frames. */
  durationInFrames: number;
  /** Frame at which looping starts. Defaults to 0. */
  startFrame?: number;
  /** Easing function applied to each cycle. */
  easing?: (t: number) => number;
};

/**
 * `useLoopProgress` returns a 0-1 value that loops every N frames.
 * Looping progress is extremely common (rotating elements, pulsing opacity,
 * cycling gradients) and deserves a one-liner instead of the clunky
 * `useFrameProgress` + modulo pattern.
 *
 * @example
 * ```tsx
 * // Simple rotation loop
 * const progress = useLoopProgress({ durationInFrames: 60 });
 * const rotation = progress * 360;
 *
 * // Pulsing opacity
 * const pulse = useLoopProgress({ durationInFrames: 30 });
 * const opacity = 0.5 + Math.sin(pulse * Math.PI * 2) * 0.5;
 *
 * // With easing for non-linear loop
 * const bounce = useLoopProgress({
 *   durationInFrames: 45,
 *   easing: (t) => Math.sin(t * Math.PI), // smooth up and down
 * });
 *
 * // Delayed start
 * const progress = useLoopProgress({
 *   durationInFrames: 30,
 *   startFrame: 60,
 * });
 * ```
 */
export function useLoopProgress(config: UseLoopProgressConfig): number {
  const { durationInFrames, startFrame = 0, easing } = config;
  const frame = useCurrentFrame();

  // Don't start until startFrame
  if (frame < startFrame) return 0;

  const elapsed = frame - startFrame;
  const rawProgress = (elapsed % durationInFrames) / durationInFrames;

  return easing ? easing(rawProgress) : rawProgress;
}

/**
 * Overload for simple usage with just duration.
 */
export function useLoop(durationInFrames: number): number {
  return useLoopProgress({ durationInFrames });
}
