import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { ScaleIn } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof ScaleIn> = {
  title: "Animations/ScaleIn",
  component: ScaleIn,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#0f0c29">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    from: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description: "Starting scale",
    },
    to: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description: "Ending scale",
    },
    origin: {
      control: "select",
      options: [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
      description: "Transform origin",
    },
    duration: {
      control: { type: "range", min: 0.1, max: 2, step: 0.1 },
      description: "Animation duration in seconds",
    },
    delay: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Delay before animation starts",
    },
    ease: {
      control: "select",
      options: ["smooth", "bouncy", "snappy", "gentle", "elastic"],
      description: "Easing preset",
    },
    fade: {
      control: "boolean",
      description: "Also fade in during scale",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ScaleIn>;

const Logo = () => (
  <div
    style={{
      width: "120px",
      height: "120px",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderRadius: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "48px",
      fontWeight: 700,
      boxShadow: "0 10px 40px rgba(240, 147, 251, 0.4)",
    }}
  >
    M
  </div>
);

// ============================================
// BASIC EXAMPLES
// ============================================

export const Default: Story = {
  args: {
    from: 0,
    to: 1,
    duration: 0.5,
    ease: "bouncy",
  },
  render: (args) => (
    <ScaleIn {...args}>
      <Logo />
    </ScaleIn>
  ),
};

export const WithSpring: Story = {
  args: {
    from: 0,
    spring: "bouncy",
    fade: true,
  },
  render: (args) => (
    <ScaleIn {...args}>
      <Logo />
    </ScaleIn>
  ),
};

export const SubtleScale: Story = {
  args: {
    from: 0.8,
    to: 1,
    duration: 0.4,
    fade: true,
    ease: "smooth",
  },
  render: (args) => (
    <ScaleIn {...args}>
      <Logo />
    </ScaleIn>
  ),
};

export const FromCorner: Story = {
  args: {
    from: 0,
    origin: "top-left",
    spring: "snappy",
  },
  render: (args) => (
    <ScaleIn {...args}>
      <Logo />
    </ScaleIn>
  ),
};

export const Elastic: Story = {
  args: {
    from: 0,
    spring: "wobbly",
    fade: true,
  },
  render: (args) => (
    <ScaleIn {...args}>
      <Logo />
    </ScaleIn>
  ),
};

// ============================================
// PROFESSIONAL COMPOSITIONS
// ============================================

export const LogoReveal: Story = {
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {/* Logo mark */}
      <ScaleIn from={0} duration={0.6} spring="bouncy" fade>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 40,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 60px rgba(99, 102, 241, 0.4)",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 800, color: "#fff" }}>A</div>
        </div>
      </ScaleIn>
      {/* Company name */}
      <ScaleIn from={0.8} duration={0.5} delay={0.25} fade>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -1,
          }}
        >
          Acme Inc.
        </div>
      </ScaleIn>
      {/* Tagline */}
      <ScaleIn from={0.9} duration={0.4} delay={0.4} fade>
        <div
          style={{
            fontSize: 16,
            color: "#71717a",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Design Beyond Limits
        </div>
      </ScaleIn>
    </AbsoluteFill>
  ),
};

export const AppIconGrid: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#1e1b4b">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const apps = [
      { icon: "📸", bg: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)" },
      { icon: "🎵", bg: "linear-gradient(135deg, #34d399 0%, #10b981 100%)" },
      { icon: "📱", bg: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)" },
      { icon: "🎮", bg: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)" },
      { icon: "💬", bg: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" },
      { icon: "📧", bg: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)" },
      { icon: "🔒", bg: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)" },
      { icon: "⚡", bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" },
      { icon: "🎨", bg: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {apps.map((app, i) => (
            <ScaleIn
              key={i}
              from={0}
              duration={0.4}
              delay={i * 0.06}
              spring="bouncy"
              fade
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 22,
                  background: app.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                {app.icon}
              </div>
            </ScaleIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

export const BadgeCollection: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0f172a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const badges = [
      { text: "React", bg: "#61dafb", color: "#000" },
      { text: "TypeScript", bg: "#3178c6", color: "#fff" },
      { text: "Remotion", bg: "#6366f1", color: "#fff" },
      { text: "GSAP", bg: "#88ce02", color: "#000" },
      { text: "Motion", bg: "#ff0080", color: "#fff" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <ScaleIn from={0.8} duration={0.5} fade>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>Built With</div>
        </ScaleIn>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 500 }}>
          {badges.map((badge, i) => (
            <ScaleIn key={i} from={0} duration={0.4} delay={0.15 + i * 0.08} spring="bouncy" fade>
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: 100,
                  background: badge.bg,
                  color: badge.color,
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: `0 8px 20px ${badge.bg}40`,
                }}
              >
                {badge.text}
              </div>
            </ScaleIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

export const ProfileCard: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#fafafa">
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
      }}
    >
      <ScaleIn from={0.9} duration={0.6} fade>
        <div
          style={{
            width: 360,
            background: "#fff",
            borderRadius: 28,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <ScaleIn from={0} duration={0.5} delay={0.2} spring="bouncy" fade>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                boxShadow: "0 15px 40px rgba(99, 102, 241, 0.3)",
              }}
            >
              👩‍💻
            </div>
          </ScaleIn>
          <ScaleIn from={0.9} duration={0.4} delay={0.35} fade>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>Sarah Chen</div>
              <div style={{ fontSize: 14, color: "#64748b" }}>Senior Motion Designer</div>
            </div>
          </ScaleIn>
          <ScaleIn from={0.9} duration={0.4} delay={0.45} fade>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "Projects", value: "248" },
                { label: "Following", value: "1.2K" },
                { label: "Followers", value: "12K" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </ScaleIn>
          <ScaleIn from={0.9} duration={0.4} delay={0.55} fade>
            <div
              style={{
                width: "100%",
                padding: "14px 0",
                background: "#0f172a",
                color: "#fff",
                borderRadius: 14,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              Follow
            </div>
          </ScaleIn>
        </div>
      </ScaleIn>
    </AbsoluteFill>
  ),
};

export const PopupModal: Story = {
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
      }}
    >
      {/* Backdrop */}
      <ScaleIn from={1} to={1} duration={0.3} fade>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)" }} />
      </ScaleIn>
      {/* Modal */}
      <ScaleIn from={0.9} duration={0.4} delay={0.1} spring="snappy" fade>
        <div
          style={{
            width: 420,
            background: "#18181b",
            borderRadius: 24,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            border: "1px solid #27272a",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          <ScaleIn from={0} duration={0.3} delay={0.25} spring="bouncy">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                alignSelf: "center",
              }}
            >
              ✓
            </div>
          </ScaleIn>
          <ScaleIn from={0.95} duration={0.3} delay={0.35} fade>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                Payment Successful!
              </div>
              <div style={{ fontSize: 15, color: "#71717a", lineHeight: 1.5 }}>
                Your order has been confirmed. You'll receive a confirmation email shortly.
              </div>
            </div>
          </ScaleIn>
          <ScaleIn from={0.95} duration={0.3} delay={0.45} fade>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid #3f3f46",
                  borderRadius: 12,
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                View Order
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#10b981",
                  color: "#fff",
                  borderRadius: 12,
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Continue
              </div>
            </div>
          </ScaleIn>
        </div>
      </ScaleIn>
    </AbsoluteFill>
  ),
};
