import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { SlideTransition, GradientBackground } from "../index";
import type { SlideTransitionProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<SlideTransitionProps> = {
  title: "Motion Library/Transitions/SlideTransition",
  component: SlideTransition,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    effect: {
      control: "select",
      options: ["smooth", "elastic", "bounce", "overshoot", "spring", "momentum"],
    },
    direction: {
      control: "select",
      options: ["left", "right", "up", "down"],
    },
  },
};

export default meta;
type Story = StoryObj<SlideTransitionProps>;

export const ElasticSlide: Story = {
  name: "Elastic Slide",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="left"
          effect="elastic"
          startFrame={10}
          durationInFrames={50}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#f43f5e", "#ec4899"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">ELASTIC</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const BounceSlide: Story = {
  name: "Bounce Slide",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="down"
          effect="bounce"
          startFrame={10}
          durationInFrames={50}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-b from-amber-400 to-orange-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">BOUNCE</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SpringPhysics: Story = {
  name: "Spring Physics",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="right"
          effect="spring"
          startFrame={10}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-emerald-400 to-teal-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">SPRING</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MotionBlurSlide: Story = {
  name: "Motion Blur Slide",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="left"
          effect="momentum"
          startFrame={5}
          durationInFrames={25}
          motionBlur
          blurIntensity={0.8}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">SPEED</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const TiltSlide: Story = {
  name: "3D Tilt Slide",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="left"
          effect="smooth"
          startFrame={10}
          durationInFrames={40}
          rotate
          rotateAmount={25}
          scale
          scaleAmount={0.85}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-violet-600 to-purple-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">3D TILT</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ShadowSlide: Story = {
  name: "Shadow Slide",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-900 overflow-hidden">
        <SlideTransition
          direction="up"
          effect="overshoot"
          startFrame={10}
          durationInFrames={40}
          shadow
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-slate-900">SHADOW</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SlideOutBounce: Story = {
  name: "Slide Out (Bounce)",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950 overflow-hidden">
        <SlideTransition
          direction="right"
          effect="elastic"
          mode="out"
          startFrame={30}
          durationInFrames={40}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-rose-500 to-red-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">GOODBYE</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const FullFeatured: Story = {
  name: "Full Featured",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black overflow-hidden">
        <SlideTransition
          direction="left"
          effect="elastic"
          startFrame={10}
          durationInFrames={50}
          motionBlur
          blurIntensity={0.5}
          rotate
          rotateAmount={15}
          scale
          scaleAmount={0.9}
          shadow
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Mountain"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-5xl font-bold text-white">CINEMATIC</div>
            </div>
          </AbsoluteFill>
        </SlideTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
