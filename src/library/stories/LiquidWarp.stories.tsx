import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { LiquidWarp, GradientBackground } from "../index";
import type { LiquidWarpProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<LiquidWarpProps> = {
  title: "Motion Library/Transitions/LiquidWarp",
  component: LiquidWarp,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    liquidStyle: {
      control: "select",
      options: ["wave", "ripple", "turbulence", "melt"],
    },
    mode: {
      control: "select",
      options: ["in", "out"],
    },
  },
};

export default meta;
type Story = StoryObj<LiquidWarpProps>;

export const WaveReveal: Story = {
  name: "Wave Distortion",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <LiquidWarp
          liquidStyle="wave"
          mode="in"
          startFrame={5}
          durationInFrames={35}
          intensity={0.6}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#06b6d4", "#3b82f6", "#8b5cf6"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-bold text-white">WAVE</div>
            </div>
          </AbsoluteFill>
        </LiquidWarp>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RippleEffect: Story = {
  name: "Ripple Effect",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LiquidWarp
          liquidStyle="ripple"
          mode="in"
          startFrame={5}
          durationInFrames={40}
          intensity={0.5}
          speed={2}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop"
              alt="Water"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </LiquidWarp>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const TurbulenceReveal: Story = {
  name: "Turbulence",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <LiquidWarp
          liquidStyle="turbulence"
          mode="in"
          startFrame={5}
          durationInFrames={35}
          intensity={0.7}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-rose-500 to-orange-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">CHAOS</div>
            </div>
          </AbsoluteFill>
        </LiquidWarp>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MeltAway: Story = {
  name: "Melt Away",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <LiquidWarp
          liquidStyle="melt"
          mode="out"
          startFrame={15}
          durationInFrames={30}
          intensity={0.8}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-b from-violet-600 to-purple-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-bold text-white">MELT</div>
            </div>
          </AbsoluteFill>
        </LiquidWarp>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SubtleWarp: Story = {
  name: "Subtle Organic",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LiquidWarp
          liquidStyle="wave"
          mode="in"
          startFrame={5}
          durationInFrames={40}
          intensity={0.3}
          speed={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Landscape"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </LiquidWarp>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
