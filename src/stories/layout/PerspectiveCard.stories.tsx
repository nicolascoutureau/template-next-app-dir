import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { PerspectiveCard } from "../../remotion/library/components/layout";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof PerspectiveCard> = {
  title: "Layout/PerspectiveCard",
  component: PerspectiveCard,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0f0f23">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    rotateX: { control: { type: "range", min: -30, max: 30, step: 1 } },
    rotateY: { control: { type: "range", min: -45, max: 45, step: 1 } },
    perspective: { control: { type: "range", min: 400, max: 2000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof PerspectiveCard>;

const AppCard = () => (
  <div
    style={{
      width: 320,
      height: 200,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: 16,
      padding: 24,
      color: "#fff",
      fontFamily: "system-ui",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div style={{ fontSize: 14, opacity: 0.8 }}>DASHBOARD</div>
    <div>
      <div style={{ fontSize: 36, fontWeight: 800 }}>$12,450</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>Revenue this month</div>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    rotateX: 5,
    rotateY: -15,
    perspective: 1000,
  },
  render: (args) => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PerspectiveCard {...args}>
        <AppCard />
      </PerspectiveCard>
    </AbsoluteFill>
  ),
};

export const IsometricView: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PerspectiveCard rotateX={15} rotateY={-25} perspective={800}>
        <AppCard />
      </PerspectiveCard>
    </AbsoluteFill>
  ),
};

export const FlatAngle: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PerspectiveCard rotateX={25} rotateY={-5} perspective={600}>
        <AppCard />
      </PerspectiveCard>
    </AbsoluteFill>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <PerspectiveCard rotateX={5} rotateY={-15}>
        <div style={{ width: 200, height: 140, background: "linear-gradient(135deg, #f093fb, #f5576c)", borderRadius: 12 }} />
      </PerspectiveCard>
      <PerspectiveCard rotateX={5} rotateY={0}>
        <div style={{ width: 200, height: 140, background: "linear-gradient(135deg, #4facfe, #00f2fe)", borderRadius: 12 }} />
      </PerspectiveCard>
      <PerspectiveCard rotateX={5} rotateY={15}>
        <div style={{ width: 200, height: 140, background: "linear-gradient(135deg, #43e97b, #38f9d7)", borderRadius: 12 }} />
      </PerspectiveCard>
    </AbsoluteFill>
  ),
};
