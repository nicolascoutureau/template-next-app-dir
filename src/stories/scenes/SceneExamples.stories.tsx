import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

// Import components
import { TextAnimation } from "../../remotion/base/components/text/TextAnimation";
import { Counter } from "../../remotion/base/components/text/Counter";
import { BubbleMessage, ChatConversation } from "../../remotion/base/components/text/BubbleMessage";
import { PhoneMockup } from "../../remotion/base/components/mockups/PhoneMockup";
import { BrowserMockup } from "../../remotion/base/components/mockups/BrowserMockup";
import { Button, GlossyButton } from "../../remotion/base/components/ui/Button";
import { GlossyShape } from "../../remotion/base/components/effects/GlossyShape";
import { AmbianceBackground } from "../../remotion/base/components/effects/AmbianceBackground";
import { SoftGradient } from "../../remotion/base/components/effects/SoftGradient";
import { GridBackground } from "../../remotion/base/components/effects/GridBackground";
import { Cursor } from "../../remotion/base/components/ui/Cursor";

const meta: Meta = {
  title: "Scenes/Examples",
};

export default meta;
type Story = StoryObj;

// ============================================================================
// SCENE 1: Product Launch Intro
// ============================================================================

const ProductLaunchScene: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)),
  });

  const logoRotate = interpolate(frame, [0, 20], [-180, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <AmbianceBackground preset="aurora" />
      
      {/* Floating shapes */}
      <div style={{ position: "absolute", top: 80, left: 100, opacity: 0.6 }}>
        <GlossyShape shape="blob1" width={120} height={120} glossStyle="soft" color="#a855f7" animation="float" />
      </div>
      <div style={{ position: "absolute", bottom: 100, right: 120, opacity: 0.5 }}>
        <GlossyShape shape="blob2" width={100} height={100} glossStyle="glass" color="#3b82f6" animation="float" />
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
          }}
        >
          <span style={{ fontSize: 48, color: "white" }}>✦</span>
        </div>

        {/* Title */}
        <TextAnimation
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.from(split.chars, {
              opacity: 0,
              y: 50,
              rotateX: -90,
              duration: 0.6,
              stagger: 0.03,
              ease: "back.out(1.7)",
              delay: 0.5, // ~15 frames at 30fps
            });
            return tl;
          }}
        >
          Introducing Nova
        </TextAnimation>

        {/* Subtitle */}
        <TextAnimation
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            maxWidth: 500,
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out",
              delay: 1.17, // ~35 frames at 30fps
            });
            return tl;
          }}
        >
          The future of design is here
        </TextAnimation>

        {/* CTA Button */}
        <GlossyButton
          size="lg"
          color="#667eea"
          animate
          animationType="bounce"
          delay={1.83}
        >
          Get Started Free
        </GlossyButton>
      </div>
    </AbsoluteFill>
  );
};

export const ProductLaunch: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={180} fps={30} backgroundColor="#0f0f23">
      <ProductLaunchScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 2: App Showcase
// ============================================================================

const AppShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneY = interpolate(frame, [0, 30], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const phoneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", overflow: "hidden" }}>
      <GridBackground color="rgba(99, 102, 241, 0.1)" cellSize={40} backgroundColor="transparent" />
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 60,
          padding: "0 40px",
        }}
      >
        {/* Left: Text content */}
        <div style={{ flex: 1, maxWidth: 400 }}>
          <TextAnimation
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#818cf8",
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 16,
            }}
            createTimeline={({ textRef, tl }) => {
              tl.from(textRef.current, { opacity: 0, x: -30, duration: 0.5, delay: 0.67 });
              return tl;
            }}
          >
            Mobile App
          </TextAnimation>

          <TextAnimation
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "lines" });
              tl.from(split.lines, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                delay: 1,
              });
              return tl;
            }}
          >
            Your finances, simplified
          </TextAnimation>

          <TextAnimation
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              marginBottom: 30,
            }}
            createTimeline={({ textRef, tl }) => {
              tl.from(textRef.current, { opacity: 0, y: 20, duration: 0.6, delay: 1.67 });
              return tl;
            }}
          >
            Track spending, set budgets, and reach your financial goals with our intuitive app.
          </TextAnimation>

          <div style={{ display: "flex", gap: 16 }}>
            <Button variant="glossy" color="#6366f1" animate animationType="slideUp" delay={2.33}>
              Download Now
            </Button>
            <Button variant="outline" color="#6366f1" animate animationType="slideUp" delay={2.43}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div
          style={{
            transform: `translateY(${phoneY}px)`,
            opacity: phoneOpacity,
          }}
        >
          <PhoneMockup
            device="iphone-15"
            color="black"
            scale={0.55}
            reflection={0.3}
          >
            <div
              style={{
                padding: 20,
                background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ color: "white", fontSize: 18, fontWeight: 600 }}>Dashboard</div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Total Balance</div>
                <Counter
                  from={0}
                  to={12847}
                  prefix="$"
                  suffix=".00"
                  delay={1.33}
                  style={{ color: "white", fontSize: 32, fontWeight: 700 }}
                  tabularNums
                />
              </div>
            </div>
          </PhoneMockup>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AppShowcase: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={180} fps={30} backgroundColor="#1a1a2e">
      <AppShowcaseScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 3: SaaS Landing
