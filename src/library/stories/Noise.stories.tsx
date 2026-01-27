import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Noise, GradientBackground } from "../index";
import type { NoiseProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<NoiseProps> = {
  title: "Motion Library/Texture/Noise",
  component: Noise,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    opacity: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    speed: { control: { type: "number", min: 1, max: 10 } },
    size: { control: { type: "number", min: 1, max: 4 } },
    monochrome: { control: "boolean" },
    blendMode: {
      control: "select",
      options: ["overlay", "soft-light", "multiply", "screen", "normal"],
    },
  },
};

export default meta;
type Story = StoryObj<NoiseProps>;

export const FilmGrain: Story = {
  args: {
    opacity: 0.04,
    speed: 1,
    size: 1,
    monochrome: true,
    blendMode: "overlay",
  },
  render: (args: NoiseProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill>
        <GradientBackground
          type="linear"
          colors={["#1e1b4b", "#312e81", "#4338ca"]}
          angle={135}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">Film Quality</div>
            <div className="mt-2 text-xl text-white/70">
              Subtle grain adds texture
            </div>
          </div>
        </div>
        <Noise {...args} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const HeavyGrain: Story = {
  args: {
    opacity: 0.08,
    speed: 1,
    size: 2,
    monochrome: true,
    blendMode: "overlay",
  },
  render: (args: NoiseProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-orange-950" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-amber-200">VINTAGE</div>
        </div>
        <Noise {...args} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ColoredNoise: Story = {
  args: {
    opacity: 0.05,
    speed: 2,
    size: 1,
    monochrome: false,
    blendMode: "overlay",
  },
  render: (args: NoiseProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill>
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-white">RGB NOISE</div>
        </div>
        <Noise {...args} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
