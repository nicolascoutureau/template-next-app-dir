import type { Meta, StoryObj } from "@storybook/react";
import { Liquid } from "../../remotion/library/components/effects/Liquid";
import { RemotionWrapper } from "../helpers/RemotionWrapper";
import { useCurrentFrame } from "remotion";

const meta: Meta<typeof Liquid> = {
  title: "Effects/Liquid",
  component: Liquid,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Liquid>;

const MovingBalls = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transform: `translate(-50%, -50%) translate(${Math.sin(t) * 50}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transform: `translate(-50%, -50%) translate(${Math.cos(t) * 50}px, 0)`,
        }}
      />
    </>
  );
};

export const MergingBlobs: Story = {
  args: {
    blur: 20,
    threshold: 18,
    backgroundColor: "#000",
    color: "#00ff88",
    children: <MovingBalls />,
    style: { width: "100%", height: "100%" },
  },
};

const MorphingText = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: 100,
        fontWeight: "900",
        fontFamily: "Arial Black",
        color: "black",
        letterSpacing: -10,
      }}
    >
      LIQUID
    </div>
  );
};

export const TextMelt: Story = {
  args: {
    blur: 10,
    threshold: 20,
    backgroundColor: "#fff",
    children: <MorphingText />,
    style: { width: "100%", height: "100%" },
  },
};