// ============================================================================

const SaaSLandingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const browserY = interpolate(frame, [30, 60], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const browserOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SoftGradient
        colors={["#fdf4ff", "#fae8ff", "#f5d0fe", "#e9d5ff"]}
        speed={0.3}
      />
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 60px",
          height: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <TextAnimation
            style={{
              fontSize: 48,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 12,
            }}
            createTimeline={({ textRef, tl }) => {
              tl.from(textRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                ease: "back.out(1.7)",
              });
              return tl;
            }}
          >
            Build faster with AI
          </TextAnimation>
        </div>

        <TextAnimation
          style={{
            fontSize: 18,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 500,
            marginBottom: 24,
          }}
          createTimeline={({ textRef, tl }) => {
            tl.from(textRef.current, { opacity: 0, y: 15, duration: 0.5, delay: 0.67 });
            return tl;
          }}
        >
          Ship products 10x faster with our AI-powered development platform
        </TextAnimation>

        {/* Browser mockup */}
        <div
          style={{
            transform: `translateY(${browserY}px)`,
            opacity: browserOpacity,
            flex: 1,
            width: "100%",
            maxWidth: 700,
          }}
        >
          <BrowserMockup
            browser="arc"
            url="app.buildfast.ai/dashboard"
            theme="light"
          >
            <div
              style={{
                padding: 24,
                background: "#fafafa",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                {["Projects", "Templates", "Analytics"].map((tab, i) => (
                  <div
                    key={tab}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: i === 0 ? "#7c3aed" : "transparent",
                      color: i === 0 ? "white" : "#6b7280",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      opacity: frame >= 50 + n * 8 ? 1 : 0,
                      transform: `translateY(${frame >= 50 + n * 8 ? 0 : 20}px)`,
                      transition: "opacity 0.3s, transform 0.3s",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${
                          ["#7c3aed", "#db2777", "#f59e0b"][n - 1]
                        } 0%, ${
                          ["#a855f7", "#ec4899", "#fbbf24"][n - 1]
                        } 100%)`,
                        marginBottom: 12,
                      }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                      Project {n}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Updated 2h ago
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserMockup>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SaaSLanding: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={180} fps={30} backgroundColor="#fdf4ff">
      <SaaSLandingScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 4: Chat/Social Demo
// ============================================================================

const ChatDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill>
      <AmbianceBackground preset="softLavender" />
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 40,
        }}
      >
        <TextAnimation
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: 30,
          }}
          createTimeline={({ textRef, tl }) => {
            tl.from(textRef.current, { opacity: 0, y: -20, duration: 0.5 });
            return tl;
          }}
        >
          Real-time messaging
        </TextAnimation>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            width: 400,
          }}
        >
          <ChatConversation gap={12}>
            <div style={{ opacity: frame >= 20 ? 1 : 0 }}>
              <BubbleMessage align="left" bubbleStyle="glossy">
                Hey! Did you see the new update? 🚀
              </BubbleMessage>
            </div>
            <div style={{ opacity: frame >= 50 ? 1 : 0 }}>
              <BubbleMessage align="right" bubbleStyle="glossy">
                Yes! It looks amazing!
              </BubbleMessage>
            </div>
            <div style={{ opacity: frame >= 70 ? 1 : 0 }}>
              <BubbleMessage align="right" bubbleStyle="glossy">
                The new features are incredible
              </BubbleMessage>
            </div>
            <div style={{ opacity: frame >= 100 ? 1 : 0 }}>
              <BubbleMessage align="left" bubbleStyle="glossy">
                Can't wait to try them out! ✨
              </BubbleMessage>
            </div>
          </ChatConversation>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ChatDemo: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={180} fps={30} backgroundColor="#f5f3ff">
      <ChatDemoScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 5: Stats/Metrics - Premium Dashboard Style
// ============================================================================

const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 2.5, suffix: "M+", label: "Active Users", icon: "👥", delay: 0.5 },
    { value: 99.9, suffix: "%", label: "Uptime SLA", icon: "⚡", delay: 0.8 },
    { value: 150, suffix: "+", label: "Countries", icon: "🌍", delay: 1.1 },
    { value: 4.9, suffix: "/5", label: "Rating", icon: "⭐", delay: 1.4 },
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      {/* Subtle gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          top: -200,
          left: -200,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          bottom: -150,
          right: -100,
          filter: "blur(50px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 40,
          gap: 36,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <TextAnimation
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#818cf8",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 10,
            }}
            createTimeline={({ textRef, tl }) => {
              tl.from(textRef.current, { opacity: 0, y: 10, duration: 0.4 });
              return tl;
            }}
          >
            Trusted Worldwide
          </TextAnimation>
          <TextAnimation
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "white",
              letterSpacing: -0.5,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                y: 40,
                duration: 0.5,
                stagger: 0.02,
                ease: "power3.out",
                delay: 0.2,
              });
              return tl;
            }}
          >
            Numbers that matter
          </TextAnimation>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "flex", gap: 16 }}>
          {stats.map((stat, index) => {
            const cardDelay = stat.delay * fps;
            const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const cardY = interpolate(frame, [cardDelay, cardDelay + 15], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

            return (
              <div
                key={stat.label}
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  borderRadius: 16,
                  padding: "24px 28px",
                  width: 140,
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 12 }}>{stat.icon}</div>
                <Counter
                  from={0}
                  to={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value < 10 ? 1 : 0}
                  delay={stat.delay + 0.2}
                  duration={1.5}
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "white",
                    display: "block",
                  }}
                  tabularNums
                />
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 6,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Stats: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={150} fps={30} backgroundColor="#0a0a0f">
      <StatsScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 6: Feature Highlight
// ============================================================================

const FeatureHighlightScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor path for drag and drop demonstration
  const cursorPath = [
    { x: 100, y: 80, frame: 40, cursor: "default" as const },
    { x: 140, y: 60, frame: 60, cursor: "pointer" as const },
    { x: 140, y: 60, frame: 70, click: true, cursor: "grab" as const },
    { x: 280, y: 140, frame: 110, cursor: "grabbing" as const },
    { x: 280, y: 140, frame: 120, click: true, cursor: "default" as const },
    { x: 320, y: 100, frame: 150, cursor: "default" as const },
  ];

  return (
    <AbsoluteFill>
      <AmbianceBackground preset="softPink" />
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 60,
          padding: 60,
        }}
      >
        {/* Left content */}
        <div style={{ flex: 1, maxWidth: 350 }}>
          <TextAnimation
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#1f2937",
              lineHeight: 1.3,
              marginBottom: 20,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "lines" });
              tl.from(split.lines, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
              });
              return tl;
            }}
          >
            Intuitive drag and drop
          </TextAnimation>

          <TextAnimation
            style={{
              fontSize: 16,
              color: "#6b7280",
              lineHeight: 1.7,
            }}
            createTimeline={({ textRef, tl }) => {
              tl.from(textRef.current, { opacity: 0, y: 15, duration: 0.5, delay: 0.67 });
              return tl;
            }}
          >
            Build complex layouts in seconds with our powerful visual editor. No code required.
          </TextAnimation>
        </div>

        {/* Right: Interactive demo */}
        <div
          style={{
            position: "relative",
            width: 400,
            height: 300,
            background: "white",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            overflow: "visible",
          }}
        >
          {/* Demo content */}
          <div style={{ padding: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  style={{
                    height: 60,
                    borderRadius: 10,
                    background:
                      n === 2
                        ? "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
                        : "#f3f4f6",
                    opacity: frame >= 25 + n * 5 
                      ? (n === 2 && frame > 70 && frame < 120 ? 0.5 : 1) 
                      : 0,
                    transform: `translateY(${frame >= 25 + n * 5 ? 0 : 10}px)`,
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cursor overlay */}
          <div style={{ opacity: frame >= 40 ? 1 : 0 }}>
            <Cursor
              path={cursorPath}
              size={24}
              color="#1f2937"
              showClickRipple
              rippleColor="rgba(236, 72, 153, 0.4)"
              shadow
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FeatureHighlight: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={180} fps={30} backgroundColor="#fdf2f8">
      <FeatureHighlightScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 7: Testimonial - Cinematic Quote Style
// ============================================================================

const TestimonialScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth animations
  const bgScale = interpolate(frame, [0, 150], [1, 1.05], { extrapolateRight: "clamp" });
  const quoteOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [10, 30], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  
  const authorOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const authorY = interpolate(frame, [70, 90], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const starsOpacity = interpolate(frame, [90, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0f0f14", overflow: "hidden" }}>
      {/* Cinematic gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 120% 80% at 50% 120%, #1a1a2e 0%, #0f0f14 60%)",
          transform: `scale(${bgScale})`,
        }}
      />
      
      {/* Subtle light leak */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 50,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Quote container */}
        <div
          style={{
            maxWidth: 700,
            textAlign: "center",
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
          }}
        >
          {/* Decorative quote marks */}
          <div
            style={{
              fontSize: 60,
              color: "rgba(147, 51, 234, 0.3)",
              fontFamily: "Georgia, serif",
              lineHeight: 0.5,
              marginBottom: 16,
            }}
          >
            "
          </div>

          {/* Quote text */}
          <TextAnimation
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "white",
              lineHeight: 1.6,
              letterSpacing: -0.3,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 15,
                duration: 0.4,
                stagger: 0.025,
                ease: "power2.out",
                delay: 0.5,
              });
              return tl;
            }}
          >
            This isn't just a tool — it's become essential to how we build products.
          </TextAnimation>
        </div>

        {/* Author section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 30,
            opacity: authorOpacity,
            transform: `translateY(${authorY}px)`,
          }}
        >
          {/* Star rating */}
          <div
            style={{
              display: "flex",
              gap: 3,
              marginBottom: 16,
              opacity: starsOpacity,
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                style={{
                  width: 14,
                  height: 14,
                  background: "#fbbf24",
                  clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              />
            ))}
          </div>

          {/* Avatar and info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                padding: 2,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#1a1a2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                SJ
              </div>
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
                Sarah Johnson
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                VP of Engineering, Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Testimonial: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={150} fps={30} backgroundColor="#0f0f14">
      <TestimonialScene />
    </RemotionWrapper>
  ),
};

// ============================================================================
// SCENE 8: Pricing
// ============================================================================

const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: "#fafafa" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 40,
        }}
      >
        <TextAnimation
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#111",
            marginBottom: 40,
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.from(split.chars, {
              opacity: 0,
              y: 30,
              duration: 0.4,
              stagger: 0.02,
              ease: "power3.out",
            });
            return tl;
          }}
        >
          Simple pricing
        </TextAnimation>

        <div style={{ display: "flex", gap: 24 }}>
          {[
            { name: "Starter", price: 0, features: ["5 projects", "Basic support", "1GB storage"], showAt: 20 },
            { name: "Pro", price: 29, features: ["Unlimited projects", "Priority support", "100GB storage"], popular: true, showAt: 32 },
            { name: "Enterprise", price: 99, features: ["Custom solutions", "Dedicated support", "Unlimited storage"], showAt: 44 },
          ].map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "white",
                borderRadius: 20,
                padding: 28,
                width: 220,
                boxShadow: plan.popular
                  ? "0 20px 40px rgba(99, 102, 241, 0.3)"
                  : "0 4px 20px rgba(0,0,0,0.08)",
                transform: `scale(${plan.popular ? 1.05 : 1}) translateY(${frame >= plan.showAt ? 0 : 30}px)`,
                opacity: frame >= plan.showAt ? 1 : 0,
                transition: "opacity 0.3s, transform 0.3s",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: plan.popular ? "white" : "#111",
                  marginBottom: 8,
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: plan.popular ? "white" : "#111",
                  marginBottom: 20,
                }}
              >
                ${plan.price}
                <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.7 }}>/mo</span>
              </div>
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    fontSize: 13,
                    color: plan.popular ? "rgba(255,255,255,0.9)" : "#6b7280",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ color: plan.popular ? "#a5f3fc" : "#4ade80" }}>✓</span>
                  {feature}
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <Button
                  variant={plan.popular ? "glass" : "outline"}
                  color={plan.popular ? "#ffffff" : "#6366f1"}
                  textColor={plan.popular ? "#6366f1" : "#6366f1"}
                  size="sm"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Pricing: Story = {
  render: () => (
    <RemotionWrapper durationInFrames={150} fps={30} backgroundColor="#fafafa">
      <PricingScene />
    </RemotionWrapper>
  ),
};
