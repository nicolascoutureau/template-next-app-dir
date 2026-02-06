import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ZoomTransition } from "../../remotion/library/components/layout";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof ZoomTransition> = {
  title: "Layout/ZoomTransition",
  component: ZoomTransition,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0f0f23">
        <Story />
      </RemotionWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ZoomTransition>;

const SceneContent = ({ label, bg }: { label: string; bg: string }) => (
  <AbsoluteFill
    style={{
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ color: "#fff", fontFamily: "system-ui", textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 800 }}>{label}</div>
    </div>
  </AbsoluteFill>
);

const AnimatedZoomIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [fps * 1, fps * 3], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ZoomTransition progress={progress} startScale={1} endScale={20}>
      <SceneContent label="ZOOM IN" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
    </ZoomTransition>
  );
};

export const ZoomIn: Story = {
  render: () => <AnimatedZoomIn />,
};

const AnimatedZoomOut = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, fps * 2], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  return (
    <ZoomTransition progress={progress} startScale={20} endScale={1}>
      <SceneContent label="ZOOM OUT" bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
    </ZoomTransition>
  );
};

export const ZoomOut: Story = {
  render: () => <AnimatedZoomOut />,
};

const AnimatedSubtle = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, fps * 3], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  return (
    <ZoomTransition progress={progress} startScale={1} endScale={1.3}>
      <SceneContent label="SUBTLE PUSH" bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" />
    </ZoomTransition>
  );
};

export const SubtleZoom: Story = {
  render: () => <AnimatedSubtle />,
};
