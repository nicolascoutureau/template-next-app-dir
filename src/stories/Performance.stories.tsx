import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AbsoluteFill } from "remotion";

// Components to test - importing directly from component files
import { KineticText } from "../remotion/library/components/text/KineticText";
import { WordStream } from "../remotion/library/components/text/WordStream";
import { Glow } from "../remotion/library/components/effects/Glow";
import { Shimmer } from "../remotion/library/components/effects/Shimmer";
import { FourColorGradient } from "../remotion/library/components/effects/FourColorGradient";
import {
  TransitionSeries,
  linearTiming,
  getPresentation,
} from "../remotion/library/components/layout/Transition";
import { Camera } from "../remotion/library/components/layout/Camera";

// Performance wrapper
import { PerformanceWrapper } from "./helpers/PerformanceWrapper";

/**
 * # Performance Testing
 *
 * These stories measure component render times and provide real-time performance metrics.
 * Each story displays:
 * - **Average render time** - How long each frame takes to render
 * - **Estimated FPS** - Theoretical frames per second based on render time
 * - **Performance rating** - Excellent (<4ms), Good (<8ms), Acceptable (<16ms), Poor (>16ms)
 *
 * Use these stories to identify performance bottlenecks and optimize components.
 */
const meta: Meta = {
  title: "Performance",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// ============================================================================
// TEXT COMPONENTS PERFORMANCE
// ============================================================================

export const KineticTextMarquee: StoryObj = {
  name: "Text / KineticText (Marquee)",
  render: () => (
    <PerformanceWrapper
      componentLabel="KineticText Marquee"
      durationInFrames={300}
      fps={60}
      backgroundColor="#111"
    >
      <div style={{ width: "100%", height: "100%", color: "#fff" }}>
        <KineticText
          type="marquee"
          fontSize={80}
          fontFamily="Impact, sans-serif"
          speed={2}
          repeat={15}
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)" }}
        >
          PERFORMANCE TEST • KINETIC TYPOGRAPHY •{" "}
        </KineticText>
      </div>
    </PerformanceWrapper>
  ),
};

export const KineticTextCylinder: StoryObj = {
  name: "Text / KineticText (Cylinder 3D)",
  render: () => (
    <PerformanceWrapper
      componentLabel="KineticText Cylinder"
      durationInFrames={300}
      fps={60}
      backgroundColor="#111"
    >
      <div style={{ width: "100%", height: "100%", color: "#fff" }}>
        <KineticText
          type="cylinder"
          fontSize={48}
          fontFamily="Arial Black, sans-serif"
          color="#00ffaa"
          speed={1.5}
          radius={180}
          repeat={12}
        >
          3D ROTATING TEXT
        </KineticText>
      </div>
    </PerformanceWrapper>
  ),
};

export const WordStreamPerformance: StoryObj = {
  name: "Text / WordStream",
  render: () => (
    <PerformanceWrapper
      componentLabel="WordStream"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <WordStream
        words={[
          "Performance",
          "Testing",
          "Animation",
          "Library",
          "Components",
          "Storybook",
          "Metrics",
          "Rendering",
        ]}
        fontSize={60}
        color="#ffffff"
      />
    </PerformanceWrapper>
  ),
};

// ============================================================================
// EFFECTS COMPONENTS PERFORMANCE
// ============================================================================

export const GlowEffectPerformance: StoryObj = {
  name: "Effects / Glow",
  render: () => (
    <PerformanceWrapper
      componentLabel="Glow Effect"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <Glow color="#ff00ff" intensity={1.5} pulsate pulsateSpeed={2}>
        <div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#222",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          GLOW
        </div>
      </Glow>
    </PerformanceWrapper>
  ),
};

