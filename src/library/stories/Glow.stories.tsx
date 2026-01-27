import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Glow, Noise } from "../index";
import type { GlowProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<GlowProps> = {
  title: "Motion Library/Effects/Glow",
  component: Glow,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    intensity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    radius: { control: { type: "number", min: 5, max: 100 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    layers: { control: { type: "number", min: 1, max: 5 } },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<GlowProps>;

export const GlowingText: Story = {
  args: {
    intensity: 0.7,
    radius: 30,
    opacity: 0.8,
    layers: 2,
    color: "#3b82f6",
  },
  render: (args: GlowProps) => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <Glow {...args}>
          <div className="text-6xl font-black text-blue-500">GLOW</div>
        </Glow>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const NeonEffect: Story = {
  args: {
    intensity: 1,
    radius: 40,
    opacity: 0.9,
    layers: 3,
    color: "#ff00ff",
  },
  render: (args: GlowProps) => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-black">
        <Glow {...args}>
          <div className="text-7xl font-black tracking-wider text-fuchsia-500">
            NEON
          </div>
        </Glow>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GlowingButton: Story = {
  args: {
    intensity: 0.6,
    radius: 25,
    opacity: 0.7,
    layers: 2,
    color: "#22c55e",
  },
  render: (args: GlowProps) => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <Glow {...args}>
          <button className="rounded-full bg-green-500 px-8 py-4 text-xl font-bold text-white">
            Get Started
          </button>
        </Glow>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MultipleGlows: Story = {
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center gap-8 bg-black">
        <div className="flex gap-12">
          <Glow color="#ef4444" intensity={0.8} radius={30}>
            <div className="text-5xl font-bold text-red-500">RED</div>
          </Glow>
          <Glow color="#22c55e" intensity={0.8} radius={30}>
            <div className="text-5xl font-bold text-green-500">GREEN</div>
          </Glow>
          <Glow color="#3b82f6" intensity={0.8} radius={30}>
            <div className="text-5xl font-bold text-blue-500">BLUE</div>
          </Glow>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SubtleHighlight: Story = {
  args: {
    intensity: 0.3,
    radius: 15,
    opacity: 0.5,
    layers: 1,
    color: "#ffffff",
  },
  render: (args: GlowProps) => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <Glow {...args}>
          <div className="rounded-xl border border-white/20 bg-white/5 px-8 py-6 backdrop-blur">
            <div className="text-2xl font-semibold text-white">
              Subtle Glow Effect
            </div>
            <div className="mt-2 text-white/60">
              Adds depth without being overwhelming
            </div>
          </div>
        </Glow>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
