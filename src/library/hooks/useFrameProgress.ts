import { useCurrentFrame } from "remotion";

/**
 * Configuration for deriving a normalized 0..1 progress value from the current
 * Remotion frame. This is useful for driving interpolations without re-creating
 * the same math in each component.
 */
export type FrameProgressOptions = {
  /** Frame where progress begins (inclusive). */
  startFrame?: number;
  /** Length of the animation in frames. */
  durationInFrames?: number;
  /** When true, clamps the result to the 0..1 range. */
  clamp?: boolean;
  /** Optional easing function applied after clamping. */
  easing?: (t: number) => number;
};

/**
 * Returns a normalized progress value (0..1 by default) based on Remotion's
 * current frame. You can offset the start frame, set a duration, and apply a
 * custom easing curve.
 */
export const useFrameProgress = (options: FrameProgressOptions = {}) => {
  const frame = useCurrentFrame();
  const {
    startFrame = 0,
    durationInFrames = 30,
    clamp = true,
    easing,
  } = options;

  const rawProgress =
    durationInFrames <= 0
      ? frame >= startFrame
        ? 1
        : 0
      : (frame - startFrame) / durationInFrames;

  const clampedProgress = clamp
    ? Math.min(1, Math.max(0, rawProgress))
    : rawProgress;

  return easing ? easing(clampedProgress) : clampedProgress;
};
