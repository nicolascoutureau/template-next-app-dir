import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Counter } from "../index";
import type { CounterProps } from "../index";

const meta: Meta<CounterProps> = {
  title: "Motion Library/UI/Counter",
  component: Counter,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    from: { control: "number" },
    to: { control: "number" },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 90 } },
    precision: { control: { type: "number", min: 0, max: 4 } },
    padStart: { control: { type: "number", min: 0, max: 10 } },
    useGrouping: { control: "boolean" },
    prefix: { control: "text" },
    suffix: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<CounterProps>;

export const Default: Story = {
  args: {
    from: 0,
    to: 1280,
    startFrame: 0,
    durationInFrames: 50,
    precision: 0,
    useGrouping: true,
    prefix: "",
    suffix: "",
  },
  render: (args: CounterProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Total Users
        </div>
        <div className="mt-3 text-6xl font-bold text-white">
          <Counter {...args} />
        </div>
      </div>
    </RemotionPreview>
  ),
};

export const WithPrefixSuffix: Story = {
  args: {
    from: 0,
    to: 99,
    durationInFrames: 40,
    prefix: "$",
    suffix: "M",
    useGrouping: false,
  },
  render: (args: CounterProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-5xl font-bold text-emerald-400">
          <Counter {...args} />
        </div>
        <div className="text-sm text-slate-400 mt-2">Revenue</div>
      </div>
    </RemotionPreview>
  ),
};

export const Decimal: Story = {
  args: {
    from: 0,
    to: 4.8,
    durationInFrames: 45,
    precision: 1,
    useGrouping: false,
  },
  render: (args: CounterProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Rating
        </div>
        <div className="mt-3 text-6xl font-bold text-amber-400">
          <Counter {...args} />
        </div>
        <div className="text-slate-500 mt-1">out of 5</div>
      </div>
    </RemotionPreview>
  ),
};

export const Percentage: Story = {
  args: {
    from: 0,
    to: 97,
    durationInFrames: 50,
    precision: 0,
    suffix: "%",
  },
  render: (args: CounterProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-6xl font-bold text-sky-400">
          <Counter {...args} />
        </div>
        <div className="text-sm text-slate-400 mt-2">Uptime</div>
      </div>
    </RemotionPreview>
  ),
};

export const Countdown: Story = {
  args: {
    from: 10,
    to: 0,
    durationInFrames: 60,
    precision: 0,
    padStart: 2,
  },
  render: (args: CounterProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Launching in
        </div>
        <div className="mt-3 text-7xl font-mono font-bold text-rose-400">
          <Counter {...args} />
        </div>
      </div>
    </RemotionPreview>
  ),
};
