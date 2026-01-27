import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Cursor } from "../index";
import type { CursorProps } from "../index";

const meta: Meta<CursorProps> = {
  title: "Motion Library/UI/Cursor",
  component: Cursor,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showRipple: { control: "boolean" },
    rippleColor: { control: "color" },
    color: { control: "color" },
    size: { control: { type: "number", min: 0.5, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<CursorProps>;

export const Default: Story = {
  args: {
    showRipple: true,
    rippleColor: "rgba(255, 255, 255, 0.3)",
    color: "#ffffff",
    size: 1,
  },
  render: (args: CursorProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="relative h-64 w-96 rounded-xl bg-slate-800/50 border border-white/10">
        <div className="absolute left-8 top-8 rounded-lg bg-blue-500/20 border border-blue-500/40 px-4 py-2 text-sm text-blue-200">
          Button 1
        </div>
        <div className="absolute right-8 bottom-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-sm text-emerald-200">
          Button 2
        </div>
        <Cursor
          {...args}
          actions={[
            { x: 60, y: 50, frame: 0, duration: 15 },
            { x: 60, y: 50, frame: 15, duration: 10, click: true },
            { x: 320, y: 200, frame: 35, duration: 20 },
            { x: 320, y: 200, frame: 55, duration: 10, click: true },
          ]}
        />
      </div>
    </RemotionPreview>
  ),
};

export const NoRipple: Story = {
  args: {
    showRipple: false,
    color: "#ffffff",
    size: 1,
  },
  render: (args: CursorProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="relative h-64 w-96 rounded-xl bg-slate-800/50 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-violet-500/20 border border-violet-500/40 px-6 py-3 text-violet-200">
            Click me
          </div>
        </div>
        <Cursor
          {...args}
          actions={[
            { x: 200, y: 130, frame: 0, duration: 20 },
            { x: 200, y: 130, frame: 20, duration: 15, click: true },
            { x: 200, y: 130, frame: 50, duration: 15, click: true },
          ]}
        />
      </div>
    </RemotionPreview>
  ),
};

export const ColoredCursor: Story = {
  args: {
    showRipple: true,
    rippleColor: "rgba(139, 92, 246, 0.4)",
    color: "#8b5cf6",
    size: 1.2,
  },
  render: (args: CursorProps) => (
    <RemotionPreview durationInFrames={120}>
      <div className="relative h-64 w-96 rounded-xl bg-slate-900 border border-violet-500/20">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 border border-violet-500/40 px-8 py-4 text-violet-200">
          Interactive
        </div>
        <Cursor
          {...args}
          actions={[
            { x: 50, y: 50, frame: 0, duration: 25 },
            { x: 200, y: 130, frame: 25, duration: 20 },
            { x: 200, y: 130, frame: 45, duration: 15, click: true },
            { x: 350, y: 200, frame: 70, duration: 25 },
          ]}
        />
      </div>
    </RemotionPreview>
  ),
};
