import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  Transition,
  TransitionSeries,
  linearTiming,
  springTiming,
  getPresentation,
  createTiming,
  TRANSITION_TYPES,
  type TransitionType,
  type TimingType,
} from "../../remotion/base/components/layout";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Transition> = {
  title: "Layout/Transition",
  component: Transition,
  argTypes: {
    type: {
      control: "select",
      options: TRANSITION_TYPES,
    },
    timing: {
      control: "select",
      options: ["linear", "spring", "smooth", "snappy", "expo"],
    },
    durationInFrames: { control: { type: "range", min: 30, max: 120, step: 10 } },
    transitionDurationInFrames: { control: { type: "range", min: 10, max: 60, step: 5 } },
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

const SceneC = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div style={{ fontSize: 80, marginBottom: 8 }}>⭐</div>
    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Scene C</div>
    <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>THE FINALE</div>
  </AbsoluteFill>
);

// === BASIC TRANSITIONS USING SIMPLIFIED COMPONENT ===

export const FadeTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="fade"
      transitionDurationInFrames={30}
      timing="linear"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const CrossDissolve: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="crossDissolve"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const BlurDissolve: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="blurDissolve"
      transitionDurationInFrames={30}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === SLIDE TRANSITIONS ===

export const SlideLeft: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="slideLeft"
      transitionDurationInFrames={20}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const SlideRight: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="slideRight"
      transitionDurationInFrames={20}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const SlideUp: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="slideUp"
      transitionDurationInFrames={20}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const SlideDown: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="slideDown"
      transitionDurationInFrames={20}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === PUSH TRANSITIONS ===

export const PushLeft: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="pushLeft"
      transitionDurationInFrames={25}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const PushRight: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="pushRight"
      transitionDurationInFrames={25}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === WIPE TRANSITIONS ===

export const Wipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="wipe"
      transitionDurationInFrames={30}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const ClockWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="clockWipe"
      transitionDurationInFrames={30}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const CircleWipe: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="circleWipe"
      transitionDurationInFrames={30}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === ZOOM TRANSITIONS ===

export const ZoomIn: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="zoomIn"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const ZoomOut: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="zoomOut"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === 3D TRANSITIONS ===

export const Flip: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="flip"
      transitionDurationInFrames={25}
      timing="snappy"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const Cube: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="cube"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const Doorway: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="doorway"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const Swing: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="swing"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === CINEMATIC TRANSITIONS ===

export const WhipPan: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={50}
      type="whipPan"
      transitionDurationInFrames={15}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const FlashWhite: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={50}
      type="flashWhite"
      transitionDurationInFrames={20}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const FlashBlack: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={50}
      type="flashBlack"
      transitionDurationInFrames={20}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

export const Glitch: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={50}
      type="glitch"
      transitionDurationInFrames={15}
    >
      <SceneA />
      <SceneB />
    </Transition>
  ),
};

// === MULTI-SCENE TRANSITIONS ===

export const ThreeSceneTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={240} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="fade"
      transitionDurationInFrames={30}
      timing="smooth"
    >
      <SceneA />
      <SceneB />
      <SceneC />
    </Transition>
  ),
};

// === DIRECT TRANSITIONSERIES USAGE ===

export const DirectTransitionSeries: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={180} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={getPresentation("slideLeft")}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneB />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={getPresentation("fade")}
        timing={springTiming({ config: { damping: 200 } })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneC />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  ),
};

export const MixedTransitions: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={240} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={getPresentation("zoomIn")}
        timing={createTiming("smooth", 30)}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneB />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={getPresentation("cube")}
        timing={createTiming("snappy", 25)}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneC />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  ),
};

// === GALLERY ===

const GalleryItem = ({ type, label }: { type: TransitionType; label: string }) => {
  const MiniSceneA = () => (
    <AbsoluteFill style={{ background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#fff", fontSize: 14, opacity: 0.5 }}>A</span>
    </AbsoluteFill>
  );
  
  const MiniSceneB = () => (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
    }}>
      <span style={{ color: "#fff", fontSize: 10, opacity: 0.6 }}>B</span>
      <span style={{ color: "#fff", fontSize: 9, fontWeight: 500 }}>{label}</span>
    </AbsoluteFill>
  );
  
  return (
    <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "16/9" }}>
      <Transition
        durationInFrames={45}
        type={type}
        transitionDurationInFrames={20}
        timing="smooth"
      >
        <MiniSceneA />
        <MiniSceneB />
      </Transition>
    </div>
  );
};

