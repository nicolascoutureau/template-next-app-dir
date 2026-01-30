import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  FourColorGradient,
  AuroraGradient,
  SunsetGradient,
  OceanGradient,
  NeonGradient,
  CandyGradient,
  gradientPositions,
  gradientPalettes,
} from "../../remotion/library/components/effects/FourColorGradient";
import { TextAnimation } from "../../remotion/library/components/text/TextAnimation";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof FourColorGradient> = {
  title: "Effects/FourColorGradient",
  component: FourColorGradient,
  argTypes: {
    palette: {
      control: "select",
      options: Object.keys(gradientPalettes),
    },
    animationType: {
      control: "select",
      options: ["rotate", "pulse", "shift", "wave"],
    },
    blend: {
      control: { type: "range", min: 30, max: 100, step: 5 },
    },
    speed: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
    },
    noise: {
      control: { type: "range", min: 0, max: 0.5, step: 0.05 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FourColorGradient>;

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

export const Default: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  args: {
    palette: "aurora",
    blend: 70,
  },
  render: (args) => <FourColorGradient {...args} />,
};

export const CustomColors: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      topLeft="#d8e0e8"
      topRight="#c8d0d8"
      bottomLeft="#e0d8e0"
      bottomRight="#d0d0e0"
      blend={80}
    />
  ),
};

// ============================================================================
// PALETTE GALLERY
// ============================================================================

export const PaletteGallery: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const palettes = Object.keys(gradientPalettes) as Array<
      keyof typeof gradientPalettes
    >;

    return (
      <AbsoluteFill style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            height: "100%",
          }}
        >
          {palettes.map((palette) => (
            <div
              key={palette}
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <FourColorGradient palette={palette} />
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  textTransform: "capitalize",
                }}
              >
                {palette}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

// ============================================================================
// ANIMATED EXAMPLES - Subtle and Professional
// ============================================================================

export const SubtleRotate: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="lavender"
      animate
      animationType="rotate"
      speed={0.08}
      blend={85}
    />
  ),
};

export const GentlePulse: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="neutral"
      animate
      animationType="pulse"
      speed={0.1}
      blend={80}
    />
  ),
};

export const SoftShift: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="corporate"
      animate
      animationType="shift"
      speed={0.06}
      blend={85}
    />
  ),
};

export const CalmWave: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="sage"
      animate
      animationType="wave"
      speed={0.08}
      blend={85}
    />
  ),
};

// ============================================================================
// PRESET COMPONENTS - Professional Use Cases
// ============================================================================

export const CorporateBackground: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="corporate"
      animate
      animationType="shift"
      speed={0.05}
      blend={85}
    />
  ),
};

export const ElegantNeutral: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="neutral"
      animate
      animationType="pulse"
      speed={0.06}
      blend={85}
    />
  ),
};

export const SoftLavender: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="lavender"
      animate
      animationType="wave"
      speed={0.07}
      blend={85}
    />
  ),
};

export const NaturalSage: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#1a1a1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="sage"
      animate
      animationType="rotate"
      speed={0.04}
      blend={85}
    />
  ),
};

export const DeepMidnight: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#0a0a0a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <FourColorGradient
      palette="midnight"
      animate
      animationType="shift"
      speed={0.05}
      blend={80}
    />
  ),
};

// ============================================================================
// POSITION PRESETS
// ============================================================================

export const PositionPresets: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const positionPresets = [
      { name: "Corners", positions: gradientPositions.corners },
      { name: "Edges", positions: gradientPositions.edges },
      { name: "Diamond", positions: gradientPositions.diamond },
      { name: "Centered", positions: gradientPositions.centered },
    ];

    return (
      <AbsoluteFill style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            height: "100%",
          }}
        >
          {positionPresets.map(({ name, positions }) => (
            <div
              key={name}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <FourColorGradient palette="aurora" positions={positions} />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

// ============================================================================
// BLEND COMPARISON
// ============================================================================

export const BlendComparison: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const blends = [40, 55, 70, 85, 100];

    return (
      <AbsoluteFill style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            height: "100%",
          }}
        >
          {blends.map((blend) => (
            <div
              key={blend}
              style={{
                flex: 1,
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <FourColorGradient palette="sunset" blend={blend} />
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {blend}%
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};

// ============================================================================
// WITH NOISE
// ============================================================================

export const WithNoise: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill style={{ display: "flex", gap: 20, padding: 20 }}>
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <FourColorGradient palette="midnight" noise={0} />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 12,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          No Noise
        </div>
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <FourColorGradient palette="midnight" noise={0.15} />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 12,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          15% Noise
        </div>
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <FourColorGradient palette="midnight" noise={0.3} />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 12,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          30% Noise
        </div>
      </div>
    </AbsoluteFill>
  ),
};

// ============================================================================
// WITH CONTENT
// ============================================================================

export const WithText: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AuroraGradient>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <TextAnimation
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.from(split.chars, {
              opacity: 0,
              y: 50,
              rotateX: -90,
              duration: 0.6,
              stagger: 0.04,
              ease: "back.out(1.7)",
            });
            return tl;
          }}
        >
          Beautiful
        </TextAnimation>
        <TextAnimation
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.8)",
          }}
          createTimeline={({ textRef, tl }) => {
            tl.from(textRef.current, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              delay: 0.5,
            });
            return tl;
          }}
        >
          4-Color Gradient Background
        </TextAnimation>
      </AbsoluteFill>
    </AuroraGradient>
  ),
};

// ============================================================================
// ANIMATION COMPARISON
// ============================================================================

export const AnimationComparison: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0f0f1a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const animations = [
      { name: "Rotate", type: "rotate" as const },
      { name: "Pulse", type: "pulse" as const },
      { name: "Shift", type: "shift" as const },
      { name: "Wave", type: "wave" as const },
    ];

    return (
      <AbsoluteFill style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            height: "100%",
          }}
        >
          {animations.map(({ name, type }) => (
            <div
              key={name}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <FourColorGradient
                palette="candy"
                animate
                animationType={type}
                speed={0.4}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  },
};
