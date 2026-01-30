import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  VignetteBlur,
  CinematicBlur,
  DreamyBlur,
  SubtleVignette,
  TunnelVision,
} from "../../remotion/base/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof VignetteBlur> = {
  title: "Effects/VignetteBlur",
  component: VignetteBlur,
  argTypes: {
    blurAmount: { control: { type: "range", min: 0, max: 50, step: 1 } },
    clearRadius: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    falloff: { control: { type: "range", min: 0.5, max: 5, step: 0.1 } },
    layers: { control: { type: "range", min: 2, max: 10, step: 1 } },
    shape: { control: "select", options: ["circle", "ellipse"] },
    centerX: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    centerY: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    animate: { control: "boolean" },
    animationType: {
      control: "select",
      options: ["pulse", "breathe", "fadeIn", "fadeOut"],
    },
    animationSpeed: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    tintOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
};

export default meta;
type Story = StoryObj<typeof VignetteBlur>;

// Sample content component
const SampleContent = () => (
  <AbsoluteFill
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
        padding: 40,
      }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: `hsl(${(i * 22) % 360}, 70%, 60%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// Image content for more realistic demo
const ImageContent = () => (
  <AbsoluteFill>
    <img
      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
      alt="Mountain landscape"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </AbsoluteFill>
);

export const Default: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur blurAmount={20} clearRadius={0.3}>
      <SampleContent />
    </VignetteBlur>
  ),
};

export const WithPhoto: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur blurAmount={25} clearRadius={0.35} layers={6}>
      <ImageContent />
    </VignetteBlur>
  ),
};

export const Animated: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur
      blurAmount={30}
      clearRadius={0.25}
      animate
      animationType="breathe"
      animationSpeed={0.8}
    >
      <SampleContent />
    </VignetteBlur>
  ),
};

export const FadeInEffect: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur
      blurAmount={35}
      clearRadius={0.3}
      animate
      animationType="fadeIn"
    >
      <ImageContent />
    </VignetteBlur>
  ),
};

export const WithTint: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur
      blurAmount={25}
      clearRadius={0.3}
      tintColor="#000000"
      tintOpacity={0.4}
    >
      <ImageContent />
    </VignetteBlur>
  ),
};

export const OffCenterFocus: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur
      blurAmount={30}
      clearRadius={0.25}
      centerX={0.3}
      centerY={0.4}
    >
      <ImageContent />
    </VignetteBlur>
  ),
};

export const CircularShape: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur blurAmount={25} clearRadius={0.3} shape="circle">
      <SampleContent />
    </VignetteBlur>
  ),
};

export const HighFalloff: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <VignetteBlur blurAmount={30} clearRadius={0.35} falloff={4} layers={8}>
      <SampleContent />
    </VignetteBlur>
  ),
};

// Preset examples
export const CinematicPreset: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CinematicBlur>
      <ImageContent />
    </CinematicBlur>
  ),
};

export const DreamyPreset: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <DreamyBlur>
      <ImageContent />
    </DreamyBlur>
  ),
};

export const SubtlePreset: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <SubtleVignette>
      <SampleContent />
    </SubtleVignette>
  ),
};

export const TunnelVisionPreset: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <TunnelVision>
      <ImageContent />
    </TunnelVision>
  ),
};

// Combined example with text overlay
export const WithTextOverlay: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <>
      <VignetteBlur
        blurAmount={30}
        clearRadius={0.35}
        tintColor="#000"
        tintOpacity={0.2}
      >
        <ImageContent />
      </VignetteBlur>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Discover
        </span>
        <span
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          FOCUS
        </span>
      </AbsoluteFill>
    </>
  ),
};
