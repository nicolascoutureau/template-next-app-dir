import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { BlurTransition, RackFocus, GradientBackground } from "../index";
import type { BlurTransitionProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<BlurTransitionProps> = {
  title: "Motion Library/Transitions/BlurTransition",
  component: BlurTransition,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["focus", "defocus", "rack", "motion"],
    },
  },
};

export default meta;
type Story = StoryObj<BlurTransitionProps>;

export const FocusIn: Story = {
  name: "Focus In (Blur → Sharp)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <BlurTransition
          type="focus"
          startFrame={5}
          durationInFrames={30}
          maxBlur={20}
          breathe
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
              <div className="text-6xl font-bold text-white">FOCUS</div>
            </div>
          </AbsoluteFill>
        </BlurTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const Defocus: Story = {
  name: "Defocus (Sharp → Blur)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <BlurTransition
          type="defocus"
          startFrame={15}
          durationInFrames={30}
          maxBlur={25}
          breathe
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-amber-400 to-orange-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">DEFOCUS</div>
            </div>
          </AbsoluteFill>
        </BlurTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RackFocusExample: Story = {
  name: "Rack Focus (Subject A → Subject B)",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <RackFocus
          from={
            <AbsoluteFill className="flex items-center justify-center">
              <div className="text-[12rem] font-black text-white/90">A</div>
            </AbsoluteFill>
          }
          to={
            <AbsoluteFill>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
                alt="Mountain"
                className="h-full w-full object-cover"
              />
            </AbsoluteFill>
          }
          startFrame={20}
          durationInFrames={40}
          maxBlur={20}
          breathe
          breatheAmount={0.04}
          style={{ position: "absolute", inset: 0 }}
        />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RackFocusTextReveal: Story = {
  name: "Rack Focus Text Reveal",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <RackFocus
          from={
            <AbsoluteFill className="flex items-center justify-center">
              <div className="text-6xl font-light text-white/60 tracking-widest">LOOK CLOSER</div>
            </AbsoluteFill>
          }
          to={
            <AbsoluteFill className="flex items-center justify-center">
              <div className="text-8xl font-black text-white">REVEAL</div>
            </AbsoluteFill>
          }
          startFrame={15}
          durationInFrames={35}
          maxBlur={25}
          breathe
          style={{ position: "absolute", inset: 0 }}
        />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RackFocusCinematic: Story = {
  name: "Cinematic Rack Focus",
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <RackFocus
          from={
            <AbsoluteFill>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop"
                alt="Beach"
                className="h-full w-full object-cover opacity-80"
              />
            </AbsoluteFill>
          }
          to={
            <AbsoluteFill>
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop"
                alt="Night sky"
                className="h-full w-full object-cover"
              />
            </AbsoluteFill>
          }
          startFrame={30}
          durationInFrames={50}
          maxBlur={30}
          breathe
          breatheAmount={0.05}
          style={{ position: "absolute", inset: 0 }}
        />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MotionBlur: Story = {
  name: "Motion Blur (Directional)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <BlurTransition
          type="motion"
          startFrame={5}
          durationInFrames={25}
          maxBlur={30}
          motionAngle={0}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">SPEED</div>
            </div>
          </AbsoluteFill>
        </BlurTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CinematicFocus: Story = {
  name: "Cinematic Focus Pull",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <BlurTransition
          type="focus"
          startFrame={10}
          durationInFrames={40}
          maxBlur={30}
          breathe
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop"
              alt="Night sky"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </BlurTransition>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
