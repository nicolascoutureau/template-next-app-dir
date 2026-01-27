import type { Meta, StoryObj } from "@storybook/react";
import { Particles } from "../components/Particles";
import { RemotionPreview } from "./RemotionPreview";

const meta: Meta<typeof Particles> = {
  title: "Background & Texture/Particles",
  component: Particles,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={300}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Particles>;

export const FloatingDust: Story = {
  args: {
    count: 80,
    motion: "float",
    shapes: ["circle", "dot"],
    colors: ["#ffffff", "#e0e0e0", "#c0c0c0"],
    sizeRange: [2, 6],
    opacityRange: [0.2, 0.5],
    speed: 0.8,
    width: 800,
    height: 450,
  },
};

export const RisingBubbles: Story = {
  args: {
    count: 40,
    motion: "rise",
    shapes: ["circle", "glow"],
    colors: ["rgba(100, 200, 255, 0.6)", "rgba(150, 220, 255, 0.4)"],
    sizeRange: [8, 24],
    opacityRange: [0.3, 0.7],
    emissionArea: "bottom",
    speed: 0.6,
    width: 800,
    height: 450,
  },
};

export const SnowEffect: Story = {
  args: {
    count: 120,
    motion: "fall",
    shapes: ["circle"],
    colors: ["#ffffff", "#f0f8ff"],
    sizeRange: [2, 8],
    opacityRange: [0.4, 0.9],
    emissionArea: "top",
    speed: 0.4,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={300}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "linear-gradient(180deg, #2c3e50 0%, #4a6572 50%, #232931 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export const Explosion: Story = {
  args: {
    count: 60,
    motion: "explode",
    shapes: ["circle", "star"],
    colors: ["#ff6b6b", "#ffd93d", "#ff8c42", "#ffffff"],
    sizeRange: [4, 12],
    opacityRange: [0.7, 1],
    emissionArea: "center",
    speed: 1.2,
    wrap: false,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={90}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "radial-gradient(circle at center, #2d1b4e 0%, #0f0f1a 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export const Implosion: Story = {
  args: {
    count: 50,
    motion: "implode",
    shapes: ["glow", "circle"],
    colors: ["#7928ca", "#ff0080", "#00d4aa"],
    sizeRange: [6, 16],
    opacityRange: [0.5, 1],
    speed: 0.8,
    wrap: false,
    width: 800,
    height: 450,
  },
};

export const OrbitingParticles: Story = {
  args: {
    count: 30,
    motion: "orbit",
    shapes: ["circle", "glow"],
    colors: ["#00d4aa", "#0070f3", "#7928ca"],
    sizeRange: [4, 10],
    opacityRange: [0.6, 1],
    speed: 0.5,
    width: 800,
    height: 450,
  },
};

export const SwirlEffect: Story = {
  args: {
    count: 50,
    motion: "swirl",
    shapes: ["spark", "dot"],
    colors: ["#ff0080", "#ff6b6b", "#ffd93d"],
    sizeRange: [6, 14],
    opacityRange: [0.5, 0.9],
    speed: 0.7,
    width: 800,
    height: 450,
  },
};

export const FlowingStream: Story = {
  args: {
    count: 60,
    motion: "flow",
    shapes: ["circle", "dot"],
    colors: ["#0070f3", "#00d4aa", "#7928ca"],
    sizeRange: [3, 8],
    opacityRange: [0.4, 0.8],
    speed: 1,
    width: 800,
    height: 450,
  },
};

export const TwinklingStars: Story = {
  args: {
    count: 50,
    motion: "sparkle",
    shapes: ["star", "glow"],
    colors: ["#ffffff", "#fffacd", "#f0f8ff"],
    sizeRange: [4, 14],
    opacityRange: [0.3, 1],
    speed: 1.5,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={300}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export const Confetti: Story = {
  args: {
    count: 80,
    motion: "confetti",
    shapes: ["square"],
    colors: ["#ff0080", "#7928ca", "#0070f3", "#00d4aa", "#ffd93d", "#ff6b6b"],
    sizeRange: [8, 16],
    opacityRange: [0.8, 1],
    emissionArea: "top",
    speed: 0.8,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={180}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export const GlowingOrbs: Story = {
  args: {
    count: 25,
    motion: "float",
    shapes: ["glow"],
    colors: ["rgba(255, 0, 128, 0.6)", "rgba(121, 40, 202, 0.6)", "rgba(0, 112, 243, 0.6)"],
    sizeRange: [30, 80],
    opacityRange: [0.3, 0.6],
    blur: 10,
    speed: 0.3,
    width: 800,
    height: 450,
  },
};

export const Fireflies: Story = {
  args: {
    count: 40,
    motion: "float",
    shapes: ["glow", "dot"],
    colors: ["#fffacd", "#ffd700", "#ffec8b"],
    sizeRange: [4, 12],
    opacityRange: [0.3, 1],
    speed: 0.5,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={300}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};

export const DigitalRain: Story = {
  args: {
    count: 100,
    motion: "fall",
    shapes: ["spark"],
    colors: ["#00ff00", "#00cc00", "#009900"],
    sizeRange: [10, 30],
    opacityRange: [0.3, 0.8],
    emissionArea: "top",
    speed: 1.2,
    width: 800,
    height: 450,
  },
  decorators: [
    (Story) => (
      <RemotionPreview width={800} height={450} durationInFrames={180}>
        <div
          style={{
            width: 800,
            height: 450,
            background: "#000000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Story />
        </div>
      </RemotionPreview>
    ),
  ],
};
