import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { useWiggle } from "../index";
import { AbsoluteFill } from "remotion";

// Demo component that uses the hook
const WiggleDemo = ({
  frequency,
  amplitude,
  octaves,
  property,
}: {
  frequency: number;
  amplitude: number;
  octaves: number;
  property: "position" | "rotation" | "scale";
}) => {
  const wiggleX = useWiggle({ frequency, amplitude, octaves, seed: 0 });
  const wiggleY = useWiggle({ frequency, amplitude, octaves, seed: 1 });
  const wiggleRotation = useWiggle({ frequency, amplitude: amplitude * 0.5, octaves, seed: 2 });
  const wiggleScale = useWiggle({ frequency, amplitude: amplitude * 0.01, octaves, seed: 3 });

  const getTransform = () => {
    switch (property) {
      case "position":
        return `translate(${wiggleX}px, ${wiggleY}px)`;
      case "rotation":
        return `rotate(${wiggleRotation}deg)`;
      case "scale":
        return `scale(${1 + wiggleScale})`;
      default:
        return "";
    }
  };

  return (
    <div
      className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl"
      style={{ transform: getTransform() }}
    >
      <span className="text-lg font-bold capitalize">{property}</span>
    </div>
  );
};

const meta: Meta = {
  title: "Motion Library/Hooks/useWiggle",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    frequency: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
    amplitude: { control: { type: "range", min: 5, max: 50, step: 5 } },
    octaves: { control: { type: "number", min: 1, max: 4 } },
    property: {
      control: "select",
      options: ["position", "rotation", "scale"],
    },
  },
};

export default meta;
type Story = StoryObj<{
  frequency: number;
  amplitude: number;
  octaves: number;
  property: "position" | "rotation" | "scale";
}>;

export const PositionWiggle: Story = {
  args: {
    frequency: 2,
    amplitude: 15,
    octaves: 2,
    property: "position",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <WiggleDemo {...args} />
        <div className="absolute bottom-8 text-white/50">
          Organic position jitter
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RotationWobble: Story = {
  args: {
    frequency: 1.5,
    amplitude: 10,
    octaves: 2,
    property: "rotation",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <WiggleDemo {...args} />
        <div className="absolute bottom-8 text-white/50">
          Rotation wobble effect
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ScaleBreathing: Story = {
  args: {
    frequency: 0.8,
    amplitude: 10,
    octaves: 1,
    property: "scale",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-800">
        <WiggleDemo {...args} />
        <div className="absolute bottom-8 text-white/50">
          Scale breathing effect
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Combined demo showing all three
const CombinedWiggleDemo = () => {
  const posX = useWiggle({ frequency: 2, amplitude: 8, seed: 0 });
  const posY = useWiggle({ frequency: 2, amplitude: 8, seed: 1 });
  const rotation = useWiggle({ frequency: 1.5, amplitude: 3, seed: 2 });
  const scale = useWiggle({ frequency: 0.8, amplitude: 0.03, seed: 3 });

  return (
    <div
      className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-2xl"
      style={{
        transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${1 + scale})`,
      }}
    >
      <span className="text-xl font-bold">Alive!</span>
    </div>
  );
};

export const CombinedEffect: Story = {
  render: () => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <CombinedWiggleDemo />
        <div className="absolute bottom-8 text-center text-white/50">
          Position + Rotation + Scale combined
          <br />
          <span className="text-xs">Makes static elements feel alive</span>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
