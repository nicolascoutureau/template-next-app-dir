import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import { PhoneMockup } from "../index";
import type { PhoneMockupProps } from "../index";

const meta: Meta<PhoneMockupProps> = {
  title: "Motion Library/Mockups/PhoneMockup",
  component: PhoneMockup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    device: {
      control: "select",
      options: ["iphone-14", "iphone-14-pro", "iphone-15-pro", "pixel", "generic"],
    },
    color: {
      control: "select",
      options: ["black", "white", "silver", "gold", "blue", "purple"],
    },
    scale: { control: { type: "range", min: 0.5, max: 1.5, step: 0.1 } },
    rotateY: { control: { type: "range", min: -45, max: 45, step: 1 } },
    rotateX: { control: { type: "range", min: -30, max: 30, step: 1 } },
    rotateZ: { control: { type: "range", min: -30, max: 30, step: 1 } },
    showNotch: { control: "boolean" },
    shadowIntensity: { control: { type: "range", min: 0, max: 3, step: 1 } },
    perspective: { control: { type: "number", min: 500, max: 2000 } },
  },
};

export default meta;
type Story = StoryObj<PhoneMockupProps>;

export const Default: Story = {
  args: {
    device: "iphone-15-pro",
    color: "black",
    scale: 1,
    rotateY: -10,
    rotateX: 0,
    rotateZ: 0,
    showNotch: true,
    shadowIntensity: 3,
    perspective: 1200,
  },
  render: (args) => (
    <RemotionPreview width={600} height={700} durationInFrames={90}>
      <PhoneMockup {...args}>
        <div className="h-full bg-gradient-to-b from-violet-600 to-indigo-700 p-4">
          <div className="mt-8 h-8 w-24 rounded-full bg-white/20" />
          <div className="mt-4 h-48 rounded-2xl bg-white/10" />
          <div className="mt-4 flex gap-2">
            <div className="h-20 flex-1 rounded-xl bg-white/10" />
            <div className="h-20 flex-1 rounded-xl bg-white/10" />
          </div>
        </div>
      </PhoneMockup>
    </RemotionPreview>
  ),
};

export const WhiteDevice: Story = {
  args: {
    device: "iphone-14-pro",
    color: "white",
    scale: 1,
    rotateY: 15,
    rotateX: 5,
    showNotch: true,
    shadowIntensity: 2,
  },
  render: (args) => (
    <RemotionPreview width={600} height={700} durationInFrames={90}>
      <PhoneMockup {...args}>
        <div className="h-full bg-gradient-to-b from-rose-400 to-pink-600 p-4">
          <div className="mt-8 text-center text-white">
            <div className="text-2xl font-bold">Welcome</div>
            <div className="mt-2 text-sm opacity-80">Your app content here</div>
          </div>
        </div>
      </PhoneMockup>
    </RemotionPreview>
  ),
};

export const Pixel: Story = {
  args: {
    device: "pixel",
    color: "black",
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    shadowIntensity: 2,
  },
  render: (args) => (
    <RemotionPreview width={600} height={700} durationInFrames={90}>
      <PhoneMockup {...args}>
        <div className="h-full bg-gradient-to-b from-emerald-500 to-teal-700 p-4">
          <div className="mt-8 h-8 w-32 rounded-full bg-white/20" />
          <div className="mt-4 h-40 rounded-2xl bg-white/10" />
        </div>
      </PhoneMockup>
    </RemotionPreview>
  ),
};
