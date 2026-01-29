import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Transition, type TransitionType } from "../../remotion/base/components/layout";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Transition> = {
  title: "Layout/Transition",
  component: Transition,
  argTypes: {
    type: {
      control: "select",
      options: [
        "crossDissolve", "additiveDissolve", "blurDissolve", "directionalBlur", "zoomBlur",
        "slideLeft", "slideRight", "slideUp", "slideDown", "pushLeft", "pushRight",
        "zoomIn", "zoomOut", "zoomThrough",
        "circleWipe", "rectWipe", "clockWipe", "starWipe", "hexWipe", "diagonalWipe",
        "splitHorizontal", "splitVertical",
        "cube", "flip", "doorway", "swing",
        "whipPan", "lightLeak", "filmBurn", "flashWhite", "flashBlack", "glitch", "rgbSplit",
      ],
    },
    duration: { control: { type: "range", min: 0.3, max: 2, step: 0.1 } },
    ease: { control: "select", options: ["smooth", "snappy", "expo", "circ", "linear"] },
  },
};

export default meta;
type Story = StoryObj<typeof Transition>;

// Premium scene components
const SceneA = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div style={{ fontSize: 80, marginBottom: 8 }}>🌙</div>
    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Scene A</div>
    <div style={{ fontSize: 18, color: "#888", letterSpacing: 2 }}>THE BEGINNING</div>
  </AbsoluteFill>
);

const SceneB = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div style={{ fontSize: 80, marginBottom: 8 }}>☀️</div>
    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Scene B</div>
    <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>THE TRANSITION</div>
  </AbsoluteFill>
);

// Transition demo with A→B
const TransitionDemo = ({ 
  type, 
  duration = 0.8,
  ease = "smooth" as const,
}: { 
  type: TransitionType; 
  duration?: number;
  ease?: "smooth" | "snappy" | "expo" | "circ" | "linear";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 45;
  const transitionFrames = Math.round(duration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  return (
    <>
      {showSceneA && <SceneA />}
      {showSceneB && (
        <Transition type={type} duration={duration} delay={transitionStart / fps} ease={ease}>
          <SceneB />
        </Transition>
      )}
    </>
  );
};

// === DISSOLVES ===

export const CrossDissolve: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="crossDissolve" duration={0.8} />,
};

export const AdditiveDissolve: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="additiveDissolve" duration={0.8} />,
};

export const BlurDissolve: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="blurDissolve" duration={1} />,
};

// === BLUR-BASED ===

export const DirectionalBlur: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="directionalBlur" duration={0.7} ease="snappy" />,
};

export const ZoomBlur: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="zoomBlur" duration={0.8} />,
};

export const SpinBlur: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="spinBlur" duration={0.8} />,
};

// === MOVEMENT ===

export const SlideLeft: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="slideLeft" duration={0.6} ease="snappy" />,
};

export const PushRight: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="pushRight" duration={0.7} ease="snappy" />,
};

// === ZOOM ===

export const ZoomIn: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="zoomIn" duration={0.8} />,
};

export const ZoomOut: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="zoomOut" duration={0.8} />,
};

export const ZoomThrough: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="zoomThrough" duration={1.2} />,
};

// === REVEALS ===

export const CircleWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="circleWipe" duration={0.8} />,
};

export const StarWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="starWipe" duration={1} />,
};

export const HexWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="hexWipe" duration={0.8} />,
};

export const DiagonalWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="diagonalWipe" duration={0.7} ease="snappy" />,
};

export const SplitHorizontal: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="splitHorizontal" duration={0.7} />,
};

// === 3D ===

export const Cube: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="cube" duration={0.8} />,
};

export const Flip: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="flip" duration={0.7} ease="snappy" />,
};

export const Doorway: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="doorway" duration={0.8} />,
};

export const Swing: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="swing" duration={0.8} />,
};

// === CINEMATIC ===

export const WhipPan: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={100} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="whipPan" duration={0.5} />,
};

export const LightLeak: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="lightLeak" duration={1.2} />,
};

export const FilmBurn: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="filmBurn" duration={1} />,
};

export const FlashWhite: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={100} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="flashWhite" duration={0.6} />,
};

export const FlashBlack: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={100} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="flashBlack" duration={0.6} />,
};

export const Glitch: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={90} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="glitch" duration={0.5} />,
};

export const RGBSplit: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => <TransitionDemo type="rgbSplit" duration={0.8} />,
};

// === GALLERY ===

const GalleryItem = ({ type, label, delay = 0 }: { type: TransitionType; label: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transitionStart = 30 + delay * fps;
  const transitionFrames = Math.round(0.6 * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  return (
    <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "16/9" }}>
      {showSceneA && (
        <div style={{ position: "absolute", inset: 0, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14, opacity: 0.5 }}>A</span>
        </div>
      )}
      {showSceneB && (
        <Transition type={type} duration={0.6} delay={transitionStart / fps}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <span style={{ color: "#fff", fontSize: 10, opacity: 0.6 }}>B</span>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 500 }}>{label}</span>
          </div>
        </Transition>
      )}
    </div>
  );
};

