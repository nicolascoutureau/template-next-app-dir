import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { getEasing, type EasingName } from "../../presets/easings";
import { getDuration, type DurationName } from "../../presets/durations";

/**
 * Message alignment.
 */
export type BubbleAlign = "left" | "right";

/**
 * Bubble style preset.
 */
export type BubbleStyle = "ios" | "android" | "minimal" | "rounded" | "glossy";

/**
 * Props for BubbleMessage component.
 */
export interface BubbleMessageProps {
  children: ReactNode;
  /** Message alignment */
  align?: BubbleAlign;
  /** Bubble style preset */
  bubbleStyle?: BubbleStyle;
  /** Background color (auto-selected based on align if not specified) */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Show typing indicator before message */
  showTyping?: boolean;
  /** Typing indicator duration in seconds */
  typingDuration?: number;
  /** Animation duration in seconds */
  duration?: number | DurationName;
  /** Delay before animation in seconds */
  delay?: number;
  /** Easing preset */
  ease?: EasingName | string;
  /** Show message tail/pointer */
  showTail?: boolean;
  /** Avatar element */
  avatar?: ReactNode;
  /** Sender name */
  senderName?: string;
  /** Timestamp */
  timestamp?: string;
  /** Max width of bubble */
  maxWidth?: number | string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Get Remotion easing function.
 */
function getRemotionEasing(ease: EasingName | string): (t: number) => number {
  const gsapEase = getEasing(ease as EasingName);
  const easingMap: Record<string, (t: number) => number> = {
    "power2.out": Easing.out(Easing.cubic),
    "power2.inOut": Easing.inOut(Easing.cubic),
    "power3.out": Easing.out(Easing.poly(4)),
    "back.out(1.7)": Easing.out(Easing.back(1.7)),
    none: (t) => t,
  };
  return easingMap[gsapEase] ?? Easing.out(Easing.cubic);
}

/**
 * Style presets for different bubble styles.
 */
const stylePresets: Record<BubbleStyle, { borderRadius: string; padding: string }> = {
  ios: { borderRadius: "18px", padding: "10px 14px" },
  android: { borderRadius: "20px 20px 20px 4px", padding: "12px 16px" },
  minimal: { borderRadius: "8px", padding: "8px 12px" },
  rounded: { borderRadius: "24px", padding: "12px 20px" },
  glossy: { borderRadius: "20px", padding: "12px 18px" },
};

/**
 * Glossy style configuration - shiny bubble with gradient highlight.
 */
const glossyStyles: Record<BubbleAlign, { bg: string; highlight: string; text: string }> = {
  right: {
    bg: "linear-gradient(180deg, #3b9eff 0%, #007AFF 100%)",
    highlight: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
    text: "#ffffff",
  },
  left: {
    bg: "linear-gradient(180deg, #f0f0f5 0%, #d8d8e0 100%)",
    highlight: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)",
    text: "#000000",
  },
};

/**
 * Default colors based on alignment.
 */
const defaultColors: Record<BubbleAlign, { bg: string; text: string }> = {
  right: { bg: "#007AFF", text: "#ffffff" }, // iMessage blue
  left: { bg: "#e5e5ea", text: "#000000" }, // iMessage gray
};

/**
 * Chat bubble message component with typing animation.
 *
 * @example
 * // Basic message
 * <BubbleMessage align="right">
 *   Hello! How are you?
 * </BubbleMessage>
 *
 * @example
 * // With typing indicator
 * <BubbleMessage
 *   align="left"
 *   showTyping
 *   typingDuration={1}
 *   delay={0.5}
 * >
 *   I'm doing great, thanks!
 * </BubbleMessage>
 *
 * @example
 * // With avatar and sender
 * <BubbleMessage
 *   align="left"
 *   avatar={<img src={avatar} />}
 *   senderName="John"
 *   timestamp="12:34 PM"
 * >
 *   Message with metadata
 * </BubbleMessage>
 */
