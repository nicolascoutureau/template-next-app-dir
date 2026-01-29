import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

// Memoji expressions using real emoji characters
export type MemojiExpression =
  | "happy"
  | "wink"
  | "cool"
  | "thinking"
  | "surprised"
  | "love"
  | "laugh"
  | "sad"
  | "angry"
  | "sleepy"
  | "nerd"
  | "party"
  | "mindblown"
  | "worried"
  | "smirk"
  | "kiss"
  | "tongue"
  | "hug"
  | "shush"
  | "monocle";

// Animation types
export type MemojiAnimation =
  | "none"
  | "bounce"
  | "wave"
  | "pulse"
  | "nod"
  | "shake"
  | "float"
  | "spin"
  | "wiggle";

export interface MemojiProps {
  /** Expression/emotion to display */
  expression?: MemojiExpression;
  /** Custom emoji character (overrides expression) */
  emoji?: string;
  /** Animation type */
  animation?: MemojiAnimation;
  /** Size in pixels */
  size?: number;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Background color/gradient */
  backgroundColor?: string;
  /** Show circular background */
  showBackground?: boolean;
}

// Map expressions to emoji characters
const expressionEmojis: Record<MemojiExpression, string> = {
  happy: "😊",
  wink: "😉",
  cool: "😎",
  thinking: "🤔",
  surprised: "😮",
  love: "😍",
  laugh: "😂",
  sad: "😢",
  angry: "😠",
  sleepy: "😴",
  nerd: "🤓",
  party: "🥳",
  mindblown: "🤯",
  worried: "😰",
  smirk: "😏",
  kiss: "😘",
  tongue: "😜",
  hug: "🤗",
  shush: "🤫",
  monocle: "🧐",
};

export const Memoji: React.FC<MemojiProps> = ({
  expression = "happy",
  emoji,
  animation = "none",
  size = 80,
  delay = 0,
  style,
  backgroundColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  showBackground = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = delay * fps;
  const animFrame = Math.max(0, frame - delayFrames);

  // Animation calculations
  let translateY = 0;
  let translateX = 0;
  let rotate = 0;
  let scale = 1;

  switch (animation) {
    case "bounce":
      translateY = Math.sin((animFrame / fps) * Math.PI * 3) * 8;
      break;
    case "wave":
      rotate = Math.sin((animFrame / fps) * Math.PI * 2) * 15;
      break;
    case "pulse":
      scale = 1 + Math.sin((animFrame / fps) * Math.PI * 2) * 0.1;
      break;
    case "nod":
      rotate = Math.sin((animFrame / fps) * Math.PI * 1.5) * 10;
      break;
    case "shake":
      translateX = Math.sin((animFrame / fps) * Math.PI * 8) * 5;
      break;
    case "float":
      translateY = Math.sin((animFrame / fps) * Math.PI * 1) * 8;
      scale = 1 + Math.sin((animFrame / fps) * Math.PI * 0.8) * 0.05;
      break;
    case "spin":
      rotate = (animFrame / fps) * 180;
      break;
    case "wiggle":
      rotate = Math.sin((animFrame / fps) * Math.PI * 6) * 8;
      translateX = Math.sin((animFrame / fps) * Math.PI * 4) * 3;
      break;
  }

  // Entrance animation
  const entranceOpacity = interpolate(animFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entranceScale = interpolate(animFrame, [0, 15], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)),
  });

  const displayEmoji = emoji || expressionEmojis[expression];

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        opacity: entranceOpacity,
        transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale * entranceScale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {/* Background circle */}
      {showBackground && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: backgroundColor,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        />
      )}

      {/* Emoji */}
      <span
        style={{
          fontSize: showBackground ? size * 0.55 : size,
          lineHeight: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {displayEmoji}
      </span>
    </div>
  );
};

// Preset components for common use cases
export const HappyMemoji: React.FC<Omit<MemojiProps, "expression">> = (props) => (
  <Memoji expression="happy" {...props} />
);

export const CoolMemoji: React.FC<Omit<MemojiProps, "expression">> = (props) => (
  <Memoji expression="cool" {...props} />
);

export const LoveMemoji: React.FC<Omit<MemojiProps, "expression">> = (props) => (
  <Memoji expression="love" animation="pulse" {...props} />
);

export const ThinkingMemoji: React.FC<Omit<MemojiProps, "expression">> = (props) => (
  <Memoji expression="thinking" animation="nod" {...props} />
);

export const WaveMemoji: React.FC<Omit<MemojiProps, "expression">> = (props) => (
  <Memoji expression="happy" animation="wave" {...props} />
);

// Avatar group component
export interface MemojiGroupProps {
  /** Number of memojis to display */
  count?: number;
  /** Size of each memoji */
  size?: number;
  /** Overlap ratio (0-1) */
  overlap?: number;
  /** Array of expressions to cycle through */
  expressions?: MemojiExpression[];
  /** Array of background colors to cycle through */
  backgroundColors?: string[];
  /** Delay between each memoji appearing */
  staggerDelay?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

export const MemojiGroup: React.FC<MemojiGroupProps> = ({
  count = 3,
  size = 60,
  overlap = 0.3,
  expressions = ["happy", "cool", "wink", "love", "party"],
  backgroundColors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ],
  staggerDelay = 0.1,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -size * overlap,
            zIndex: count - i,
          }}
        >
          <Memoji
            expression={expressions[i % expressions.length]}
            size={size}
            delay={i * staggerDelay}
            backgroundColor={backgroundColors[i % backgroundColors.length]}
          />
        </div>
      ))}
    </div>
  );
};

// Reaction component - memoji with a label
export interface MemojiReactionProps extends MemojiProps {
  label?: string;
  labelPosition?: "top" | "bottom";
}

export const MemojiReaction: React.FC<MemojiReactionProps> = ({
  label,
  labelPosition = "bottom",
  size = 80,
  ...props
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = (props.delay || 0) * fps;

  const labelOpacity = interpolate(frame - delayFrames, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {labelPosition === "top" && label && (
        <div
          style={{
            fontSize: size * 0.15,
            fontWeight: 600,
            color: "white",
            opacity: labelOpacity,
          }}
        >
          {label}
        </div>
      )}
      <Memoji size={size} {...props} />
      {labelPosition === "bottom" && label && (
        <div
          style={{
            fontSize: size * 0.15,
            fontWeight: 600,
            color: "white",
            opacity: labelOpacity,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
