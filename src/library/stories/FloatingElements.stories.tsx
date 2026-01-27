import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { FloatingElements, GradientBackground, Noise } from "../index";
import type { FloatingElementsProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<FloatingElementsProps> = {
  title: "Motion Library/Background/FloatingElements",
  component: FloatingElements,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    count: { control: { type: "number", min: 5, max: 50 } },
    speed: { control: { type: "range", min: 0.1, max: 2, step: 0.1 } },
    blur: { control: "boolean" },
    seed: { control: { type: "number" } },
  },
};

export default meta;
type Story = StoryObj<FloatingElementsProps>;

export const BasicCircles: Story = {
  args: {
    count: 15,
    shapes: ["circle"],
    colors: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.15)"],
    sizeRange: [20, 60],
    speed: 0.5,
    blur: false,
    seed: 42,
  },
  render: (args: FloatingElementsProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground
          type="linear"
          colors={["#1e1b4b", "#312e81"]}
          width={800}
          height={450}
        />
        <FloatingElements {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white">Ambient Motion</div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MixedShapesWithBlur: Story = {
  args: {
    count: 20,
    shapes: ["circle", "ring", "dot"],
    colors: [
      "rgba(139, 92, 246, 0.2)",
      "rgba(236, 72, 153, 0.2)",
      "rgba(59, 130, 246, 0.2)",
    ],
    sizeRange: [30, 100],
    speed: 0.4,
    blur: true,
    seed: 123,
  },
  render: (args: FloatingElementsProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <FloatingElements {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">Depth Effect</div>
            <div className="mt-2 text-xl text-white/60">
              Blurred elements create depth
            </div>
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ColorfulBlobs: Story = {
  args: {
    count: 12,
    shapes: ["blob"],
    colors: [
      "rgba(251, 191, 36, 0.3)",
      "rgba(249, 115, 22, 0.3)",
      "rgba(239, 68, 68, 0.3)",
    ],
    sizeRange: [50, 150],
    speed: 0.3,
    blur: true,
    seed: 456,
  },
  render: (args: FloatingElementsProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="bg-slate-900">
        <FloatingElements {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-white drop-shadow-lg">
            Organic Blobs
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SubtleRings: Story = {
  args: {
    count: 8,
    shapes: ["ring"],
    colors: ["rgba(255, 255, 255, 0.08)"],
    sizeRange: [80, 200],
    speed: 0.2,
    blur: false,
    seed: 789,
  },
  render: (args: FloatingElementsProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground
          type="radial"
          colors={["#0f172a", "#020617"]}
          width={800}
          height={450}
        />
        <FloatingElements {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white">SAAS</div>
            <div className="mt-4 text-xl text-white/50">
              Modern product video style
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const DenseParticles: Story = {
  args: {
    count: 40,
    shapes: ["dot", "circle"],
    colors: ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.1)"],
    sizeRange: [5, 20],
    speed: 0.8,
    blur: true,
    seed: 999,
  },
  render: (args: FloatingElementsProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <FloatingElements {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white">Particle Field</div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
