import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  Memoji,
  HappyMemoji,
  CoolMemoji,
  LoveMemoji,
  ThinkingMemoji,
  WaveMemoji,
  MemojiGroup,
  MemojiReaction,
  type MemojiExpression,
  type MemojiAnimation,
} from "../../remotion/base/components/ui";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Memoji> = {
  title: "UI/Memoji",
  component: Memoji,
  argTypes: {
    expression: {
      control: "select",
      options: [
        "happy", "wink", "cool", "thinking", "surprised", "love", "laugh",
        "sad", "angry", "sleepy", "nerd", "party", "mindblown", "worried",
        "smirk", "kiss", "tongue", "hug", "shush", "monocle",
      ],
    },
    animation: {
      control: "select",
      options: ["none", "bounce", "wave", "pulse", "nod", "shake", "float", "spin", "wiggle"],
    },
    size: { control: { type: "range", min: 40, max: 200, step: 10 } },
    delay: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    backgroundColor: { control: "color" },
    showBackground: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Memoji>;

// Default story
export const Default: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Story />
        </AbsoluteFill>
      </RemotionWrapper>
    ),
  ],
  args: {
    expression: "happy",
    animation: "bounce",
    size: 120,
    showBackground: true,
  },
};

// All expressions
export const AllExpressions: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const expressions: MemojiExpression[] = [
      "happy", "wink", "cool", "thinking", "surprised",
      "love", "laugh", "sad", "angry", "sleepy",
      "nerd", "party", "mindblown", "worried", "smirk",
      "kiss", "tongue", "hug", "shush", "monocle",
    ];

    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    ];

    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 30,
        }}
      >
        {expressions.map((expr, i) => (
          <div key={expr} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Memoji
              expression={expr}
              size={70}
              delay={i * 0.05}
              animation="float"
              backgroundColor={colors[i % colors.length]}
            />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>{expr}</span>
          </div>
        ))}
      </AbsoluteFill>
    );
  },
};

// Without background
export const WithoutBackground: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const expressions: MemojiExpression[] = ["happy", "cool", "love", "party", "thinking"];

    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {expressions.map((expr, i) => (
          <Memoji
            key={expr}
            expression={expr}
            size={80}
            delay={i * 0.1}
            animation="bounce"
            showBackground={false}
          />
        ))}
      </AbsoluteFill>
    );
  },
};

// All animations
export const AllAnimations: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const animations: MemojiAnimation[] = ["none", "bounce", "wave", "pulse", "nod", "shake", "float", "spin", "wiggle"];

    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: 40,
        }}
      >
        {animations.map((anim, i) => (
          <div key={anim} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Memoji animation={anim} size={70} delay={i * 0.1} expression="happy" />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{anim}</span>
          </div>
        ))}
      </AbsoluteFill>
    );
  },
};

// Preset components
export const PresetComponents: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <HappyMemoji size={100} delay={0} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>HappyMemoji</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <CoolMemoji size={100} delay={0.1} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>CoolMemoji</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <LoveMemoji size={100} delay={0.2} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>LoveMemoji</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <ThinkingMemoji size={100} delay={0.3} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>ThinkingMemoji</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <WaveMemoji size={100} delay={0.4} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>WaveMemoji</span>
      </div>
    </AbsoluteFill>
  ),
};

// Memoji Group
export const GroupDemo: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <MemojiGroup count={5} size={70} overlap={0.35} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>+2,500 happy users</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <MemojiGroup count={3} size={50} overlap={0.25} expressions={["love", "happy", "wink"]} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Loved by teams</span>
      </div>
    </AbsoluteFill>
  ),
};

// Reactions
export const Reactions: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
      }}
    >
      <MemojiReaction expression="love" label="Love it!" size={90} delay={0} animation="pulse" />
      <MemojiReaction expression="laugh" label="LOL" size={90} delay={0.15} animation="bounce" />
      <MemojiReaction expression="surprised" label="Wow!" size={90} delay={0.3} animation="float" />
      <MemojiReaction expression="cool" label="Nice" size={90} delay={0.45} />
      <MemojiReaction expression="thinking" label="Hmm..." size={90} delay={0.6} animation="nod" />
    </AbsoluteFill>
  ),
};

// Testimonial use case
export const TestimonialUseCase: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 24,
          padding: 40,
          maxWidth: 500,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Memoji expression="happy" size={60} animation="float" backgroundColor="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" />
          <div>
            <div style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Sarah Johnson</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Product Designer</div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.6 }}>
          "This tool has completely transformed our workflow. We've cut our design time in half!"
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          {["⭐", "⭐", "⭐", "⭐", "⭐"].map((star, i) => (
            <span key={i} style={{ fontSize: 18 }}>{star}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  ),
};

// Custom emoji
export const CustomEmoji: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const emojis = ["🚀", "🎉", "💡", "🔥", "✨", "🌟", "💎", "🎯"];

    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 40,
        }}
      >
        {emojis.map((emoji, i) => (
          <Memoji
            key={emoji}
            emoji={emoji}
            size={70}
            delay={i * 0.1}
            animation="bounce"
            backgroundColor={`hsl(${i * 45}, 70%, 60%)`}
          />
        ))}
      </AbsoluteFill>
    );
  },
};

// Chat scene
export const ChatScene: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0f172a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 400 }}>
        {/* Message 1 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <Memoji expression="happy" size={40} delay={0} backgroundColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px 16px 16px 4px",
              padding: "12px 16px",
              color: "white",
              fontSize: 14,
              maxWidth: 280,
            }}
          >
            Hey! Did you see the new design?
          </div>
        </div>

        {/* Message 2 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#6366f1",
              borderRadius: "16px 16px 4px 16px",
              padding: "12px 16px",
              color: "white",
              fontSize: 14,
              maxWidth: 280,
            }}
          >
            Yes! It looks amazing! 🎉
          </div>
          <Memoji expression="love" size={40} delay={0.3} backgroundColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
        </div>

        {/* Message 3 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <Memoji expression="cool" size={40} delay={0.6} backgroundColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px 16px 16px 4px",
              padding: "12px 16px",
              color: "white",
              fontSize: 14,
              maxWidth: 280,
            }}
          >
            Let's ship it today! 🚀
          </div>
        </div>
      </div>
    </AbsoluteFill>
  ),
};
