import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { useLoopProgress, useLoop } from "../index";
import { AbsoluteFill } from "remotion";

// Rotating element demo
const RotatingDemo = ({ durationInFrames }: { durationInFrames: number }) => {
  const progress = useLoopProgress({ durationInFrames });
  const rotation = progress * 360;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span className="text-3xl">↻</span>
      </div>
      <div className="text-white/60">
        Progress: {progress.toFixed(2)} | Rotation: {rotation.toFixed(0)}°
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Motion Library/Hooks/useLoopProgress",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    durationInFrames: { control: { type: "number", min: 15, max: 120 } },
  },
};

export default meta;
type Story = StoryObj<{ durationInFrames: number }>;

export const ContinuousRotation: Story = {
  args: {
    durationInFrames: 60,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <RotatingDemo durationInFrames={args.durationInFrames} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Pulsing demo
const PulsingDemo = ({ durationInFrames }: { durationInFrames: number }) => {
  const progress = useLoopProgress({ durationInFrames });
  // Use sine for smooth pulsing
  const pulse = Math.sin(progress * Math.PI * 2);
  const scale = 1 + pulse * 0.15;
  const opacity = 0.6 + pulse * 0.4;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-2xl"
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <span className="text-4xl">♥</span>
      </div>
      <div className="text-white/60">
        Scale: {scale.toFixed(2)} | Opacity: {opacity.toFixed(2)}
      </div>
    </div>
  );
};

export const PulsingEffect: Story = {
  args: {
    durationInFrames: 30,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <PulsingDemo durationInFrames={args.durationInFrames} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Gradient cycling demo
const GradientCycleDemo = () => {
  const progress = useLoop(90);
  
  // Cycle through hue
  const hue = progress * 360;
  const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 40%))`;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="flex h-48 w-80 items-center justify-center rounded-2xl text-white shadow-xl"
        style={{ background: gradient }}
      >
        <span className="text-2xl font-bold">Color Cycling</span>
      </div>
      <div className="text-white/60">
        Hue: {hue.toFixed(0)}°
      </div>
    </div>
  );
};

export const GradientCycle: Story = {
  render: () => (
    <RemotionPreview durationInFrames={180} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <GradientCycleDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Loading spinner demo
const LoadingDemo = () => {
  const progress = useLoop(45);
  const rotation = progress * 360;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative h-24 w-24">
        <div
          className="absolute inset-0 rounded-full border-4 border-violet-500/20"
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <div className="text-lg text-white">Loading...</div>
    </div>
  );
};

export const LoadingSpinner: Story = {
  render: () => (
    <RemotionPreview durationInFrames={180} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <LoadingDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Multiple synced loops
const SyncedLoopsDemo = () => {
  const fast = useLoop(30);
  const medium = useLoop(60);
  const slow = useLoop(90);

  return (
    <div className="flex gap-8">
      {[
        { progress: fast, label: "Fast (30f)", color: "from-red-500 to-orange-500" },
        { progress: medium, label: "Medium (60f)", color: "from-green-500 to-emerald-500" },
        { progress: slow, label: "Slow (90f)", color: "from-blue-500 to-cyan-500" },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
            style={{ transform: `rotate(${item.progress * 360}deg)` }}
          >
            ↻
          </div>
          <div className="text-center">
            <div className="text-sm text-white">{item.label}</div>
            <div className="text-xs text-white/50">
              {(item.progress * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MultipleLoops: Story = {
  render: () => (
    <RemotionPreview durationInFrames={180} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <SyncedLoopsDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
