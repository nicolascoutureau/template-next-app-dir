import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { MaskTransition, GradientBackground } from "../index";
import type { MaskTransitionProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<MaskTransitionProps> = {
  title: "Motion Library/Transitions/MaskTransition",
  component: MaskTransition,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    shape: {
      control: "select",
      options: [
        "blinds-horizontal", "blinds-vertical", "grid", "spiral", "star", 
        "hexagon", "heart", "angular", "radial-bars", "checkerboard"
      ],
    },
  },
};

export default meta;
type Story = StoryObj<MaskTransitionProps>;

export const HorizontalBlinds: Story = {
  name: "Horizontal Blinds",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="blinds-horizontal"
          startFrame={5}
          durationInFrames={35}
          segments={8}
          stagger={0.4}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#ec4899", "#8b5cf6"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">BLINDS</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const VerticalBlinds: Story = {
  name: "Vertical Blinds",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="blinds-vertical"
          startFrame={5}
          durationInFrames={35}
          segments={12}
          stagger={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">VERTICAL</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GridReveal: Story = {
  name: "Grid Reveal",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="grid"
          startFrame={5}
          durationInFrames={40}
          segments={36}
          stagger={0.6}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Mountain"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SpiralReveal: Story = {
  name: "Spiral Reveal",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="spiral"
          startFrame={5}
          durationInFrames={60}
          origin={{ x: 0.5, y: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-violet-600 to-indigo-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">SPIRAL</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const StarBurst: Story = {
  name: "Star Burst",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="star"
          startFrame={5}
          durationInFrames={35}
          origin={{ x: 0.5, y: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-amber-400 to-orange-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl">⭐</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const HexagonReveal: Story = {
  name: "Hexagon Reveal",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <MaskTransition
          shape="hexagon"
          startFrame={5}
          durationInFrames={35}
          origin={{ x: 0.5, y: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-emerald-400 to-teal-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">HEXAGON</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const AngularWipe: Story = {
  name: "Angular Wipe",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="angular"
          startFrame={5}
          durationInFrames={40}
          origin={{ x: 0.5, y: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-rose-500 to-pink-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">ANGULAR</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RadialBars: Story = {
  name: "Radial Bars",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <MaskTransition
          shape="radial-bars"
          startFrame={5}
          durationInFrames={40}
          segments={12}
          stagger={0.3}
          origin={{ x: 0.5, y: 0.5 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-sky-400 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">RADIAL</div>
            </div>
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const Checkerboard: Story = {
  name: "Checkerboard",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <MaskTransition
          shape="checkerboard"
          startFrame={5}
          durationInFrames={40}
          segments={64}
          stagger={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop"
              alt="Night"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </MaskTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
