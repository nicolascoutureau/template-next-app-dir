import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { RevealMask, GradientBackground } from "../index";
import type { RevealMaskProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<RevealMaskProps> = {
  title: "Motion Library/Transitions/RevealMask",
  component: RevealMask,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["circle", "wipe", "diagonal", "iris", "diamond"],
    },
    direction: {
      control: "select",
      options: ["left", "right", "up", "down"],
    },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 90 } },
    invert: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<RevealMaskProps>;

export const CircleReveal: Story = {
  args: {
    type: "circle",
    origin: { x: 0.5, y: 0.5 },
    startFrame: 10,
    durationInFrames: 30,
    invert: false,
    style: { position: "absolute", inset: 0 },
  },
  render: (args: RevealMaskProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <RevealMask {...args}>
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#ec4899", "#8b5cf6"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-white">REVEALED</div>
            </div>
          </AbsoluteFill>
        </RevealMask>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const WipeReveal: Story = {
  args: {
    type: "wipe",
    direction: "left",
    startFrame: 10,
    durationInFrames: 25,
    style: { position: "absolute", inset: 0 },
  },
  render: (args: RevealMaskProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-900">
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-white/30">
          Before
        </div>
        <RevealMask {...args}>
          <AbsoluteFill className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-white">After</div>
            </div>
          </AbsoluteFill>
        </RevealMask>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const DiagonalReveal: Story = {
  args: {
    type: "diagonal",
    startFrame: 15,
    durationInFrames: 30,
    style: { position: "absolute", inset: 0 },
  },
  render: (args: RevealMaskProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <RevealMask {...args}>
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop"
              alt="Abstract"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </RevealMask>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const DiamondReveal: Story = {
  args: {
    type: "diamond",
    origin: { x: 0.5, y: 0.5 },
    startFrame: 10,
    durationInFrames: 40,
    style: { position: "absolute", inset: 0 },
  },
  render: (args: RevealMaskProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <RevealMask {...args}>
          <AbsoluteFill className="bg-gradient-to-br from-amber-400 to-orange-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">✦</div>
            </div>
          </AbsoluteFill>
        </RevealMask>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CornerCircleReveal: Story = {
  args: {
    type: "circle",
    origin: { x: 0, y: 0 },
    startFrame: 5,
    durationInFrames: 35,
    style: { position: "absolute", inset: 0 },
  },
  render: (args: RevealMaskProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <RevealMask {...args}>
          <AbsoluteFill className="bg-gradient-to-br from-green-400 to-emerald-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                From Top Left
              </div>
            </div>
          </AbsoluteFill>
        </RevealMask>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
