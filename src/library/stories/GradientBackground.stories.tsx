import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { GradientBackground, Noise } from "../index";
import type { GradientBackgroundProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<GradientBackgroundProps> = {
  title: "Motion Library/Background/GradientBackground",
  component: GradientBackground,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["linear", "radial", "conic", "mesh"],
    },
    angle: { control: { type: "number", min: 0, max: 360 } },
    animate: { control: "boolean" },
    animationType: {
      control: "select",
      options: ["rotate", "shift", "breathe", "aurora"],
    },
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<GradientBackgroundProps>;

export const LinearGradient: Story = {
  args: {
    type: "linear",
    colors: ["#667eea", "#764ba2"],
    angle: 135,
    animate: false,
  },
  render: (args: GradientBackgroundProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white">Linear Gradient</div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RotatingGradient: Story = {
  args: {
    type: "conic",
    colors: ["#ff0080", "#7928ca", "#ff0080"],
    animate: true,
    animationType: "rotate",
    speed: 1,
  },
  render: (args: GradientBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Rotating Conic
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MeshGradient: Story = {
  args: {
    type: "mesh",
    meshPoints: [
      { x: 20, y: 20, color: "#667eea", blur: 40 },
      { x: 80, y: 30, color: "#764ba2", blur: 50 },
      { x: 30, y: 80, color: "#f093fb", blur: 45 },
      { x: 70, y: 70, color: "#f5576c", blur: 40 },
    ],
    animate: true,
    animationType: "aurora",
    speed: 0.5,
  },
  render: (args: GradientBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <div className="absolute inset-0 bg-slate-950" />
        <GradientBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Aurora Mesh
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RadialBreathing: Story = {
  args: {
    type: "radial",
    colors: ["#0ea5e9", "#6366f1", "#1e1b4b"],
    center: [50, 50],
    animate: true,
    animationType: "breathe",
    speed: 0.8,
  },
  render: (args: GradientBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white">Breathing Radial</div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
