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
        gap: 14,
        padding: 30,
      }}
    >
      {/* Badge */}
      <FadeIn direction="down" distance={15} duration={0.5} delay={0}>
        <div
          style={{
            padding: "5px 14px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: 100,
            fontSize: 9,
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
      <FadeIn direction="up" distance={25} duration={0.7} delay={0.15} blur blurAmount={6}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -1,
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
      <FadeIn direction="up" distance={20} duration={0.6} delay={0.35}>
        <div
          style={{
            fontSize: 12,
            color: "#71717a",
            textAlign: "center",
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          Create stunning animations with our professional-grade primitives
        </div>
      </FadeIn>
      {/* CTA Buttons */}
      <FadeIn direction="up" distance={20} duration={0.5} delay={0.5}>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <div
            style={{
              padding: "10px 20px",
              background: "#fff",
              color: "#0a0a0f",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Get Started
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#fff",
              borderRadius: 8,
              fontSize: 11,
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
      { icon: "⚡", title: "Fast", desc: "60fps", color: "#fbbf24" },
      { icon: "🎨", title: "Custom", desc: "Full control", color: "#ec4899" },
      { icon: "🧩", title: "Composable", desc: "Mix & match", color: "#6366f1" },
      { icon: "📦", title: "Production", desc: "Battle-tested", color: "#10b981" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 30,
        }}
      >
        <FadeIn direction="up" distance={20} duration={0.6}>
          <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            Features
          </div>
        </FadeIn>
        <FadeIn direction="up" distance={25} duration={0.7} delay={0.1}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", textAlign: "center" }}>
            Why Choose Us
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, width: "100%", maxWidth: 560 }}>
          {features.map((f, i) => (
            <FadeIn key={i} direction="up" distance={25} duration={0.5} delay={0.2 + i * 0.08}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: `${f.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {f.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{f.title}</div>
                <div style={{ fontSize: 10, color: "#71717a" }}>{f.desc}</div>
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
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <FadeIn duration={0.5}>
          <div style={{ fontSize: 36, opacity: 0.3 }}>"</div>
        </FadeIn>
        <FadeIn direction="up" distance={20} duration={0.7} delay={0.1} blur blurAmount={4}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            This library transformed how we approach motion design. 
            The results are{" "}
            <span style={{ color: "#6366f1" }}>stunning</span>.
          </div>
        </FadeIn>
        <FadeIn direction="up" distance={15} duration={0.5} delay={0.4}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Alex Chen</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>Motion Designer at Acme</div>
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
        padding: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Left: Product Image */}
        <FadeIn direction="left" distance={40} duration={0.8} blur blurAmount={10}>
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 24,
              background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                boxShadow: "0 12px 30px rgba(99, 102, 241, 0.4)",
              }}
            />
          </div>
        </FadeIn>
        {/* Right: Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
          <FadeIn direction="right" distance={30} duration={0.6} delay={0.2}>
            <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              New Release
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={30} duration={0.6} delay={0.3}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              The Ultimate
              <br />Motion Toolkit
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={20} duration={0.5} delay={0.4}>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              50+ animation primitives, infinite possibilities.
            </div>
          </FadeIn>
          <FadeIn direction="right" distance={20} duration={0.5} delay={0.5}>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <div
                style={{
                  padding: "8px 16px",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Buy Now — $99
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  color: "#0f172a",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
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
      { name: "Starter", price: "Free", features: ["5 anims", "Basic"], popular: false },
      { name: "Pro", price: "$29", features: ["50+ anims", "Priority", "Templates"], popular: true },
      { name: "Team", price: "$99", features: ["Unlimited", "Dedicated", "SLA"], popular: false },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 30,
        }}
      >
        <FadeIn direction="up" distance={20} duration={0.6}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", textAlign: "center" }}>
            Simple Pricing
          </div>
        </FadeIn>
        <div style={{ display: "flex", gap: 12 }}>
          {plans.map((plan, i) => (
            <FadeIn key={i} direction="up" distance={30} duration={0.6} delay={0.15 + i * 0.1}>
              <div
                style={{
                  width: 150,
                  padding: 16,
                  borderRadius: 14,
                  background: plan.popular ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#18181b",
                  border: plan.popular ? "none" : "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transform: plan.popular ? "scale(1.03)" : "none",
                  boxShadow: plan.popular ? "0 10px 30px rgba(99, 102, 241, 0.3)" : "none",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      background: "#fff",
                      color: "#6366f1",
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 8,
                      fontWeight: 700,
                      alignSelf: "flex-start",
                      textTransform: "uppercase",
                    }}
                  >
                    Popular
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 11, color: plan.popular ? "rgba(255,255,255,0.8)" : "#71717a", marginBottom: 4 }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>
                    {plan.price}
                    {plan.price !== "Free" && <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.6 }}>/mo</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ fontSize: 9, color: plan.popular ? "rgba(255,255,255,0.9)" : "#a1a1aa", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: plan.popular ? "#fff" : "#6366f1" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    padding: "8px 14px",
                    background: plan.popular ? "#fff" : "transparent",
                    color: plan.popular ? "#6366f1" : "#fff",
                    border: plan.popular ? "none" : "1px solid #3f3f46",
                    borderRadius: 8,
                    textAlign: "center",
                    fontSize: 10,
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
      { icon: "💬", title: "New message", desc: "Sarah sent you a message", color: "#6366f1" },
      { icon: "🎉", title: "Goal achieved!", desc: "You reached 1000 followers", color: "#10b981" },
      { icon: "📦", title: "Order shipped", desc: "Your package is on the way", color: "#f59e0b" },
    ];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
          {notifications.map((n, i) => (
            <FadeIn key={i} direction="right" distance={40} duration={0.5} delay={i * 0.12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderLeft: `3px solid ${n.color}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: `${n.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {n.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>{n.title}</div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>{n.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};
