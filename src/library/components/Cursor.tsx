import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Cursor style variant.
 */
export type CursorVariant = "pointer" | "default" | "hand" | "text";

/**
 * A single cursor movement/action in the sequence.
 */
export type CursorAction = {
  /** Target X position in pixels. */
  x: number;
  /** Target Y position in pixels. */
  y: number;
  /** Frame at which the cursor starts moving to this position. */
  frame: number;
  /** Duration of the movement in frames. */
  duration?: number;
  /** Whether to perform a click at this position. */
  click?: boolean;
  /** Whether to perform a double-click. */
  doubleClick?: boolean;
  /** Cursor style at this position. */
  cursor?: CursorVariant;
};

/**
 * Props for the `Cursor` component.
 */
export type CursorProps = {
  /** Array of cursor actions/movements. */
  actions: CursorAction[];
  /** Optional easing function for movements. */
  easing?: (t: number) => number;
  /** Cursor color. Defaults to white. */
  color?: string;
  /** Cursor size multiplier. Defaults to 1. */
  size?: number;
  /** Click ripple color. */
  rippleColor?: string;
  /** Whether to show click ripple effect. */
  showRipple?: boolean;
  /** Whether to show cursor trail. */
  showTrail?: boolean;
  /** Optional className on the wrapper div. */
  className?: string;
  /** Inline styles for the wrapper div. */
  style?: CSSProperties;
};

const cursorPaths: Record<CursorVariant, string> = {
  pointer: "M5.5 3.21V20.8l4.86-4.86h7.29L5.5 3.21z",
  default: "M5.5 3.21V20.8l4.86-4.86h7.29L5.5 3.21z",
  hand: "M12 2C9.5 2 7.5 4 7.5 6.5V12l-1.3-1.3c-.8-.8-2.1-.8-2.9 0s-.8 2.1 0 2.9l5.5 5.5c.8.8 2 1.3 3.2 1.3h3c2.8 0 5-2.2 5-5v-5c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5v-1c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5V6.5c0-2.5-2-4.5-4.5-4.5z",
  text: "M12 4v16m-4-16h8m-8 16h8",
};

/**
 * `Cursor` renders an animated cursor that moves and clicks on screen.
 * Essential for UI demo videos to simulate user interaction.
 *
 * @example
 * ```tsx
 * <Cursor
 *   actions={[
 *     { x: 100, y: 100, frame: 0, duration: 20 },
 *     { x: 300, y: 200, frame: 20, duration: 15, click: true },
 *     { x: 500, y: 150, frame: 45, duration: 20 },
 *   ]}
 *   showRipple
 *   easing={(t) => 1 - Math.pow(1 - t, 3)}
 * />
 * ```
 */
export const Cursor = ({
  actions,
  easing,
  color = "#ffffff",
  size = 1,
  rippleColor = "rgba(59, 130, 246, 0.5)",
  showRipple = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showTrail = false,
  className,
  style,
}: CursorProps) => {
  const frame = useCurrentFrame();

  // Find current and next action based on frame
  let currentAction = actions[0];
  let prevAction = actions[0];

  for (let i = 0; i < actions.length; i++) {
    if (frame >= actions[i].frame) {
      prevAction = i > 0 ? actions[i - 1] : actions[i];
      currentAction = actions[i];
    }
  }

  // Calculate interpolated position
  const actionDuration = currentAction.duration ?? 15;
  const actionProgress = Math.min(
    1,
    Math.max(0, (frame - currentAction.frame) / actionDuration)
  );
  const easedProgress = easing ? easing(actionProgress) : actionProgress;

  // Interpolate from previous position to current
  const startX = frame <= currentAction.frame ? prevAction.x : prevAction.x;
  const startY = frame <= currentAction.frame ? prevAction.y : prevAction.y;
  const x = startX + (currentAction.x - startX) * easedProgress;
  const y = startY + (currentAction.y - startY) * easedProgress;

  // Check if clicking at current frame
  const isClicking = currentAction.click && 
    frame >= currentAction.frame + actionDuration && 
    frame < currentAction.frame + actionDuration + 8;

  const cursorVariant = currentAction.cursor ?? "pointer";

  // Ripple animation for clicks
  const rippleProgress = useFrameProgress({
    startFrame: currentAction.frame + actionDuration,
    durationInFrames: 20,
    clamp: true,
  });
  const showClickRipple = showRipple && currentAction.click && rippleProgress > 0 && rippleProgress < 1;

  const wrapperStyle: CSSProperties = {
    ...style,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1000,
  };

  const cursorStyle: CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: 24 * size,
    height: 24 * size,
    transform: `scale(${isClicking ? 0.85 : 1})`,
    transition: "transform 0.05s ease-out",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
  };

  const rippleStyle: CSSProperties = {
    position: "absolute",
    left: x + 2,
    top: y + 2,
    width: 40 * size,
    height: 40 * size,
    borderRadius: "50%",
    background: rippleColor,
    transform: `translate(-50%, -50%) scale(${rippleProgress * 2})`,
    opacity: 1 - rippleProgress,
  };

  return (
    <div className={className} style={wrapperStyle}>
      {/* Click Ripple */}
      {showClickRipple && <div style={rippleStyle} />}
      
      {/* Cursor */}
      <svg style={cursorStyle} viewBox="0 0 24 24" fill="none">
        <path
          d={cursorPaths[cursorVariant]}
          fill={color}
          stroke="#000"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