export const TransitionGallery: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={180} backgroundColor="#0a0a0a"><Story /></RemotionWrapper>],
  render: () => {
    const transitions: { type: TransitionType; label: string }[] = [
      { type: "crossDissolve", label: "Dissolve" },
      { type: "blurDissolve", label: "Blur" },
      { type: "zoomBlur", label: "Zoom Blur" },
      { type: "slideLeft", label: "Slide" },
      { type: "pushRight", label: "Push" },
      { type: "zoomIn", label: "Zoom In" },
      { type: "zoomThrough", label: "Zoom Through" },
      { type: "circleWipe", label: "Circle" },
      { type: "hexWipe", label: "Hex" },
      { type: "diagonalWipe", label: "Diagonal" },
      { type: "cube", label: "Cube" },
      { type: "doorway", label: "Doorway" },
      { type: "whipPan", label: "Whip Pan" },
      { type: "lightLeak", label: "Light Leak" },
      { type: "flashWhite", label: "Flash" },
      { type: "glitch", label: "Glitch" },
    ];
    
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 16, boxSizing: "border-box" }}>
        {transitions.map(({ type, label }, i) => (
          <GalleryItem key={type} type={type} label={label} delay={i * 0.08} />
        ))}
      </div>
    );
  },
};

// ============================================================================
// TRANSITION SCENE EXAMPLES
// ============================================================================

// Product Showcase Transition
const ProductShowcaseDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 60;
  const transitionDuration = 0.7;
  const transitionFrames = Math.round(transitionDuration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  // Scene A: Product teaser
  const ProductTeaser = () => (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
        <div style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>
          Introducing
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "white", letterSpacing: -2 }}>
          AirPods Pro
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
          Adaptive Audio. Now playing.
        </div>
      </div>
    </AbsoluteFill>
  );

  // Scene B: Product showcase
  const ProductShowcase = () => (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 60 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 40,
            background: "linear-gradient(145deg, #2a2a4a 0%, #1a1a2e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
          }}
        >
          🎧
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>Immersive Sound</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 300, lineHeight: 1.6 }}>
            Active Noise Cancellation for immersive sound. Transparency mode for hearing what's happening around you.
          </div>
          <div style={{ marginTop: 16, padding: "14px 28px", background: "#6366f1", borderRadius: 12, color: "white", fontWeight: 600, fontSize: 14, width: "fit-content" }}>
            Learn More
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
  
  return (
    <>
      {showSceneA && <ProductTeaser />}
      {showSceneB && (
        <Transition type="zoomBlur" duration={transitionDuration} delay={transitionStart / fps} ease="smooth">
          <ProductShowcase />
        </Transition>
      )}
    </>
  );
};

export const ProductShowcaseTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => <ProductShowcaseDemo />,
};

