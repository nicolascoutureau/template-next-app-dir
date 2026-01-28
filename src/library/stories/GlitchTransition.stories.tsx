import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { GlitchTransition, GradientBackground } from "../index";
import type { GlitchTransitionProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<GlitchTransitionProps> = {
  title: "Motion Library/Transitions/GlitchTransition",
  component: GlitchTransition,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    intensity: {
      control: "select",
      options: ["subtle", "medium", "intense", "chaos"],
    },
    mode: {
      control: "select",
      options: ["in", "out"],
    },
  },
};

export default meta;
type Story = StoryObj<GlitchTransitionProps>;

export const SubtleGlitch: Story = {
  name: "Subtle Glitch",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <GlitchTransition
          mode="in"
          startFrame={5}
          durationInFrames={25}
          intensity="subtle"
          rgbSplit
          scanLines
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-violet-600 to-indigo-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white font-mono">GLITCH</div>
            </div>
          </AbsoluteFill>
        </GlitchTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const IntenseGlitch: Story = {
  name: "Intense Glitch",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <GlitchTransition
          mode="in"
          startFrame={5}
          durationInFrames={30}
          intensity="intense"
          rgbSplit
          scanLines
          sliceDisplacement
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-red-600 to-pink-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">ERROR</div>
            </div>
          </AbsoluteFill>
        </GlitchTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ChaosGlitch: Story = {
  name: "Chaos Mode",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <GlitchTransition
          mode="in"
          startFrame={5}
          durationInFrames={35}
          intensity="chaos"
          rgbSplit
          scanLines
          sliceDisplacement
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-cyan-400 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl font-black text-white">404</div>
            </div>
          </AbsoluteFill>
        </GlitchTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GlitchOut: Story = {
  name: "Glitch Out",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <GlitchTransition
          mode="out"
          startFrame={20}
          durationInFrames={25}
          intensity="medium"
          rgbSplit
          scanLines
          sliceDisplacement
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">DISCONNECT</div>
            </div>
          </AbsoluteFill>
        </GlitchTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RGBSplitOnly: Story = {
  name: "RGB Split Only",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <GlitchTransition
          mode="in"
          startFrame={5}
          durationInFrames={30}
          intensity="medium"
          rgbSplit
          scanLines={false}
          sliceDisplacement={false}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="flex items-center justify-center">
            <div className="text-8xl font-black text-white">RGB</div>
          </AbsoluteFill>
        </GlitchTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
