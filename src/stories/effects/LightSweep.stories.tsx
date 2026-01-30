import type { Meta, StoryObj } from "@storybook/react";
import { LightSweep } from "../../remotion/library/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof LightSweep> = {
  title: "Effects/LightSweep",
  component: LightSweep,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0b0b12">
        <Story />
      </RemotionWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LightSweep>;

const Card = ({ label }: { label: string }) => (
  <div
    style={{
      padding: "28px 48px",
      borderRadius: 20,
      background: "linear-gradient(135deg, #1f2a44 0%, #0b1220 100%)",
      color: "#e5e7eb",
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: "0.03em",
      fontFamily: "system-ui",
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    }}
  >
    {label}
  </div>
);

export const Default: Story = {
  args: {
    intensity: 0.8,
    width: 16,
    duration: 1.8,
  },
  render: (args) => (
    <LightSweep {...args}>
      <Card label="Specular Sweep" />
    </LightSweep>
  ),
};

export const SubtleText: Story = {
  render: () => (
    <LightSweep
      intensity={0.5}
      width={12}
      duration={2.2}
      angle={12}
      color="rgba(255, 255, 255, 0.7)"
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#f8fafc",
          letterSpacing: "-0.02em",
          fontFamily: "system-ui",
        }}
      >
        Light Sweep
      </div>
    </LightSweep>
  ),
};
