import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { useStagger } from "../index";
import { AbsoluteFill } from "remotion";

// Demo component for stagger hook
const StaggerDemo = ({
  count,
  delay,
  durationInFrames,
}: {
  count: number;
  delay: number;
  durationInFrames: number;
}) => {
  const { progress, activeIndex } = useStagger({
    count,
    delay,
    startFrame: 10,
    durationInFrames,
  });

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg px-6 py-3 text-white transition-colors ${
            i === activeIndex ? "bg-violet-500" : "bg-violet-600/80"
          }`}
          style={{
            opacity: progress[i],
            transform: `translateX(${(1 - progress[i]) * 50}px)`,
          }}
        >
          Item {i + 1} — Progress: {progress[i].toFixed(2)}
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: "Motion Library/Hooks/useStagger",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    count: { control: { type: "number", min: 3, max: 10 } },
    delay: { control: { type: "number", min: 2, max: 15 } },
    durationInFrames: { control: { type: "number", min: 10, max: 40 } },
  },
};

export default meta;
type Story = StoryObj<{
  count: number;
  delay: number;
  durationInFrames: number;
}>;

export const BasicStagger: Story = {
  args: {
    count: 5,
    delay: 5,
    durationInFrames: 20,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={150} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <StaggerDemo {...args} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Grid demo
const GridStaggerDemo = ({
  cols,
  delay,
}: {
  cols: number;
  delay: number;
}) => {
  const count = cols * cols;
  const { progress } = useStagger({
    count,
    delay,
    startFrame: 5,
    durationInFrames: 15,
  });

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-lg font-bold text-white"
          style={{
            opacity: progress[i],
            transform: `scale(${0.5 + progress[i] * 0.5})`,
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export const GridStagger: Story = {
  args: {
    cols: 4,
    delay: 3,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <GridStaggerDemo cols={args.cols} delay={args.delay} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Stats demo
const StatsDemo = () => {
  const { progress } = useStagger({
    count: 4,
    delay: 8,
    startFrame: 15,
    durationInFrames: 25,
  });

  const stats = [
    { label: "Users", value: "10K+" },
    { label: "Downloads", value: "50K+" },
    { label: "Countries", value: "120+" },
    { label: "Rating", value: "4.9" },
  ];

  return (
    <div className="flex gap-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="text-center"
          style={{
            opacity: progress[i],
            transform: `translateY(${(1 - progress[i]) * 30}px)`,
          }}
        >
          <div className="text-4xl font-bold text-white">{stat.value}</div>
          <div className="mt-1 text-white/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export const StatsReveal: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <StatsDemo />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
