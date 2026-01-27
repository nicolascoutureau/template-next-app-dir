import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Animate } from "../index";
import type { AnimateProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<AnimateProps> = {
  title: "Motion Library/Animation/Animate",
  component: Animate,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    animation: {
      control: "select",
      options: [
        "fadeIn",
        "fadeOut",
        "fadeUp",
        "fadeDown",
        "fadeLeft",
        "fadeRight",
        "scaleIn",
        "scaleOut",
        "scaleUp",
        "scaleDown",
        "slideUp",
        "slideDown",
        "slideLeft",
        "slideRight",
        "zoomIn",
        "zoomOut",
        "rotateIn",
        "rotateOut",
        "flipX",
        "flipY",
        "bounceIn",
        "elasticIn",
        "pop",
      ],
    },
    mode: {
      control: "select",
      options: ["in", "out", "inOut", "loop"],
    },
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 5, max: 60 } },
    distance: { control: { type: "number", min: 10, max: 100 } },
    delay: { control: { type: "number", min: 0, max: 30 } },
  },
};

export default meta;
type Story = StoryObj<AnimateProps>;

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 px-8 py-6 text-white shadow-xl">
    {children}
  </div>
);

export const FadeUp: Story = {
  args: {
    animation: "fadeUp",
    startFrame: 10,
    durationInFrames: 20,
    distance: 30,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <Animate {...args}>
          <Card>
            <div className="text-2xl font-bold">Fade Up</div>
            <div className="mt-1 text-white/70">Classic entrance</div>
          </Card>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ScaleIn: Story = {
  args: {
    animation: "scaleIn",
    startFrame: 10,
    durationInFrames: 25,
    scale: 0.5,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <Animate {...args}>
          <Card>
            <div className="text-2xl font-bold">Scale In</div>
            <div className="mt-1 text-white/70">Grows from small</div>
          </Card>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const BounceIn: Story = {
  args: {
    animation: "bounceIn",
    startFrame: 10,
    durationInFrames: 30,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-800">
        <Animate {...args}>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-4xl text-white shadow-xl">
            🎉
          </div>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const Pop: Story = {
  args: {
    animation: "pop",
    startFrame: 10,
    durationInFrames: 20,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-black">
        <Animate {...args}>
          <div className="text-6xl font-black text-white">POP!</div>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const FlipX: Story = {
  args: {
    animation: "flipX",
    startFrame: 10,
    durationInFrames: 25,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <Animate {...args}>
          <Card>
            <div className="text-2xl font-bold">Flip X</div>
            <div className="mt-1 text-white/70">3D flip effect</div>
          </Card>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ElasticIn: Story = {
  args: {
    animation: "elasticIn",
    startFrame: 10,
    durationInFrames: 35,
    distance: 40,
  },
  render: (args: AnimateProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Animate {...args}>
          <div className="text-5xl font-bold text-white">Elastic!</div>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const MultipleAnimations: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <div className="flex gap-6">
          <Animate animation="fadeUp" delay={0} durationInFrames={20}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-red-500 text-2xl text-white">
              1
            </div>
          </Animate>
          <Animate animation="fadeUp" delay={8} durationInFrames={20}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-yellow-500 text-2xl text-white">
              2
            </div>
          </Animate>
          <Animate animation="fadeUp" delay={16} durationInFrames={20}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-green-500 text-2xl text-white">
              3
            </div>
          </Animate>
          <Animate animation="fadeUp" delay={24} durationInFrames={20}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-500 text-2xl text-white">
              4
            </div>
          </Animate>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const CustomAnimation: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-900">
        <Animate
          animation={({ progress }) => ({
            opacity: progress,
            transform: `translateX(${(1 - progress) * 100}px) rotate(${progress * 360}deg) scale(${0.5 + progress * 0.5})`,
          })}
          durationInFrames={40}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-3xl text-white shadow-xl">
            ✦
          </div>
        </Animate>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const AllPresets: Story = {
  render: () => {
    const presets = [
      "fadeUp",
      "scaleIn",
      "slideLeft",
      "zoomIn",
      "rotateIn",
      "bounceIn",
      "elasticIn",
      "pop",
    ] as const;

    return (
      <RemotionPreview durationInFrames={120} width={900} height={500}>
        <AbsoluteFill className="items-center justify-center bg-slate-950">
          <div className="grid grid-cols-4 gap-4">
            {presets.map((preset, i) => (
              <Animate
                key={preset}
                animation={preset}
                delay={i * 5}
                durationInFrames={25}
              >
                <div className="flex h-20 w-40 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                  <div className="text-sm font-bold">{preset}</div>
                </div>
              </Animate>
            ))}
          </div>
        </AbsoluteFill>
      </RemotionPreview>
    );
  },
};
