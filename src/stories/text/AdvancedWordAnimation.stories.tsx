import type { Meta, StoryObj } from "@storybook/react";
import {
  CinematicWordReveal,
  ElasticWordPop,
  GlitchWordReveal,
  PerspectiveWordRotate,
  SlideUpWordReveal,
  TypewriterWord,
} from "../../remotion/library/components/text/AdvancedWordAnimation";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta = {
  title: "Text/AdvancedWordAnimation",
  component: SlideUpWordReveal, // Default component, stories will override
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#111111">
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 60, fontWeight: 800, textAlign: "center", color: "white" }}>
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SlideUpWordReveal>;

export const SlideUp: Story = {
  render: (args) => <SlideUpWordReveal {...args}>Design is intelligence made visible.</SlideUpWordReveal>,
  args: {
    stagger: 0.1,
    duration: 0.6,
  },
};

export const Cinematic: Story = {
  render: (args) => <CinematicWordReveal {...args}>Simplicity is the ultimate sophistication.</CinematicWordReveal>,
  args: {
    stagger: 0.15,
    duration: 0.8,
  },
};

export const Elastic: Story = {
  render: (args) => <ElasticWordPop {...args}>Make it pop!</ElasticWordPop>,
  args: {
    stagger: 0.05,
    duration: 0.8,
  },
};

export const Glitch: Story = {
  render: (args) => <GlitchWordReveal {...args}>System Failure Imminent</GlitchWordReveal>,
  args: {
    stagger: 0.1,
    duration: 0.5,
  },
};

export const Perspective: Story = {
  render: (args) => <PerspectiveWordRotate {...args}>Perspective changes everything.</PerspectiveWordRotate>,
  args: {
    stagger: 0.1,
    duration: 0.8,
  },
};

export const Typewriter: Story = {
  render: (args) => <TypewriterWord {...args}>Every word matters.</TypewriterWord>,
  args: {
    stagger: 0.2,
    duration: 0.01,
  },
};
