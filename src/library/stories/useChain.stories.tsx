import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { useChain } from "../index";
import { AbsoluteFill, Easing } from "remotion";

// Demo component showing chain segments
const ChainDemo = () => {
  const { activeLabel, segmentProgress, progress } = useChain({
    segments: [
      { duration: 20, label: "enter", easing: Easing.out(Easing.cubic) },
      { duration: 40, label: "hold" },
      { duration: 20, label: "exit", easing: Easing.in(Easing.cubic) },
    ],
    startFrame: 10,
  });

  const opacity =
    activeLabel === "enter"
      ? segmentProgress
      : activeLabel === "exit"
        ? 1 - segmentProgress
        : 1;

  const scale =
    activeLabel === "enter"
      ? 0.8 + segmentProgress * 0.2
      : activeLabel === "exit"
        ? 1 - segmentProgress * 0.2
        : 1;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="flex h-40 w-64 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl"
        style={{ opacity, transform: `scale(${scale})` }}
      >
        <div className="text-2xl font-bold">Content</div>
        <div className="mt-2 text-sm opacity-80">Enter → Hold → Exit</div>
      </div>

      <div className="text-center text-white">
        <div className="text-lg">
          Segment: <span className="font-bold text-violet-400">{activeLabel}</span>
        </div>
        <div className="mt-1 text-sm text-white/60">
          Segment Progress: {segmentProgress.toFixed(2)} | Total:{" "}
          {progress.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Motion Library/Hooks/useChain",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const EnterHoldExit: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <ChainDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Multi-step demo
const MultiStepDemo = () => {
  const { activeLabel, segmentProgress, activeIndex } = useChain({
    segments: [
      { duration: 15, label: "step1" },
      { duration: 15, label: "step2" },
      { duration: 15, label: "step3" },
      { duration: 15, label: "step4" },
      { duration: 30, label: "complete" },
    ],
    startFrame: 5,
  });

  const steps = ["Plan", "Build", "Test", "Ship"];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        {steps.map((step, i) => {
          const isActive = activeIndex === i;
          const isComplete = activeIndex > i;
          const progress = isActive ? segmentProgress : isComplete ? 1 : 0;

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-colors ${
                  isComplete
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-violet-500 text-white"
                      : "bg-slate-700 text-white/50"
                }`}
                style={{
                  transform: `scale(${isActive ? 1 + progress * 0.1 : 1})`,
                }}
              >
                {isComplete ? "✓" : i + 1}
              </div>
              <div
                className={`text-sm ${isComplete || isActive ? "text-white" : "text-white/50"}`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {activeLabel === "complete" && (
        <div
          className="text-2xl font-bold text-green-400"
          style={{ opacity: segmentProgress }}
        >
          All Steps Complete! 🎉
        </div>
      )}
    </div>
  );
};

export const MultiStepSequence: Story = {
  render: () => (
    <RemotionPreview durationInFrames={150} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <MultiStepDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Text reveal demo
const TextRevealDemo = () => {
  const { getSegmentProgress } = useChain({
    segments: [
      { duration: 20, label: "line1", easing: Easing.out(Easing.cubic) },
      { duration: 20, label: "line2", easing: Easing.out(Easing.cubic) },
      { duration: 20, label: "line3", easing: Easing.out(Easing.cubic) },
    ],
    startFrame: 10,
  });

  const lines = [
    "Design systems",
    "for motion design",
    "made simple.",
  ];

  return (
    <div className="text-center">
      {lines.map((line, i) => {
        const progress = getSegmentProgress(`line${i + 1}`);
        return (
          <div
            key={i}
            className="text-4xl font-bold text-white"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 20}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

export const SequentialTextReveal: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <TextRevealDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
