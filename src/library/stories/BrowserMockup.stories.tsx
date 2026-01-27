import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import { BrowserMockup } from "../index";
import type { BrowserMockupProps } from "../index";

const meta: Meta<BrowserMockupProps> = {
  title: "Motion Library/Mockups/BrowserMockup",
  component: BrowserMockup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light", "macos-dark", "macos-light"],
    },
    url: { control: "text" },
    width: { control: { type: "number", min: 400, max: 1200 } },
    height: { control: { type: "number", min: 300, max: 800 } },
    showAddressBar: { control: "boolean" },
    showControls: { control: "boolean" },
    shadowIntensity: { control: { type: "range", min: 0, max: 3, step: 1 } },
    borderRadius: { control: { type: "number", min: 0, max: 24 } },
    contentBackground: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<BrowserMockupProps>;

export const MacOSDark: Story = {
  args: {
    theme: "macos-dark",
    url: "https://myapp.com/dashboard",
    width: 700,
    height: 420,
    showAddressBar: true,
    showControls: true,
    shadowIntensity: 3,
    borderRadius: 12,
    contentBackground: "#000",
  },
  render: (args) => (
    <RemotionPreview width={900} height={550} durationInFrames={90}>
      <BrowserMockup {...args}>
        <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 p-6">
          <div className="flex gap-4">
            <div className="h-24 w-48 rounded-lg bg-white/10" />
            <div className="h-24 w-48 rounded-lg bg-white/10" />
            <div className="h-24 w-48 rounded-lg bg-white/10" />
          </div>
          <div className="mt-4 h-40 rounded-lg bg-white/5" />
        </div>
      </BrowserMockup>
    </RemotionPreview>
  ),
};

export const MacOSLight: Story = {
  args: {
    theme: "macos-light",
    url: "https://example.com",
    width: 700,
    height: 420,
    showAddressBar: true,
    showControls: true,
    shadowIntensity: 2,
    borderRadius: 12,
  },
  render: (args) => (
    <RemotionPreview width={900} height={550} durationInFrames={90}>
      <BrowserMockup {...args}>
        <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="flex gap-4">
            <div className="h-24 w-48 rounded-lg bg-slate-200" />
            <div className="h-24 w-48 rounded-lg bg-slate-200" />
            <div className="h-24 w-48 rounded-lg bg-slate-200" />
          </div>
          <div className="mt-4 h-40 rounded-lg bg-slate-100" />
        </div>
      </BrowserMockup>
    </RemotionPreview>
  ),
};

export const Dark: Story = {
  args: {
    theme: "dark",
    url: "https://app.example.com",
    width: 700,
    height: 400,
    showAddressBar: true,
    showControls: true,
    shadowIntensity: 2,
    borderRadius: 8,
  },
  render: (args) => (
    <RemotionPreview width={900} height={550} durationInFrames={90}>
      <BrowserMockup {...args}>
        <div className="h-full bg-zinc-900 p-6">
          <div className="h-8 w-48 rounded bg-zinc-800" />
          <div className="mt-4 h-64 rounded-lg bg-zinc-800" />
        </div>
      </BrowserMockup>
    </RemotionPreview>
  ),
};

export const NoAddressBar: Story = {
  args: {
    theme: "macos-dark",
    width: 600,
    height: 350,
    showAddressBar: false,
    showControls: true,
    shadowIntensity: 2,
    borderRadius: 12,
  },
  render: (args) => (
    <RemotionPreview width={800} height={500} durationInFrames={90}>
      <BrowserMockup {...args}>
        <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 p-6">
          <div className="text-center text-white">
            <div className="text-3xl font-bold">Clean Look</div>
            <div className="mt-2 text-white/70">No address bar</div>
          </div>
        </div>
      </BrowserMockup>
    </RemotionPreview>
  ),
};
