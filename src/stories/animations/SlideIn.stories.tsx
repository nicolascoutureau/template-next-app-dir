import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { SlideIn } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof SlideIn> = {
  title: "Animations/SlideIn",
  component: SlideIn,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    direction: { control: "select", options: ["left", "right", "up", "down"] },
    distance: { control: { type: "range", min: 20, max: 200, step: 10 } },
    duration: { control: { type: "range", min: 0.2, max: 2, step: 0.1 } },
    delay: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    fade: { control: "boolean" },
    ease: { control: "select", options: ["smooth", "bouncy", "snappy", "appleSwift"] },
  },
};

export default meta;
type Story = StoryObj<typeof SlideIn>;

const Card = () => (
  <div
    style={{
      padding: "40px 60px",
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      borderRadius: 16,
      color: "white",
      fontSize: 24,
      fontWeight: 600,
      fontFamily: "Inter, system-ui",
      boxShadow: "0 10px 40px rgba(34, 197, 94, 0.4)",
    }}
  >
    Slide Animation
  </div>
);

// ============================================
// BASIC EXAMPLES
// ============================================

export const FromLeft: Story = {
  args: {
    direction: "left",
    distance: 100,
    duration: 0.5,
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const FromRight: Story = {
  args: {
    direction: "right",
    distance: 100,
    duration: 0.5,
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const FromTop: Story = {
  args: {
    direction: "up",
    distance: 80,
    duration: 0.5,
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const FromBottom: Story = {
  args: {
    direction: "down",
    distance: 80,
    duration: 0.5,
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const WithFade: Story = {
  args: {
    direction: "left",
    distance: 100,
    duration: 0.6,
    fade: true,
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const BouncySlide: Story = {
  args: {
    direction: "up",
    distance: 60,
    spring: "bouncy",
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

export const LongDistance: Story = {
  args: {
    direction: "left",
    distance: 200,
    duration: 0.8,
    ease: "smooth",
  },
  render: (args) => (
    <SlideIn {...args}>
      <Card />
    </SlideIn>
  ),
};

// ============================================
// PROFESSIONAL COMPOSITIONS
// ============================================

export const SplitReveal: Story = {
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
      <div style={{ display: "flex", gap: 8 }}>
        {/* Left panels */}
        <SlideIn direction="left" distance={200} duration={0.6} fade>
          <div
            style={{
              width: 200,
              height: 300,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
            }}
          />
        </SlideIn>
        {/* Center */}
        <SlideIn direction="down" distance={150} duration={0.7} delay={0.15} fade>
          <div
            style={{
              width: 200,
              height: 300,
              borderRadius: 16,
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)",
            }}
          />
        </SlideIn>
        {/* Right */}
        <SlideIn direction="right" distance={200} duration={0.6} delay={0.1} fade>
          <div
            style={{
              width: 200,
              height: 300,
              borderRadius: 16,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
            }}
          />
        </SlideIn>
      </div>
    </AbsoluteFill>
  ),
};

export const AppDashboard: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill style={{ padding: 40 }}>
      <div style={{ display: "flex", gap: 24, height: "100%" }}>
        {/* Sidebar */}
        <SlideIn direction="left" distance={100} duration={0.5} fade>
          <div
            style={{
              width: 240,
              height: "100%",
              background: "#0f172a",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Dashboard</div>
            {["🏠 Home", "📊 Analytics", "📁 Projects", "⚙️ Settings"].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: i === 0 ? "rgba(99, 102, 241, 0.2)" : "transparent",
                  color: i === 0 ? "#818cf8" : "#64748b",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </SlideIn>
        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header */}
          <SlideIn direction="down" distance={40} duration={0.4} delay={0.2} fade>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>Welcome back!</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>Here's what's happening today</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #ec4899)" }} />
            </div>
          </SlideIn>
          {/* Stats */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Revenue", value: "$12,450", change: "+12%", color: "#10b981" },
              { label: "Users", value: "2,340", change: "+8%", color: "#6366f1" },
              { label: "Orders", value: "1,245", change: "+23%", color: "#f59e0b" },
            ].map((stat, i) => (
              <SlideIn key={i} direction="up" distance={50} duration={0.5} delay={0.3 + i * 0.1} fade>
                <div
                  style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: stat.color, fontWeight: 600 }}>{stat.change}</div>
                </div>
              </SlideIn>
            ))}
          </div>
          {/* Chart placeholder */}
          <SlideIn direction="up" distance={60} duration={0.6} delay={0.6} fade>
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
              }}
            >
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: `linear-gradient(180deg, #6366f1 0%, #818cf8 100%)`,
                    borderRadius: 8,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </SlideIn>
        </div>
      </div>
    </AbsoluteFill>
  ),
};

export const MobileAppReveal: Story = {
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
        gap: 80,
      }}
    >
      {/* Phone mockup */}
      <SlideIn direction="left" distance={80} duration={0.7} fade>
        <div
          style={{
            width: 280,
            height: 560,
            borderRadius: 44,
            background: "#18181b",
            padding: 12,
            boxShadow: "0 50px 100px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 36,
              background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Status bar */}
            <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#fff" }}>
              <span>9:41</span>
              <span>📶 🔋</span>
            </div>
            {/* Content */}
            <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>Good morning ☀️</div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 13, color: "#a5b4fc", marginBottom: 8 }}>Today's Stats</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>8,450</div>
                <div style={{ fontSize: 13, color: "#34d399" }}>+24% from yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </SlideIn>
      {/* Text content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
        <SlideIn direction="right" distance={60} duration={0.5} delay={0.2} fade>
          <div style={{ fontSize: 14, color: "#6366f1", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            Mobile App
          </div>
        </SlideIn>
        <SlideIn direction="right" distance={60} duration={0.6} delay={0.3} fade>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            Track Your
            <br />Progress
          </div>
        </SlideIn>
        <SlideIn direction="right" distance={50} duration={0.5} delay={0.4} fade>
          <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6 }}>
            Get real-time insights and analytics right at your fingertips.
          </div>
        </SlideIn>
        <SlideIn direction="right" distance={40} duration={0.5} delay={0.5} fade>
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                padding: "14px 24px",
                background: "#fff",
                color: "#0f172a",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Download Now
            </div>
          </div>
        </SlideIn>
      </div>
    </AbsoluteFill>
  ),
};

export const TeamGrid: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const team = [
      { name: "Sarah Chen", role: "CEO", emoji: "👩‍💼" },
      { name: "Alex Kim", role: "CTO", emoji: "👨‍💻" },
      { name: "Maria Garcia", role: "Design Lead", emoji: "👩‍🎨" },
      { name: "James Wilson", role: "Engineering", emoji: "🧑‍🔧" },
      { name: "Emily Brown", role: "Marketing", emoji: "👩‍💻" },
      { name: "David Lee", role: "Product", emoji: "👨‍🔬" },
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
        <SlideIn direction="down" distance={40} duration={0.5} fade>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#6366f1", fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>OUR TEAM</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#fff" }}>Meet the Experts</div>
          </div>
        </SlideIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, width: "100%", maxWidth: 800 }}>
          {team.map((member, i) => (
            <SlideIn
              key={i}
              direction={i % 2 === 0 ? "left" : "right"}
              distance={80}
              duration={0.5}
              delay={0.15 + i * 0.08}
              fade
            >
              <div
                style={{
                  background: "#18181b",
                  borderRadius: 20,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  border: "1px solid #27272a",
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                  }}
                >
                  {member.emoji}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: "#71717a" }}>{member.role}</div>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};
