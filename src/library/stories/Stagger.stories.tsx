import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Stagger } from "../index";
import type { StaggerProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<StaggerProps> = {
  title: "Motion Library/Animation/Stagger",
  component: Stagger,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    delay: { control: { type: "number", min: 1, max: 20 } },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 5, max: 60 } },
    direction: {
      control: "select",
      options: ["forward", "reverse", "center-out", "center-in"],
    },
    animation: {
      control: "select",
      options: ["fadeUp", "fadeDown", "fadeIn", "scale", "slideLeft", "slideRight"],
    },
  },
};

export default meta;
type Story = StoryObj<StaggerProps>;

export const FadeUpList: Story = {
  args: {
    delay: 5,
    startFrame: 10,
    durationInFrames: 20,
    direction: "forward",
    animation: "fadeUp",
  },
  render: (args: StaggerProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <Stagger {...args} className="flex flex-col gap-4">
          <div className="rounded-lg bg-violet-600 px-8 py-4 text-white">
            Feature One
          </div>
          <div className="rounded-lg bg-violet-600 px-8 py-4 text-white">
            Feature Two
          </div>
          <div className="rounded-lg bg-violet-600 px-8 py-4 text-white">
            Feature Three
          </div>
          <div className="rounded-lg bg-violet-600 px-8 py-4 text-white">
            Feature Four
          </div>
        </Stagger>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ScaleGrid: Story = {
  args: {
    delay: 3,
    startFrame: 5,
    durationInFrames: 15,
    direction: "forward",
    animation: "scale",
  },
  render: (args: StaggerProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <Stagger {...args} className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-2xl font-bold text-white"
            >
              {i + 1}
            </div>
          ))}
        </Stagger>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CenterOutReveal: Story = {
  args: {
    delay: 4,
    startFrame: 10,
    durationInFrames: 18,
    direction: "center-out",
    animation: "scale",
  },
  render: (args: StaggerProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-black">
        <Stagger {...args} className="flex gap-2">
          {"MOTION".split("").map((char, i) => (
            <span
              key={i}
              className="text-6xl font-black text-white"
            >
              {char}
            </span>
          ))}
        </Stagger>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SlideInCards: Story = {
  args: {
    delay: 6,
    startFrame: 5,
    durationInFrames: 25,
    direction: "forward",
    animation: "slideLeft",
  },
  render: (args: StaggerProps) => (
    <RemotionPreview durationInFrames={150} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Stagger {...args} className="flex gap-6">
          {["Plan", "Build", "Ship"].map((text, i) => (
            <div
              key={i}
              className="flex h-32 w-40 flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur"
            >
              <div className="text-4xl">{["📝", "🔨", "🚀"][i]}</div>
              <div className="mt-2 text-lg font-semibold text-white">{text}</div>
            </div>
          ))}
        </Stagger>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CustomAnimation: Story = {
  args: {
    delay: 4,
    startFrame: 10,
    durationInFrames: 20,
    direction: "forward",
  },
  render: (args: StaggerProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <Stagger
          {...args}
          animation={({ progress }) => ({
            opacity: progress,
            transform: `translateX(${(1 - progress) * 100}px) rotate(${(1 - progress) * 15}deg)`,
          })}
          className="flex flex-col gap-3"
        >
          {["Custom", "Animation", "Function"].map((text, i) => (
            <div
              key={i}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-xl font-bold text-white"
            >
              {text}
            </div>
          ))}
        </Stagger>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
