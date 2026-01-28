import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { ZoomBlur, GradientBackground } from "../index";
import type { ZoomBlurProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<ZoomBlurProps> = {
  title: "Motion Library/Transitions/ZoomBlur",
  component: ZoomBlur,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["in", "out"],
    },
  },
};

export default meta;
type Story = StoryObj<ZoomBlurProps>;

export const ZoomIn: Story = {
  name: "Zoom Blur In (Impact)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ZoomBlur
          direction="in"
          startFrame={5}
          durationInFrames={25}
          intensity={0.4}
          layers={10}
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="radial"
              colors={["#f43f5e", "#7c3aed"]}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl font-black text-white">IMPACT</div>
            </div>
          </AbsoluteFill>
        </ZoomBlur>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ZoomOut: Story = {
  name: "Zoom Blur Out (Speed)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ZoomBlur
          direction="out"
          startFrame={20}
          durationInFrames={20}
          intensity={0.5}
          layers={12}
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-cyan-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">WARP</div>
            </div>
          </AbsoluteFill>
        </ZoomBlur>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CornerZoom: Story = {
  name: "Corner Zoom (Top Left)",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <ZoomBlur
          direction="in"
          startFrame={5}
          durationInFrames={30}
          intensity={0.6}
          origin="top left"
          layers={8}
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-amber-500 to-red-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">BURST</div>
            </div>
          </AbsoluteFill>
        </ZoomBlur>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const SubtleZoom: Story = {
  name: "Subtle Zoom",
  render: () => (
    <RemotionPreview durationInFrames={60} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ZoomBlur
          direction="in"
          startFrame={5}
          durationInFrames={35}
          intensity={0.15}
          layers={6}
          fade
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop"
              alt="Space"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </ZoomBlur>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
