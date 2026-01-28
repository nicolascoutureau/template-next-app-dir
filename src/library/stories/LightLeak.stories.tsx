import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { LightLeak } from "../index";
import type { LightLeakProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<LightLeakProps> = {
  title: "Motion Library/Transitions/LightLeak",
  component: LightLeak,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    leakStyle: {
      control: "select",
      options: ["warm", "cool", "rainbow", "golden", "film", "neon"],
    },
  },
};

export default meta;
type Story = StoryObj<LightLeakProps>;

export const WarmLeak: Story = {
  name: "Warm Film Leak",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LightLeak
          leakStyle="warm"
          startFrame={10}
          durationInFrames={60}
          maxOpacity={0.6}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Mountain"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CoolLeak: Story = {
  name: "Cool Light Leak",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <LightLeak
          leakStyle="cool"
          startFrame={10}
          durationInFrames={60}
          maxOpacity={0.5}
          angle={120}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop"
              alt="Night"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const RainbowFlare: Story = {
  name: "Rainbow Flare",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LightLeak
          leakStyle="rainbow"
          startFrame={5}
          durationInFrames={70}
          maxOpacity={0.7}
          position={{ x: 0.2, y: 0.2 }}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="flex items-center justify-center">
            <div className="text-8xl font-black text-white">PRISM</div>
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GoldenHour: Story = {
  name: "Golden Hour",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LightLeak
          leakStyle="golden"
          startFrame={10}
          durationInFrames={60}
          maxOpacity={0.5}
          angle={60}
          position={{ x: 0.7, y: 0.3 }}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop"
              alt="Beach"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const NeonLeak: Story = {
  name: "Neon Glow",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <LightLeak
          leakStyle="neon"
          startFrame={5}
          durationInFrames={70}
          maxOpacity={0.6}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="flex items-center justify-center">
            <div className="text-7xl font-black text-white">CYBER</div>
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const FilmBurn: Story = {
  name: "Film Burn",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <LightLeak
          leakStyle="film"
          startFrame={10}
          durationInFrames={50}
          maxOpacity={0.8}
          position={{ x: 0.8, y: 0.5 }}
          animated
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="flex items-center justify-center">
            <div className="text-6xl font-light text-white tracking-widest">VINTAGE</div>
          </AbsoluteFill>
        </LightLeak>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
