import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import {
  Shimmer,
  PhoneMockup,
  BrowserMockup,
  DotGrid,
  Cursor,
  Counter,
} from "../index";
import type {
  ShimmerProps,
  PhoneMockupProps,
  BrowserMockupProps,
  DotGridProps,
  CounterProps,
} from "../index";

// ============ SHIMMER ============

const shimmerMeta: Meta<ShimmerProps> = {
  title: "Motion Components/Shimmer",
  component: Shimmer,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 120 } },
    shimmerWidth: { control: { type: "number", min: 20, max: 300 } },
    shimmerOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    shimmerColor: { control: "color" },
    angle: { control: { type: "number", min: 0, max: 360 } },
    repeat: { control: { type: "number", min: 1, max: 10 } },
    delay: { control: { type: "number", min: 0, max: 60 } },
  },
};

export default shimmerMeta;

type ShimmerStory = StoryObj<ShimmerProps>;

export const ShimmerBasic: ShimmerStory = {
  name: "Basic",
  args: {
    durationInFrames: 50,
    shimmerWidth: 120,
    shimmerOpacity: 0.4,
    shimmerColor: "rgba(255, 255, 255, 0.8)",
    angle: 120,
    repeat: 1,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={120}>
      <Shimmer {...args}>
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-8 py-6 text-center">
          <div className="text-sm font-medium uppercase tracking-wider text-white/80">
            Introducing
          </div>
          <div className="mt-2 text-2xl font-bold text-white">Product Pro</div>
        </div>
      </Shimmer>
    </RemotionPreview>
  ),
};

export const ShimmerRepeat: ShimmerStory = {
  name: "Repeating",
  args: {
    durationInFrames: 40,
    repeat: 3,
    shimmerWidth: 80,
    shimmerColor: "#fbbf24",
    angle: 135,
    delay: 20,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180}>
      <Shimmer {...args}>
        <div className="rounded-xl bg-slate-800 px-6 py-4 text-white">
          <div className="text-lg font-semibold">Premium Feature</div>
          <div className="text-sm text-slate-400">Unlock now</div>
        </div>
      </Shimmer>
    </RemotionPreview>
  ),
};

// ============ PHONE MOCKUP ============

export const PhoneMockupStory: StoryObj<PhoneMockupProps> = {
  name: "PhoneMockup",
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

// ============ BROWSER MOCKUP ============

export const BrowserMockupStory: StoryObj<BrowserMockupProps> = {
  name: "BrowserMockup",
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

// ============ DOT GRID ============

export const DotGridStory: StoryObj<DotGridProps> = {
  name: "DotGrid",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    spacing: { control: { type: "number", min: 10, max: 60 } },
    dotSize: { control: { type: "range", min: 1, max: 8, step: 0.5 } },
    dotColor: { control: "color" },
    dotOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    animation: {
      control: "select",
      options: ["wave", "radial", "rain", "none"],
    },
    durationInFrames: { control: { type: "number", min: 20, max: 120 } },
    loop: { control: "boolean" },
    centerX: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    centerY: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  },
  args: {
    width: 800,
    height: 450,
    spacing: 30,
    dotSize: 2,
    dotColor: "#3b82f6",
    dotOpacity: 0.5,
    animation: "wave",
    durationInFrames: 60,
    loop: true,
    centerX: 0.5,
    centerY: 0.5,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={120}>
      <DotGrid {...args} />
    </RemotionPreview>
  ),
};

// ============ CURSOR ============

export const CursorStory: StoryObj = {
  name: "Cursor",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showRipple: { control: "boolean" },
    rippleColor: { control: "color" },
    cursorColor: { control: "color" },
    cursorSize: { control: { type: "number", min: 10, max: 40 } },
  },
  args: {
    showRipple: true,
    rippleColor: "rgba(255, 255, 255, 0.3)",
    cursorColor: "#ffffff",
    cursorSize: 20,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="relative h-64 w-96 rounded-xl bg-slate-800/50 border border-white/10">
        <div className="absolute left-8 top-8 rounded-lg bg-blue-500/20 border border-blue-500/40 px-4 py-2 text-sm text-blue-200">
          Button 1
        </div>
        <div className="absolute right-8 bottom-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-sm text-emerald-200">
          Button 2
        </div>
        <Cursor
          {...args}
          actions={[
            { x: 60, y: 50, frame: 0, duration: 15 },
            { x: 60, y: 50, frame: 15, duration: 10, click: true },
            { x: 320, y: 200, frame: 35, duration: 20 },
            { x: 320, y: 200, frame: 55, duration: 10, click: true },
          ]}
        />
      </div>
    </RemotionPreview>
  ),
};

// ============ COUNTER ============

export const CounterStory: StoryObj<CounterProps> = {
  name: "Counter",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    from: { control: "number" },
    to: { control: "number" },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 90 } },
    precision: { control: { type: "number", min: 0, max: 4 } },
    padStart: { control: { type: "number", min: 0, max: 10 } },
    useGrouping: { control: "boolean" },
    prefix: { control: "text" },
    suffix: { control: "text" },
  },
  args: {
    from: 0,
    to: 1280,
    startFrame: 0,
    durationInFrames: 50,
    precision: 0,
    useGrouping: true,
    prefix: "",
    suffix: "",
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Counter
        </div>
        <div className="mt-3 text-6xl font-bold text-white">
          <Counter {...args} />
        </div>
      </div>
    </RemotionPreview>
  ),
};

export const CounterWithPrefixSuffix: StoryObj<CounterProps> = {
  name: "Counter - With Prefix/Suffix",
  parameters: {
    layout: "centered",
  },
  args: {
    from: 0,
    to: 99,
    durationInFrames: 40,
    prefix: "$",
    suffix: "M",
    useGrouping: false,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-5xl font-bold text-emerald-400">
          <Counter {...args} />
        </div>
        <div className="text-sm text-slate-400 mt-2">Revenue</div>
      </div>
    </RemotionPreview>
  ),
};

export const CounterDecimal: StoryObj<CounterProps> = {
  name: "Counter - Decimal",
  parameters: {
    layout: "centered",
  },
  args: {
    from: 0,
    to: 4.8,
    durationInFrames: 45,
    precision: 1,
    useGrouping: false,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Rating
        </div>
        <div className="mt-3 text-6xl font-bold text-amber-400">
          <Counter {...args} />
        </div>
        <div className="text-slate-500 mt-1">out of 5</div>
      </div>
    </RemotionPreview>
  ),
};
