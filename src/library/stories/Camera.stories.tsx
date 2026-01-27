import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import { Camera } from "../index";
import type { CameraProps } from "../index";

const meta: Meta<CameraProps> = {
  title: "Motion Library/Effects/Camera",
  component: Camera,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    zoom: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    panX: { control: { type: "range", min: -200, max: 200, step: 10 } },
    panY: { control: { type: "range", min: -200, max: 200, step: 10 } },
    rotate: { control: { type: "range", min: -180, max: 180, step: 5 } },
    rotateX: { control: { type: "range", min: -45, max: 45, step: 5 } },
    rotateY: { control: { type: "range", min: -45, max: 45, step: 5 } },
    shakeIntensity: { control: { type: "range", min: 0, max: 20, step: 1 } },
    shakeFrequency: { control: { type: "range", min: 1, max: 30, step: 1 } },
    shakeRotation: { control: "boolean" },
    perspective: { control: { type: "range", min: 500, max: 2000, step: 100 } },
    origin: {
      control: "select",
      options: ["center", "top left", "top right", "bottom left", "bottom right", "top center", "bottom center"],
    },
    easing: {
      control: "select",
      options: ["linear", "easeIn", "easeOut", "easeInOut", "spring", "bounce"],
    },
  },
};

export default meta;
type Story = StoryObj<CameraProps>;

const DemoContent = () => (
  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="grid grid-cols-3 gap-4 p-8">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg"
        >
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  args: {
    zoom: 1,
    panX: 0,
    panY: 0,
    rotate: 0,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={60}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const ZoomIn: Story = {
  args: {
    zoom: 1,
    zoomTo: 1.5,
    animationStartFrame: 10,
    animationDuration: 40,
    easing: "easeOut",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const PanAcross: Story = {
  args: {
    panX: -100,
    panXTo: 100,
    animationStartFrame: 0,
    animationDuration: 60,
    easing: "easeInOut",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const RotateEffect: Story = {
  args: {
    rotate: -10,
    rotateTo: 10,
    zoom: 1.1,
    animationStartFrame: 0,
    animationDuration: 60,
    easing: "easeInOut",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const ShakeEffect: Story = {
  args: {
    shakeIntensity: 8,
    shakeFrequency: 12,
    shakeRotation: true,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const Perspective3D: Story = {
  args: {
    perspective: 1000,
    rotateY: -15,
    rotateX: 10,
    zoom: 1.1,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={60}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const DramaticZoom: Story = {
  args: {
    zoom: 1,
    zoomTo: 2.5,
    panY: 0,
    panYTo: -80,
    animationStartFrame: 15,
    animationDuration: 45,
    easing: "easeOut",
    origin: "top center",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const SpringAnimation: Story = {
  args: {
    zoom: 0.8,
    zoomTo: 1.2,
    rotate: -5,
    rotateTo: 5,
    animationStartFrame: 0,
    animationDuration: 50,
    easing: "spring",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};

export const CombinedEffects: Story = {
  args: {
    zoom: 1,
    zoomTo: 1.3,
    panX: -50,
    panXTo: 50,
    rotate: -3,
    rotateTo: 3,
    shakeIntensity: 2,
    shakeFrequency: 8,
    animationStartFrame: 0,
    animationDuration: 60,
    easing: "easeInOut",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="h-80 w-[480px] overflow-hidden rounded-xl border border-white/10">
        <Camera {...args}>
          <DemoContent />
        </Camera>
      </div>
    </RemotionPreview>
  ),
};
