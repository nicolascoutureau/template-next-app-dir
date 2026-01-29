import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof FadeIn> = {
  title: "Animations/FadeIn",
  component: FadeIn,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    direction: {
      control: "select",
      options: ["none", "up", "down", "left", "right"],
      description: "Direction to fade from (adds movement)",
    },
    distance: {
      control: { type: "range", min: 0, max: 100, step: 5 },
      description: "Distance to travel in pixels",
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
      options: [
        "smooth",
        "bouncy",
        "snappy",
        "gentle",
        "appleSwift",
        "elastic",
      ],
      description: "Easing preset",
    },
    blur: {
      control: "boolean",
      description: "Add blur during fade",
    },
    blurAmount: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "Maximum blur amount in pixels",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

const SampleContent = () => (
  <div
    style={{
      padding: "40px 60px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "16px",
      color: "white",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "24px",
      fontWeight: 600,
      boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
    }}
  >
    Hello, Motion!
  </div>
);

// ============================================
// BASIC EXAMPLES
// ============================================

export const Default: Story = {
  args: {
    duration: 0.5,
    ease: "smooth",
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

export const FadeUp: Story = {
  args: {
    direction: "up",
    distance: 30,
    duration: 0.6,
    ease: "smooth",
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

export const WithSpring: Story = {
  args: {
    direction: "up",
    distance: 40,
    spring: "bouncy",
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

export const WithBlur: Story = {
  args: {
    duration: 0.8,
    blur: true,
    blurAmount: 10,
    direction: "up",
    distance: 20,
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

export const FromLeft: Story = {
  args: {
    direction: "left",
    distance: 50,
    duration: 0.5,
    ease: "appleSwift",
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

export const WithDelay: Story = {
  args: {
    direction: "up",
    distance: 30,
    duration: 0.5,
    delay: 0.5,
    ease: "bouncy",
  },
  render: (args) => (
    <FadeIn {...args}>
      <SampleContent />
    </FadeIn>
  ),
};

// ============================================
// PROFESSIONAL COMPOSITIONS
// ============================================

export const HeroReveal: Story = {
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
        gap: 24,
        padding: 60,
      }}
    >
      {/* Badge */}
      <FadeIn direction="down" distance={20} duration={0.5} delay={0}>
        <div
          style={{
            padding: "8px 20px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Now Available
        </div>
      </FadeIn>
      {/* Main Title */}
      <FadeIn direction="up" distance={40} duration={0.7} delay={0.15} blur blurAmount={8}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          Motion Design
          <br />
          <span style={{ background: "linear-gradient(90deg, #6366f1, #ec4899)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Reimagined
          </span>
        </div>
      </FadeIn>
      {/* Subtitle */}
      <FadeIn direction="up" distance={30} duration={0.6} delay={0.35}>
        <div
          style={{
            fontSize: 20,
            color: "#71717a",
            textAlign: "center",
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          Create stunning animations with our professional-grade primitives library
        </div>
      </FadeIn>
      {/* CTA Buttons */}
      <FadeIn direction="up" distance={30} duration={0.5} delay={0.5}>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <div
            style={{
              padding: "16px 32px",
              background: "#fff",
              color: "#0a0a0f",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Get Started
          </div>
          <div
            style={{
              padding: "16px 32px",
              background: "transparent",
              color: "#fff",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              border: "1px solid #333",
            }}
          >
            View Docs
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  ),
};

export const FeatureCards: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#fafafa">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const features = [
      { icon: "⚡", title: "Lightning Fast", desc: "60fps animations", color: "#fbbf24" },
      { icon: "🎨", title: "Customizable", desc: "Full control over timing", color: "#ec4899" },
      { icon: "🧩", title: "Composable", desc: "Mix and match effects", color: "#6366f1" },
      { icon: "📦", title: "Production Ready", desc: "Battle-tested components", color: "#10b981" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: 60,
        }}
      >
        <FadeIn direction="up" distance={30} duration={0.6}>
          <div style={{ fontSize: 14, color: "#6366f1", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            Features
          </div>
        </FadeIn>
        <FadeIn direction="up" distance={40} duration={0.7} delay={0.1}>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#1a1a1a", textAlign: "center" }}>
            Why Choose Us
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, width: "100%", maxWidth: 900 }}>
          {features.map((f, i) => (
            <FadeIn key={i} direction="up" distance={40} duration={0.5} delay={0.2 + i * 0.1}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 28,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: `${f.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {f.icon}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#71717a" }}>{f.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

export const TestimonialReveal: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0f172a">
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
        padding: 80,
      }}
    >
      <div
        style={{
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <FadeIn duration={0.5}>
          <div style={{ fontSize: 64, opacity: 0.3 }}>"</div>
        </FadeIn>
        <FadeIn direction="up" distance={30} duration={0.7} delay={0.1} blur blurAmount={6}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            This library completely transformed how we approach motion design. 
            The primitives are intuitive and the results are{" "}
            <span style={{ color: "#6366f1" }}>stunning</span>.
          </div>
        </FadeIn>
        <FadeIn direction="up" distance={20} duration={0.5} delay={0.4}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Alex Chen</div>
              <div style={{ fontSize: 14, color: "#64748b" }}>Senior Motion Designer at Acme</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  ),
};

export const ProductShowcase: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#fff">
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
          display: "flex",
          alignItems: "center",
          gap: 80,
          maxWidth: 1000,
        }}
      >
        {/* Left: Product Image */}
        <FadeIn direction="left" distance={60} duration={0.8} blur blurAmount={10}>
          <div
            style={{
              width: 400,
              height: 400,
              borderRadius: 40,
              background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 32,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
              }}
            />
          </div>
        </FadeIn>
        {/* Right: Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <FadeIn direction="right" distance={40} duration={0.6} delay={0.2}>
            <div style={{ fontSize: 14, color: "#6366f1", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              New Release
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={40} duration={0.6} delay={0.3}>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              The Ultimate
              <br />Motion Toolkit
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={30} duration={0.5} delay={0.4}>
            <div style={{ fontSize: 18, color: "#64748b", lineHeight: 1.6 }}>
              50+ animation primitives, infinite possibilities. Build beautiful, 
              performant animations with ease.
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={30} duration={0.5} delay={0.5}>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div
                style={{
                  padding: "14px 28px",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Buy Now — $99
              </div>
              <div
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "#0f172a",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  border: "2px solid #e2e8f0",
                }}
              >
                Learn More
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </AbsoluteFill>
  ),
};

export const PricingTable: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const plans = [
      { name: "Starter", price: "Free", features: ["5 animations", "Basic support", "Community access"], popular: false },
      { name: "Pro", price: "$29", features: ["50+ animations", "Priority support", "All templates", "Custom easings"], popular: true },
      { name: "Team", price: "$99", features: ["Unlimited", "Dedicated support", "Custom builds", "SLA"], popular: false },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: 60,
        }}
      >
        <FadeIn direction="up" distance={30} duration={0.6}>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#fff", textAlign: "center" }}>
            Simple, Transparent Pricing
          </div>
        </FadeIn>
        <div style={{ display: "flex", gap: 24 }}>
          {plans.map((plan, i) => (
            <FadeIn key={i} direction="up" distance={50} duration={0.6} delay={0.15 + i * 0.12}>
              <div
                style={{
                  width: 280,
                  padding: 32,
                  borderRadius: 24,
                  background: plan.popular ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#18181b",
                  border: plan.popular ? "none" : "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  transform: plan.popular ? "scale(1.05)" : "none",
                  boxShadow: plan.popular ? "0 20px 50px rgba(99, 102, 241, 0.3)" : "none",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      background: "#fff",
                      color: "#6366f1",
                      padding: "6px 16px",
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 700,
                      alignSelf: "flex-start",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 18, color: plan.popular ? "rgba(255,255,255,0.8)" : "#71717a", marginBottom: 8 }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>
                    {plan.price}
                    {plan.price !== "Free" && <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>/mo</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ fontSize: 14, color: plan.popular ? "rgba(255,255,255,0.9)" : "#a1a1aa", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: plan.popular ? "#fff" : "#6366f1" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    padding: "14px 24px",
                    background: plan.popular ? "#fff" : "transparent",
                    color: plan.popular ? "#6366f1" : "#fff",
                    border: plan.popular ? "none" : "1px solid #3f3f46",
                    borderRadius: 12,
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Get Started
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

export const NotificationStack: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const notifications = [
      { icon: "💬", title: "New message", desc: "Sarah sent you a message", time: "Just now", color: "#6366f1" },
      { icon: "🎉", title: "Goal achieved!", desc: "You reached 1000 followers", time: "2m ago", color: "#10b981" },
      { icon: "📦", title: "Order shipped", desc: "Your package is on the way", time: "5m ago", color: "#f59e0b" },
      { icon: "❤️", title: "New follower", desc: "@design_master started following you", time: "12m ago", color: "#ec4899" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 380 }}>
          {notifications.map((n, i) => (
            <FadeIn key={i} direction="right" distance={60} duration={0.5} delay={i * 0.15}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 16,
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${n.color}`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${n.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {n.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{n.desc}</div>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{n.time}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};