// Testimonial to CTA Transition
const TestimonialCTADemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 70;
  const transitionDuration = 0.6;
  const transitionFrames = Math.round(transitionDuration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  // Scene A: Testimonial
  const TestimonialScene = () => (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 40, color: "rgba(255,255,255,0.3)", fontFamily: "Georgia, serif", marginBottom: 10 }}>"</div>
        <div style={{ fontSize: 28, color: "white", maxWidth: 600, lineHeight: 1.5, fontWeight: 400 }}>
          This product completely transformed how our team collaborates. We've seen a 40% increase in productivity.
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            👤
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Sarah Johnson</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>CEO, TechCorp</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );

  // Scene B: CTA
  const CTAScene = () => (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: "white", textAlign: "center" }}>
          Ready to get started?
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
          Join thousands of teams already using our platform
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          <div style={{ padding: "16px 32px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 12, color: "white", fontWeight: 600, fontSize: 16 }}>
            Start Free Trial
          </div>
          <div style={{ padding: "16px 32px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, color: "white", fontWeight: 500, fontSize: 16 }}>
            Watch Demo
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
  
  return (
    <>
      {showSceneA && <TestimonialScene />}
      {showSceneB && (
        <Transition type="doorway" duration={transitionDuration} delay={transitionStart / fps} ease="smooth">
          <CTAScene />
        </Transition>
      )}
    </>
  );
};

export const TestimonialToCTA: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#0f0f1a"><Story /></RemotionWrapper>],
  render: () => <TestimonialCTADemo />,
};

// Feature List Transition
const FeatureListDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 55;
  const transitionDuration = 0.5;
  const transitionFrames = Math.round(transitionDuration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  // Scene A: Feature 1
  const Feature1 = () => (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 50 }}>
        <div style={{ width: 180, height: 180, borderRadius: 30, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>
          ⚡
        </div>
        <div style={{ maxWidth: 350 }}>
          <div style={{ fontSize: 14, color: "#10b981", fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>FEATURE 01</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "white", marginBottom: 16 }}>Lightning Fast</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Built on the latest technology stack for blazing fast performance and instant loading times.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );

  // Scene B: Feature 2
  const Feature2 = () => (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 50 }}>
        <div style={{ maxWidth: 350, textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#6366f1", fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>FEATURE 02</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "white", marginBottom: 16 }}>Secure by Default</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Enterprise-grade security with end-to-end encryption and compliance certifications.
          </div>
        </div>
        <div style={{ width: 180, height: 180, borderRadius: 30, background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>
          🔒
        </div>
      </div>
    </AbsoluteFill>
  );
  
  return (
    <>
      {showSceneA && <Feature1 />}
      {showSceneB && (
        <Transition type="slideLeft" duration={transitionDuration} delay={transitionStart / fps} ease="snappy">
          <Feature2 />
        </Transition>
      )}
    </>
  );
};

export const FeatureSlideTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => <FeatureListDemo />,
};

// Pricing Reveal Transition
const PricingRevealDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 50;
  const transitionDuration = 0.8;
  const transitionFrames = Math.round(transitionDuration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  // Scene A: Pricing teaser
  const PricingTeaser = () => (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
        <div style={{ fontSize: 14, color: "#f59e0b", fontWeight: 600, letterSpacing: 3 }}>💰 SPECIAL OFFER</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "white" }}>Limited Time Pricing</div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>Save 40% on annual plans</div>
      </div>
    </AbsoluteFill>
  );

  // Scene B: Pricing cards
  const PricingCards = () => (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
        {[
          { name: "Starter", price: "$9", features: ["5 projects", "Basic analytics"] },
          { name: "Pro", price: "$29", features: ["Unlimited projects", "Advanced analytics"], featured: true },
          { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated support"] },
        ].map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.featured ? "linear-gradient(145deg, #6366f1 0%, #4f46e5 100%)" : "rgba(255,255,255,0.05)",
              borderRadius: 20,
              padding: "32px 28px",
              width: 180,
              border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.1)",
              transform: plan.featured ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div style={{ fontSize: 14, color: plan.featured ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", marginBottom: 8 }}>{plan.name}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white", marginBottom: 16 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400 }}>/mo</span></div>
            {plan.features.map((f) => (
              <div key={f} style={{ fontSize: 12, color: plan.featured ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)", marginBottom: 8 }}>✓ {f}</div>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
  
  return (
    <>
      {showSceneA && <PricingTeaser />}
      {showSceneB && (
        <Transition type="zoomIn" duration={transitionDuration} delay={transitionStart / fps} ease="expo">
          <PricingCards />
        </Transition>
      )}
    </>
  );
};

export const PricingRevealTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={130} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => <PricingRevealDemo />,
};

// App Demo Transition
const AppDemoDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const transitionStart = 60;
  const transitionDuration = 0.6;
  const transitionFrames = Math.round(transitionDuration * fps);
  const showSceneA = frame < transitionStart + transitionFrames;
  const showSceneB = frame >= transitionStart;
  
  // Scene A: App hero
  const AppHero = () => (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          📱
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, color: "white" }}>TaskFlow</div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>The smarter way to manage projects</div>
      </div>
    </AbsoluteFill>
  );

  // Scene B: App interface
  const AppInterface = () => (
    <AbsoluteFill style={{ background: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 40 }}>
        <div style={{ width: 600, height: 340, background: "#1e293b", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}>
          {/* App header */}
          <div style={{ height: 44, background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
            <div style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>TaskFlow — Dashboard</div>
          </div>
          {/* App content */}
          <div style={{ display: "flex", height: "calc(100% - 44px)" }}>
            <div style={{ width: 160, background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.1)", padding: 12 }}>
              {["Dashboard", "Projects", "Tasks", "Team"].map((item, i) => (
                <div key={item} style={{ padding: "8px 10px", borderRadius: 6, background: i === 0 ? "rgba(59, 130, 246, 0.2)" : "transparent", color: i === 0 ? "#3b82f6" : "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4 }}>{item}</div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 16 }}>Today's Tasks</div>
              {["Design review", "Team standup", "Client call"].map((task, i) => (
                <div key={task} style={{ padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid #3b82f6" }} />
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
  
  return (
    <>
      {showSceneA && <AppHero />}
      {showSceneB && (
        <Transition type="cube" duration={transitionDuration} delay={transitionStart / fps} ease="smooth">
          <AppInterface />
        </Transition>
      )}
    </>
  );
};

export const AppDemoTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={140} backgroundColor="#0f172a"><Story /></RemotionWrapper>],
  render: () => <AppDemoDemo />,
};
