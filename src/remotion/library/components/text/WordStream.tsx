import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

export type PushDirection = "up" | "down" | "left" | "right";

export interface WordStreamProps {
  text: string;
  /**
   * Direction of the push animation.
   * @default "up"
   */
  direction?: PushDirection;
  /**
   * Font size of the text.
   * @default 80
   */
  fontSize?: number;
  /**
   * Font weight.
   * @default "bold"
   */
  fontWeight?: React.CSSProperties["fontWeight"];
  /**
   * Color of the text.
   * @default "currentColor"
   */
  color?: string;
  /**
   * CSS class name.
   */
  className?: string;
  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
  /**
   * Apply motion blur-like skew during movement.
   * @default true
   */
  withSkew?: boolean;
  /**
   * Duration in frames for the push transition.
   * @default 10
   */
  transitionDuration?: number;
  /**
   * Total duration of the animation in frames.
   * If not provided, it uses the composition's duration.
   */
  totalDuration?: number;
}

/**
 * WordStream Component
 *
 * Displays one word at a time, with the next word pushing the previous one out.
 * Creates a high-energy, kinetic reading experience.
 */
export const WordStream: React.FC<WordStreamProps> = ({
  text,
  direction = "up",
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  withSkew = true,
  transitionDuration = 10,
  totalDuration,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const duration = totalDuration ?? durationInFrames;
  const durationPerWord = duration / words.length;
  const currentIndex = Math.floor(frame / durationPerWord);
  
  // Safe bounds check
  const safeCurrentIndex = Math.min(words.length - 1, Math.max(0, currentIndex));
  const prevIndex = safeCurrentIndex - 1;

  // Local progress within the word slot
  const timeInSlot = frame % durationPerWord;

  // Determine transition progress [0, 1]
  const progress = interpolate(
    timeInSlot,
    [0, transitionDuration],
    [0, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.0, 0.2, 1), // Snappy ease
    }
  );

  // Helper to calculate transform based on progress (0 = entering position, 1 = center position)
  // But wait, we need to handle Enter AND Exit.
  
  // Enter: Starts off-screen (e.g. 100% Y), ends at center (0% Y)
  // Exit: Starts at center (0% Y), ends off-screen (e.g. -100% Y)
  
  const getTransform = (type: "enter" | "exit", p: number) => {
    // 1.5em gives enough clearance for most line heights
    const distance = "1.5em"; 
    
    // Skew logic: Max skew in middle of movement
    const skewMax = 20;
    const currentSkew = withSkew 
      ? interpolate(p, [0, 0.2, 0.8, 1], [0, skewMax, skewMax, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;

    // Direction logic
    let x = "0", y = "0";
    let skewX = "0deg", skewY = "0deg";

    if (direction === "up") {
       // Enter: Bottom -> Center
       // Exit: Center -> Top
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [100, 0]); // 100% to 0%
          y = `${val}%`;
          skewY = `${-currentSkew}deg`; // Skew opposite to motion? Motion is Up.
       } else {
          const val = interpolate(p, [0, 1], [0, -100]); // 0% to -100%
          y = `${val}%`;
          skewY = `${-currentSkew}deg`;
       }
    } else if (direction === "down") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [-100, 0]);
          y = `${val}%`;
          skewY = `${currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, 100]);
          y = `${val}%`;
          skewY = `${currentSkew}deg`;
       }
    } else if (direction === "left") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [100, 0]);
          x = `${val}%`;
          skewX = `${currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, -100]);
          x = `${val}%`;
          skewX = `${currentSkew}deg`;
       }
    } else if (direction === "right") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [-100, 0]);
          x = `${val}%`;
          skewX = `${-currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, 100]);
          x = `${val}%`;
          skewX = `${-currentSkew}deg`;
       }
    }

    // We use translate3d for hardware acceleration
    // Note: The % here is relative to the element size itself, which is what we want for text!
    return `translate3d(${x}, ${y}, 0) skew(${skewX}, ${skewY})`;
  };

  const currentWord = words[safeCurrentIndex];
  const previousWord = words[prevIndex];
  
  // Are we currently in the transition phase of a new word?
  // Yes, if timeInSlot < transitionDuration AND we are not at the very first word (which has no previous word to push)
  const isTransitioning = timeInSlot < transitionDuration && safeCurrentIndex > 0;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden", // Crucial for masking
        fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      <div style={{ position: "relative", textAlign: "center", display: "grid", placeItems: "center" }}>
        
        {/* Render Previous Word (Exiting) */}
        {isTransitioning && previousWord && (
            <span
              style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: getTransform("exit", progress),
                opacity: interpolate(progress, [0.6, 1], [1, 0]), // Fade out at very end
                willChange: "transform, opacity",
              }}
            >
              {previousWord}
            </span>
        )}

        {/* Render Current Word (Entering or Static) */}
        {currentWord && (
            <span
              style={{
                // If transitioning, animate enter. If not, it's static in center.
                // Exception: First word (index 0) is always static/center from start (or could fade in, but let's keep it simple)
                transform: isTransitioning 
                    ? getTransform("enter", progress)
                    : "translate3d(0,0,0)",
                whiteSpace: "nowrap",
                willChange: "transform",
                // Ensure it's visible
                opacity: 1,
              }}
            >
              {currentWord}
            </span>
        )}
        
      </div>
    </div>
  );
};