export const ShimmerEffectPerformance: StoryObj = {
  name: "Effects / Shimmer",
  render: () => (
    <PerformanceWrapper
      componentLabel="Shimmer Effect"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <Shimmer color="#ffffff" angle={45} speed={1}>
        <div
          style={{
            width: 300,
            height: 150,
            backgroundColor: "#333",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          SHIMMER
        </div>
      </Shimmer>
    </PerformanceWrapper>
  ),
};

export const FourColorGradientPerformance: StoryObj = {
  name: "Effects / FourColorGradient",
  render: () => (
    <PerformanceWrapper
      componentLabel="FourColorGradient"
      durationInFrames={300}
      fps={60}
    >
      <FourColorGradient
        preset="aurora"
        animate
        animationSpeed={1}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 48,
            fontWeight: "bold",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          Animated Gradient
        </div>
      </FourColorGradient>
    </PerformanceWrapper>
  ),
};

// ============================================================================
// LAYOUT COMPONENTS PERFORMANCE
// ============================================================================

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
    <div style={{ fontSize: 80 }}>🌙</div>
    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Scene A</div>
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
    <div style={{ fontSize: 80 }}>☀️</div>
    <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Scene B</div>
  </AbsoluteFill>
);

export const TransitionSeriesPerformance: StoryObj = {
  name: "Layout / TransitionSeries",
  render: () => (
    <PerformanceWrapper
      componentLabel="TransitionSeries"
      durationInFrames={120}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={60}>
          <SceneA />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={getPresentation("fade")}
          timing={linearTiming({ durationInFrames: 30 })}
        />
        <TransitionSeries.Sequence durationInFrames={60}>
          <SceneB />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </PerformanceWrapper>
  ),
};

export const CameraZoomPerformance: StoryObj = {
  name: "Layout / Camera (Zoom)",
  render: () => (
    <PerformanceWrapper
      componentLabel="Camera Zoom"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <Camera
        animation={{
          type: "zoom",
          from: 1,
          to: 1.5,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          Camera Zoom
        </div>
      </Camera>
    </PerformanceWrapper>
  ),
};

// ============================================================================
// STRESS TESTS
// ============================================================================

export const MultipleGlowsStress: StoryObj = {
  name: "Stress / Multiple Glows (10x)",
  render: () => (
    <PerformanceWrapper
      componentLabel="10x Glow Stress Test"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          padding: 40,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Glow
            key={i}
            color={`hsl(${i * 36}, 100%, 50%)`}
            intensity={1}
            pulsate
            pulsateSpeed={1 + i * 0.2}
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#222",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {i + 1}
            </div>
          </Glow>
        ))}
      </div>
    </PerformanceWrapper>
  ),
};

export const HighFPSStress: StoryObj = {
  name: "Stress / High FPS (120fps)",
  render: () => (
    <PerformanceWrapper
      componentLabel="120 FPS Test"
      durationInFrames={600}
      fps={120}
      backgroundColor="#0a0a0a"
    >
      <div style={{ width: "100%", height: "100%" }}>
        <KineticText
          type="marquee"
          fontSize={60}
          fontFamily="Arial Black, sans-serif"
          color="#00ff00"
          speed={3}
          repeat={20}
          style={{ position: "absolute", top: "30%", transform: "translateY(-50%)" }}
        >
          120 FPS STRESS TEST •{" "}
        </KineticText>
        <KineticText
          type="marquee"
          fontSize={60}
          fontFamily="Arial Black, sans-serif"
          color="#ff0066"
          speed={2}
          reverse
          repeat={20}
          style={{ position: "absolute", top: "70%", transform: "translateY(-50%)" }}
        >
          HIGH PERFORMANCE MODE •{" "}
        </KineticText>
      </div>
    </PerformanceWrapper>
  ),
};

export const CombinedEffectsStress: StoryObj = {
  name: "Stress / Combined Effects",
  render: () => (
    <PerformanceWrapper
      componentLabel="Combined Effects"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <FourColorGradient preset="neon" animate animationSpeed={0.5}>
        <Glow color="#ffffff" intensity={0.8} pulsate>
          <Shimmer color="#ffffff" speed={2}>
            <div
              style={{
                width: 400,
                height: 200,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 32,
                fontWeight: "bold",
                backdropFilter: "blur(10px)",
              }}
            >
              Stacked Effects
            </div>
          </Shimmer>
        </Glow>
      </FourColorGradient>
    </PerformanceWrapper>
  ),
};

// ============================================================================
// COMPARISON TESTS
// ============================================================================

export const LowVsHighRepeat: StoryObj = {
  name: "Comparison / Low vs High Repeat Count",
  render: () => (
    <PerformanceWrapper
      componentLabel="Repeat Count Comparison"
      durationInFrames={300}
      fps={60}
      backgroundColor="#0a0a0a"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <div>
          <div style={{ color: "#666", fontSize: 12, marginLeft: 20, marginBottom: 8 }}>
            LOW REPEAT (5x)
          </div>
          <KineticText
            type="marquee"
            fontSize={40}
            fontFamily="Arial Black, sans-serif"
            color="#3b82f6"
            speed={2}
            repeat={5}
          >
            LOW REPEAT COUNT •{" "}
          </KineticText>
        </div>
        <div>
          <div style={{ color: "#666", fontSize: 12, marginLeft: 20, marginBottom: 8 }}>
            HIGH REPEAT (50x)
          </div>
          <KineticText
            type="marquee"
            fontSize={40}
            fontFamily="Arial Black, sans-serif"
            color="#ef4444"
            speed={2}
            repeat={50}
          >
            HIGH REPEAT COUNT •{" "}
          </KineticText>
        </div>
      </div>
    </PerformanceWrapper>
  ),
};
