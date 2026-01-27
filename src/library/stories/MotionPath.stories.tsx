import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { MotionPath } from "../index";
import type { MotionPathProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<MotionPathProps> = {
  title: "Motion Library/Animation/MotionPath",
  component: MotionPath,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    startFrame: { control: { type: "number", min: 0, max: 30 } },
    durationInFrames: { control: { type: "number", min: 15, max: 120 } },
    autoRotate: { control: "boolean" },
    offset: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    rotationOffset: { control: { type: "number", min: -180, max: 180 } },
  },
};

export default meta;
type Story = StoryObj<MotionPathProps>;

const Dot = () => (
  <div className="h-6 w-6 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
);

const Arrow = () => (
  <div className="text-2xl">→</div>
);

export const CurvedPath: Story = {
  args: {
    path: "M 100,225 Q 400,50 700,225",
    startFrame: 0,
    durationInFrames: 60,
    autoRotate: false,
  },
  render: (args: MotionPathProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        {/* Show the path for reference */}
        <svg className="absolute" width={800} height={450} viewBox="0 0 800 450">
          <path
            d={args.path}
            fill="none"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
        </svg>
        <MotionPath {...args}>
          <Dot />
        </MotionPath>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SWavePath: Story = {
  args: {
    path: "M 50,225 C 200,50 300,400 400,225 S 600,50 750,225",
    startFrame: 0,
    durationInFrames: 90,
    autoRotate: true,
  },
  render: (args: MotionPathProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="bg-slate-900">
        <svg className="absolute" width={800} height={450} viewBox="0 0 800 450">
          <path
            d={args.path}
            fill="none"
            stroke="rgba(236, 72, 153, 0.3)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
        </svg>
        <MotionPath {...args}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50" />
        </MotionPath>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50">
          Auto-rotate follows path direction
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CircularPath: Story = {
  args: {
    path: "M 400,125 A 100,100 0 1,1 399,125",
    startFrame: 0,
    durationInFrames: 60,
    autoRotate: false,
  },
  render: (args: MotionPathProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450} loop>
      <AbsoluteFill className="items-center justify-center bg-black">
        <svg className="absolute" viewBox="0 0 800 450" style={{ width: 800, height: 450 }}>
          <circle
            cx="400"
            cy="225"
            r="100"
            fill="none"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="2"
          />
        </svg>
        <MotionPath {...args}>
          <div className="h-5 w-5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
        </MotionPath>
        <div className="absolute text-2xl font-bold text-white">●</div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ArrowFollowingPath: Story = {
  args: {
    path: "M 100,350 Q 250,100 400,225 T 700,100",
    startFrame: 5,
    durationInFrames: 75,
    autoRotate: true,
    rotationOffset: 0,
  },
  render: (args: MotionPathProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="bg-gradient-to-br from-slate-900 to-slate-800">
        <svg className="absolute" width={800} height={450} viewBox="0 0 800 450">
          <path
            d={args.path}
            fill="none"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
        </svg>
        <MotionPath {...args}>
          <div className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white shadow-lg">
            <span className="text-sm font-medium">Moving</span>
            <span>→</span>
          </div>
        </MotionPath>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MultipleObjects: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450} loop>
      <AbsoluteFill className="bg-slate-950">
        <svg className="absolute" width={800} height={450} viewBox="0 0 800 450">
          <path
            d="M 100,225 Q 400,50 700,225"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </svg>
        
        <MotionPath
          path="M 100,225 Q 400,50 700,225"
          durationInFrames={60}
          offset={0}
        >
          <div className="h-4 w-4 rounded-full bg-red-500" />
        </MotionPath>
        
        <MotionPath
          path="M 100,225 Q 400,50 700,225"
          durationInFrames={60}
          offset={0.25}
        >
          <div className="h-4 w-4 rounded-full bg-yellow-500" />
        </MotionPath>
        
        <MotionPath
          path="M 100,225 Q 400,50 700,225"
          durationInFrames={60}
          offset={0.5}
        >
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </MotionPath>
        
        <MotionPath
          path="M 100,225 Q 400,50 700,225"
          durationInFrames={60}
          offset={0.75}
        >
          <div className="h-4 w-4 rounded-full bg-blue-500" />
        </MotionPath>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50">
          Multiple objects with offset
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
