import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import { TextAnimation } from "../index";
import type { TextAnimationProps } from "../index";
import { SplitText } from "gsap/SplitText";

const meta: Meta<TextAnimationProps> = {
  title: "Motion Library/Text/TextAnimation",
  component: TextAnimation,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<TextAnimationProps>;

export const CharacterBounce: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Hello World"
        className="text-white"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            y: 50,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const FadeInWords: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Build amazing videos with code"
        className="text-white"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "words" });
          return tl.from(split.words, {
            opacity: 0,
            y: 30,
            rotationX: -90,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const Typewriter: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120}>
      <TextAnimation
        text="Typewriter effect"
        className="text-emerald-400 font-mono"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            stagger: 0.08,
            duration: 0.01,
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const ScaleUp: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="SCALE"
        className="text-violet-400"
        style={{ fontSize: "6rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: "back.out(2)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const SlideFromLeft: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Slide Animation"
        className="text-cyan-400"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            x: -100,
            stagger: 0.03,
            duration: 0.4,
            ease: "power2.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const BlurIn: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Blur Effect"
        className="text-rose-400"
        style={{ fontSize: "4rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            filter: "blur(20px)",
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const RotateIn: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120}>
      <TextAnimation
        text="ROTATE"
        className="text-amber-400"
        style={{ fontSize: "5rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            rotation: 180,
            y: 50,
            stagger: 0.08,
            duration: 0.6,
            ease: "back.out(1.4)",
          });
        }}
      />
    </RemotionPreview>
  ),
};
