import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { PlasmaBackground, Noise } from "../index";
import type { PlasmaBackgroundProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<PlasmaBackgroundProps> = {
  title: "Motion Library/Background/PlasmaBackground",
  component: PlasmaBackground,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    plasmaStyle: {
      control: "select",
      options: ["classic", "liquid", "electric", "organic", "crystal"],
    },
    complexity: { control: { type: "range", min: 1, max: 10, step: 1 } },
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    scale: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    intensity: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<PlasmaBackgroundProps>;

export const ClassicPlasma: Story = {
  args: {
    plasmaStyle: "classic",
    color1: "#ff0080",
    color2: "#7928ca",
    color3: "#0070f3",
    complexity: 5,
    speed: 1,
  },
  render: (args: PlasmaBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <PlasmaBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Classic Plasma
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const LiquidPlasma: Story = {
  args: {
    plasmaStyle: "liquid",
    color1: "#00ff88",
    color2: "#0088ff",
    color3: "#8800ff",
    complexity: 4,
    speed: 0.7,
  },
  render: (args: PlasmaBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <PlasmaBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Liquid Flow
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ElectricPlasma: Story = {
  args: {
    plasmaStyle: "electric",
    color1: "#ffff00",
    color2: "#ff8800",
    color3: "#ff0000",
    backgroundColor: "#1a0a00",
    complexity: 8,
    speed: 1.5,
  },
  render: (args: PlasmaBackgroundProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <PlasmaBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Electric
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const OrganicPlasma: Story = {
  args: {
    plasmaStyle: "organic",
    color1: "#2dd4bf",
    color2: "#22d3ee",
    color3: "#818cf8",
    backgroundColor: "#0f172a",
    complexity: 5,
    speed: 0.5,
  },
  render: (args: PlasmaBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <PlasmaBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Organic
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CrystalPlasma: Story = {
  args: {
    plasmaStyle: "crystal",
    color1: "#67e8f9",
    color2: "#c4b5fd",
    color3: "#f9a8d4",
    backgroundColor: "#0c0a09",
    complexity: 6,
    speed: 0.8,
  },
  render: (args: PlasmaBackgroundProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <PlasmaBackground {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Crystal
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
