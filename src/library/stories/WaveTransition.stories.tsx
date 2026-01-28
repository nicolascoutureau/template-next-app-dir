import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { WaveTransition, GradientBackground } from "../index";
import type { WaveTransitionProps } from "../index";
import { AbsoluteFill, Easing } from "remotion";

const meta: Meta<WaveTransitionProps> = {
  title: "Motion Library/Transitions/WaveTransition",
  component: WaveTransition,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    waveStyle: {
      control: "select",
      options: ["smooth", "organic", "liquid", "silk", "pulse"],
    },
    direction: {
      control: "select",
      options: ["left", "right", "up", "down"],
    },
    mode: {
      control: "select",
      options: ["in", "out"],
    },
    amplitude: {
      control: { type: "range", min: 5, max: 30, step: 1 },
    },
    frequency: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
    },
    flowSpeed: {
      control: { type: "range", min: 0, max: 5, step: 0.5 },
    },
  },
};

export default meta;
type Story = StoryObj<WaveTransitionProps>;

export const SmoothWave: Story = {
  name: "Smooth Sine Wave",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <WaveTransition
          waveStyle="smooth"
          direction="left"
          startFrame={10}
          durationInFrames={60}
          amplitude={15}
          frequency={1}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-bold text-white tracking-tight">SMOOTH</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const OrganicWave: Story = {
  name: "Organic Natural",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <WaveTransition
          waveStyle="organic"
          direction="left"
          startFrame={10}
          durationInFrames={60}
          amplitude={20}
          frequency={1.2}
          flowSpeed={1.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Mountain"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const LiquidWave: Story = {
  name: "Liquid Blob",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <WaveTransition
          waveStyle="liquid"
          direction="right"
          startFrame={10}
          durationInFrames={60}
          amplitude={18}
          frequency={0.8}
          flowSpeed={2}
          easing={Easing.out(Easing.quad)}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">LIQUID</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SilkWave: Story = {
  name: "Silk Fabric",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <WaveTransition
          waveStyle="silk"
          direction="up"
          startFrame={10}
          durationInFrames={60}
          amplitude={12}
          frequency={1.5}
          flowSpeed={1}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-t from-rose-400 via-fuchsia-500 to-indigo-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-light text-white tracking-widest">SILK</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const PulseWave: Story = {
  name: "Breathing Pulse",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <WaveTransition
          waveStyle="pulse"
          direction="down"
          startFrame={10}
          durationInFrames={60}
          amplitude={15}
          frequency={1.2}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-b from-emerald-400 to-teal-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-bold text-white">PULSE</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const FlowingLiquid: Story = {
  name: "Flowing Liquid",
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <WaveTransition
          waveStyle="liquid"
          direction="left"
          startFrame={10}
          durationInFrames={80}
          amplitude={22}
          frequency={0.7}
          flowSpeed={3}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl font-black text-white">FLOW</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SubtleImageReveal: Story = {
  name: "Subtle Image Reveal",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <WaveTransition
          waveStyle="smooth"
          direction="left"
          startFrame={10}
          durationInFrames={60}
          amplitude={8}
          frequency={0.8}
          easing={Easing.bezier(0.33, 1, 0.68, 1)}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop"
              alt="Beach"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const VerticalSilk: Story = {
  name: "Vertical Silk Rise",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <WaveTransition
          waveStyle="silk"
          direction="up"
          startFrame={10}
          durationInFrames={60}
          amplitude={14}
          frequency={1.2}
          flowSpeed={2}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop"
              alt="Fog forest"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CinematicReveal: Story = {
  name: "Cinematic Reveal",
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <WaveTransition
          waveStyle="organic"
          direction="right"
          startFrame={15}
          durationInFrames={75}
          amplitude={25}
          frequency={0.6}
          flowSpeed={1}
          easing={Easing.bezier(0.22, 1, 0.36, 1)}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c036bc3c34?w=800&h=450&fit=crop"
              alt="Cityscape"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
              <div className="text-5xl font-bold text-white">CINEMATIC</div>
              <div className="text-xl text-white/70 mt-2">Professional Motion Design</div>
            </div>
          </AbsoluteFill>
        </WaveTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