export const BubbleMessage: React.FC<BubbleMessageProps> = ({
  children,
  align = "left",
  bubbleStyle = "ios",
  backgroundColor,
  textColor,
  showTyping = false,
  typingDuration = 1,
  duration: durationProp = 0.3,
  delay = 0,
  ease = "bouncy",
  showTail = true,
  avatar,
  senderName,
  timestamp,
  maxWidth = 280,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const duration = getDuration(durationProp);
  const delayFrames = Math.round(delay * fps);
  const typingFrames = Math.round(typingDuration * fps);
  const messageDelayFrames = showTyping ? delayFrames + typingFrames : delayFrames;
  const durationFrames = Math.round(duration * fps);
  const easing = getRemotionEasing(ease);

  // Colors - use glossy styles when glossy preset is selected
  const isGlossy = bubbleStyle === "glossy";
  const bgColor = backgroundColor ?? (isGlossy ? glossyStyles[align].bg : defaultColors[align].bg);
  const txtColor = textColor ?? (isGlossy ? glossyStyles[align].text : defaultColors[align].text);

  // Style preset
  const preset = stylePresets[bubbleStyle];

  // Typing indicator animation
  const typingProgress = useMemo(() => {
    if (!showTyping) return 0;

    const effectiveFrame = frame - delayFrames;
    if (effectiveFrame < 0) return 0;
    if (effectiveFrame >= typingFrames) return 0;

    return 1; // Show typing
  }, [showTyping, frame, delayFrames, typingFrames]);

  // Message animation
  const messageProgress = useMemo(() => {
    const effectiveFrame = frame - messageDelayFrames;
    if (effectiveFrame <= 0) return 0;
    if (effectiveFrame >= durationFrames) return 1;

    return interpolate(effectiveFrame, [0, durationFrames], [0, 1], {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }, [frame, messageDelayFrames, durationFrames, easing]);

  // Typing dots animation
  const typingDots = useMemo(() => {
    if (typingProgress === 0) return null;

    const dotTime = (frame - delayFrames) / fps;

    return (
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: preset.padding,
          background: bgColor,
          borderRadius: preset.borderRadius,
          opacity: typingProgress,
          position: "relative" as const,
          overflow: "hidden" as const,
          boxShadow: isGlossy ? "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)" : undefined,
        }}
      >
        {[0, 1, 2].map((i) => {
          const dotProgress = Math.sin((dotTime * 4 + i * 0.5) * Math.PI);
          return (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: txtColor,
                opacity: 0.4 + dotProgress * 0.4,
                transform: `translateY(${-dotProgress * 3}px)`,
              }}
            />
          );
        })}
      </div>
    );
  }, [typingProgress, frame, delayFrames, fps, bgColor, txtColor, preset]);

  // Bubble tail for iOS style - rendered separately to avoid overflow issues
  const tailColor = useMemo(() => {
    if (!showTail || bubbleStyle !== "ios") return null;
    // For glossy, use solid color that matches the gradient bottom
    return isGlossy 
      ? (align === "right" ? "#007AFF" : "#d8d8e0")
      : (backgroundColor ?? defaultColors[align].bg);
  }, [showTail, bubbleStyle, align, backgroundColor, isGlossy]);

  // Container alignment
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: align === "right" ? "row-reverse" : "row",
    alignItems: "flex-end",
    gap: 8,
    ...style,
  };

  // Bubble animation styles
  const bubbleAnimStyle: CSSProperties = {
    opacity: messageProgress,
    transform: `scale(${0.8 + messageProgress * 0.2}) translateY(${(1 - messageProgress) * 10}px)`,
    transformOrigin: align === "right" ? "bottom right" : "bottom left",
  };

  const bubbleBaseStyle: CSSProperties = {
    position: "relative",
    maxWidth,
    padding: preset.padding,
    background: bgColor,
    color: txtColor,
    borderRadius: preset.borderRadius,
    fontSize: 16,
    lineHeight: 1.4,
    fontFamily: "system-ui, -apple-system, sans-serif",
    wordBreak: "break-word",
    // Glossy-specific styles
    ...(isGlossy && {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      overflow: "hidden" as const,
    }),
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Avatar */}
      {avatar && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {avatar}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Sender name */}
        {senderName && messageProgress > 0 && (
          <div
            style={{
              fontSize: 12,
              color: "#888",
              marginLeft: align === "left" ? 4 : 0,
              marginRight: align === "right" ? 4 : 0,
              textAlign: align,
              opacity: messageProgress,
            }}
          >
            {senderName}
          </div>
        )}

        {/* Typing indicator */}
        {typingProgress > 0 && typingDots}

        {/* Message bubble */}
        {messageProgress > 0 && (
          <div style={bubbleAnimStyle}>
            <div style={{ position: "relative" }}>
              {/* Main bubble */}
              <div style={bubbleBaseStyle}>
                {/* Glossy highlight overlay */}
                {isGlossy && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: glossyStyles[align].highlight,
                      borderRadius: `${preset.borderRadius} ${preset.borderRadius} 0 0`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
              </div>
              {/* Tail - rendered outside bubble to avoid overflow clipping */}
              {tailColor && align === "right" && (
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: -8,
                  }}
                >
                  <path
                    d="M0 16 C0 16 0 0 12 0 L12 16 Z"
                    fill={tailColor}
                  />
                </svg>
              )}
              {tailColor && align === "left" && (
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -8,
                  }}
                >
                  <path
                    d="M12 16 C12 16 12 0 0 0 L0 16 Z"
                    fill={tailColor}
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && messageProgress >= 1 && (
          <div
            style={{
              fontSize: 11,
              color: "#888",
              marginLeft: align === "left" ? 4 : 0,
              marginRight: align === "right" ? 4 : 0,
              textAlign: align,
            }}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Props for ChatConversation component.
 */
export interface ChatConversationProps {
  children: ReactNode;
  /** Gap between messages */
  gap?: number;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Container for multiple chat bubbles.
 *
 * @example
 * <ChatConversation>
 *   <BubbleMessage align="right" delay={0}>Hi there!</BubbleMessage>
 *   <BubbleMessage align="left" delay={0.5}>Hello!</BubbleMessage>
 *   <BubbleMessage align="right" delay={1}>How are you?</BubbleMessage>
 * </ChatConversation>
 */
export const ChatConversation: React.FC<ChatConversationProps> = ({
  children,
  gap = 8,
  style,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default BubbleMessage;
