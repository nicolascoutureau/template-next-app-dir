import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Theme presets for the typing bar.
 */
export type TypingBarTheme = "light" | "dark" | "glass";

/**
 * Props for the `TypingBar` component.
 */
export type TypingBarProps = {
  /** Text to type out. Can be a string or array of strings for multi-step typing. */
  text: string | string[];
  /** Frame at which typing starts. Defaults to 0. */
  startFrame?: number;
  /** Typing speed in frames per character. Defaults to 2. */
  speed?: number;
  /** Delay between clearing and typing next text (for arrays). Defaults to 15 frames. */
  clearDelay?: number;
  /** Whether to show the blinking cursor. Defaults to true. */
  showCursor?: boolean;
  /** Cursor blink speed in frames. Defaults to 15. */
  cursorBlinkSpeed?: number;
  /** Theme preset. Defaults to "light". */
  theme?: TypingBarTheme;
  /** Placeholder text shown before typing starts. */
  placeholder?: string;
  /** Icon to show on the left side. */
  leftIcon?: ReactNode;
  /** Icon to show on the right side. */
  rightIcon?: ReactNode;
  /** Width of the bar. Defaults to 400. */
  width?: number;
  /** Border radius. Defaults to 50 (pill shape). */
  borderRadius?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles for the container. */
  style?: CSSProperties;
  /** Font size. Defaults to 18. */
  fontSize?: number;
  /** Padding. Defaults to "12px 24px". */
  padding?: string;
};

/**
 * Get theme styles.
 */
function getThemeStyles(theme: TypingBarTheme): CSSProperties {
  switch (theme) {
    case "dark":
      return {
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      };
    case "glass":
      return {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      };
    case "light":
    default:
      return {
        backgroundColor: "rgba(245, 245, 245, 0.95)",
        color: "#1a1a1a",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
      };
  }
}

/**
 * Search icon component.
 */
const SearchIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

/**
 * `TypingBar` creates an animated search/URL bar with typing effect.
 * Common in product demo videos to show URL entry, search queries,
 * or command typing.
 *
 * @example
 * ```tsx
 * // Simple typing
 * <TypingBar text="jumper.exchange" />
 *
 * // Multi-step typing (clears between each)
 * <TypingBar
 *   text={["react", "react hooks", "react hooks tutorial"]}
 *   speed={2}
 *   clearDelay={20}
 * />
 *
 * // With search icon
 * <TypingBar
 *   text="How to use Remotion"
 *   rightIcon={<SearchIcon />}
 *   theme="dark"
 * />
 *
 * // URL bar style
 * <TypingBar
 *   text="https://example.com/dashboard"
 *   theme="glass"
 *   placeholder="Enter URL..."
 * />
 * ```
 */
export const TypingBar = ({
  text,
  startFrame = 0,
  speed = 2,
  clearDelay = 15,
  showCursor = true,
  cursorBlinkSpeed = 15,
  theme = "light",
  placeholder,
  leftIcon,
  rightIcon,
  width = 400,
  borderRadius = 50,
  className,
  style,
  fontSize = 18,
  padding = "12px 24px",
}: TypingBarProps) => {
  const frame = useCurrentFrame();
  const themeStyles = getThemeStyles(theme);

  // Handle single string or array of strings
  const texts = Array.isArray(text) ? text : [text];

  // Calculate which text segment we're on and the current display text
  let displayText = "";
  let currentFrame = frame - startFrame;

  if (currentFrame >= 0) {
    let accumulatedFrames = 0;

    for (let i = 0; i < texts.length; i++) {
      const segmentText = texts[i];
      const typeFrames = segmentText.length * speed;
      const segmentTotalFrames =
        typeFrames + (i < texts.length - 1 ? clearDelay : 0);

      if (currentFrame < accumulatedFrames + segmentTotalFrames) {
        const frameInSegment = currentFrame - accumulatedFrames;

        if (frameInSegment < typeFrames) {
          // Typing phase
          const charsToShow = Math.floor(frameInSegment / speed);
          displayText = segmentText.slice(0, charsToShow + 1);
        } else {
          // Clear delay phase - show full text then clear
          const clearProgress = (frameInSegment - typeFrames) / clearDelay;
          if (clearProgress < 0.5) {
            displayText = segmentText;
          } else {
            displayText = "";
          }
        }
        break;
      }

      accumulatedFrames += segmentTotalFrames;

      // If we've passed all segments, show the last text
      if (i === texts.length - 1) {
        displayText = segmentText;
      }
    }
  }

  // Cursor blink animation
  const cursorOpacity = showCursor
    ? interpolate(
        frame % (cursorBlinkSpeed * 2),
        [0, cursorBlinkSpeed, cursorBlinkSpeed * 2],
        [1, 0, 1],
      )
    : 0;

  // Show placeholder if no text is being displayed yet
  const showPlaceholder = displayText === "" && placeholder && currentFrame < 0;

  const containerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    width,
    borderRadius,
    fontSize,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding,
    boxSizing: "border-box",
    ...themeStyles,
    ...style,
  };

  const textStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    minHeight: "1.2em",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  const cursorStyle: CSSProperties = {
    display: "inline-block",
    width: "2px",
    height: "1.1em",
    backgroundColor: "currentColor",
    opacity: cursorOpacity,
    marginLeft: "1px",
    verticalAlign: "middle",
  };

  const placeholderStyle: CSSProperties = {
    opacity: 0.5,
  };

  const iconStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    flexShrink: 0,
  };

  return (
    <div className={className} style={containerStyle}>
      {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
      <span style={textStyle}>
        {showPlaceholder ? (
          <span style={placeholderStyle}>{placeholder}</span>
        ) : (
          <>
            {displayText}
            {showCursor && <span style={cursorStyle} />}
          </>
        )}
      </span>
      {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
    </div>
  );
};

// Export the SearchIcon for convenience
export { SearchIcon };
