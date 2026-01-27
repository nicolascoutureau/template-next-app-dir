import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { TypingBar, SearchIcon, GradientBackground, Noise } from "../index";
import type { TypingBarProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<TypingBarProps> = {
  title: "Motion Library/UI/TypingBar",
  component: TypingBar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    speed: { control: { type: "number", min: 1, max: 10 } },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    showCursor: { control: "boolean" },
    cursorBlinkSpeed: { control: { type: "number", min: 5, max: 30 } },
    theme: {
      control: "select",
      options: ["light", "dark", "glass"],
    },
    width: { control: { type: "number", min: 200, max: 600 } },
    borderRadius: { control: { type: "number", min: 0, max: 50 } },
    fontSize: { control: { type: "number", min: 12, max: 32 } },
  },
};

export default meta;
type Story = StoryObj<TypingBarProps>;

export const URLTyping: Story = {
  args: {
    text: "jumper.exchange/earn",
    speed: 2,
    startFrame: 10,
    theme: "light",
    width: 420,
    rightIcon: <SearchIcon />,
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground
          type="mesh"
          meshPoints={[
            { x: 30, y: 30, color: "#e9d5ff", blur: 50 },
            { x: 70, y: 50, color: "#c4b5fd", blur: 60 },
            { x: 50, y: 70, color: "#ddd6fe", blur: 55 },
          ]}
          width={800}
          height={450}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <TypingBar {...args} />
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SearchQuery: Story = {
  args: {
    text: "How to create motion graphics",
    speed: 2,
    startFrame: 5,
    theme: "dark",
    width: 450,
    leftIcon: <SearchIcon />,
    placeholder: "Search...",
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <TypingBar {...args} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MultiStepTyping: Story = {
  args: {
    text: ["react", "react hooks", "react hooks tutorial"],
    speed: 2,
    clearDelay: 20,
    startFrame: 5,
    theme: "light",
    width: 400,
    rightIcon: <SearchIcon />,
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={200} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-white">
        <TypingBar {...args} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GlassTheme: Story = {
  args: {
    text: "app.example.com/dashboard",
    speed: 2,
    startFrame: 10,
    theme: "glass",
    width: 420,
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground
          type="linear"
          colors={["#667eea", "#764ba2"]}
          angle={135}
          width={800}
          height={450}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <TypingBar {...args} />
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CommandLine: Story = {
  args: {
    text: "npm install @remotion/cli",
    speed: 3,
    startFrame: 10,
    theme: "dark",
    width: 500,
    borderRadius: 8,
    fontSize: 16,
    padding: "16px 20px",
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={150} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-slate-500 font-mono">$ terminal</div>
          <TypingBar
            {...args}
            leftIcon={<span className="text-green-400">→</span>}
          />
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SquareBar: Story = {
  args: {
    text: "Design systems for video",
    speed: 2,
    startFrame: 5,
    theme: "light",
    width: 380,
    borderRadius: 12,
    fontSize: 16,
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <TypingBar {...args} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const LongURL: Story = {
  args: {
    text: "https://studio.example.com/projects/motion-design/compositions/main",
    speed: 1,
    startFrame: 5,
    theme: "dark",
    width: 600,
  },
  render: (args: TypingBarProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <TypingBar {...args} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