export const TransitionGallery: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={180} backgroundColor="#0a0a0a"><Story /></RemotionWrapper>],
  render: () => {
    const transitions: { type: TransitionType; label: string }[] = [
      { type: "fade", label: "Fade" },
      { type: "crossDissolve", label: "Dissolve" },
      { type: "blurDissolve", label: "Blur" },
      { type: "slideLeft", label: "Slide" },
      { type: "pushLeft", label: "Push" },
      { type: "wipe", label: "Wipe" },
      { type: "clockWipe", label: "Clock" },
      { type: "circleWipe", label: "Circle" },
      { type: "zoomIn", label: "Zoom In" },
      { type: "zoomOut", label: "Zoom Out" },
      { type: "flip", label: "Flip" },
      { type: "cube", label: "Cube" },
      { type: "doorway", label: "Doorway" },
      { type: "whipPan", label: "Whip Pan" },
      { type: "flashWhite", label: "Flash" },
      { type: "glitch", label: "Glitch" },
    ];
    
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 16, boxSizing: "border-box" }}>
        {transitions.map(({ type, label }) => (
          <GalleryItem key={type} type={type} label={label} />
        ))}
      </div>
    );
  },
};

// ============================================================================
// SCENE EXAMPLES
// ============================================================================

// Product Showcase Transition
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

export const ProductShowcaseTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="blurDissolve"
      transitionDurationInFrames={25}
      timing="smooth"
    >
      <ProductTeaser />
      <ProductShowcase />
    </Transition>
  ),
};

// Testimonial to CTA
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

export const TestimonialToCTA: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#0f0f1a"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="doorway"
      transitionDurationInFrames={25}
      timing="smooth"
    >
      <TestimonialScene />
      <CTAScene />
    </Transition>
  ),
};

// Feature List Transition
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

export const FeatureSlideTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={50}
      type="slideLeft"
      transitionDurationInFrames={15}
      timing="snappy"
    >
      <Feature1 />
      <Feature2 />
    </Transition>
  ),
};

// Pricing Reveal
const PricingTeaser = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
      <div style={{ fontSize: 14, color: "#f59e0b", fontWeight: 600, letterSpacing: 3 }}>💰 SPECIAL OFFER</div>
      <div style={{ fontSize: 52, fontWeight: 700, color: "white" }}>Limited Time Pricing</div>
      <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>Save 40% on annual plans</div>
    </div>
  </AbsoluteFill>
);

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

export const PricingRevealTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={130} backgroundColor="#0a0a0f"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={55}
      type="zoomIn"
      transitionDurationInFrames={25}
      timing="expo"
    >
      <PricingTeaser />
      <PricingCards />
    </Transition>
  ),
};

// App Demo
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

const AppInterface = () => (
  <AbsoluteFill style={{ background: "#0f172a" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 40 }}>
      <div style={{ width: 600, height: 340, background: "#1e293b", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}>
        <div style={{ height: 44, background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          <div style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>TaskFlow — Dashboard</div>
        </div>
        <div style={{ display: "flex", height: "calc(100% - 44px)" }}>
          <div style={{ width: 160, background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.1)", padding: 12 }}>
            {["Dashboard", "Projects", "Tasks", "Team"].map((item, i) => (
              <div key={item} style={{ padding: "8px 10px", borderRadius: 6, background: i === 0 ? "rgba(59, 130, 246, 0.2)" : "transparent", color: i === 0 ? "#3b82f6" : "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4 }}>{item}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 16 }}>Today's Tasks</div>
            {["Design review", "Team standup", "Client call"].map((task) => (
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

export const AppDemoTransition: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={140} backgroundColor="#0f172a"><Story /></RemotionWrapper>],
  render: () => (
    <Transition
      durationInFrames={60}
      type="cube"
      transitionDurationInFrames={20}
      timing="smooth"
    >
      <AppHero />
      <AppInterface />
    </Transition>
  ),
};

// Spring Timing Demo
export const SpringTimingDemo: Story = {
  decorators: [(Story) => <RemotionWrapper durationInFrames={150} backgroundColor="#000"><Story /></RemotionWrapper>],
  render: () => (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={getPresentation("slideLeft")}
        timing={springTiming({
          config: {
            damping: 12,
            stiffness: 100,
            mass: 0.5,
          },
        })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneB />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  ),
};
