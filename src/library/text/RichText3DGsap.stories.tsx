import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StorybookCanvas } from "../utils";
import {
  RichText3DGsap,
  richTextPresetSegmentStagger,
  richTextPresetWave,
  richTextPresetTypewriter,
} from "./RichText3DGsap";

/** Helper wrapper that auto-remounts StorybookCanvas to handle WebGL context issues */
const AutoRemountCanvas: React.FC<{ children: React.ReactNode; fps?: number; durationInFrames?: number }> = ({
  children,
  fps = 30,
  durationInFrames = 90,
}) => {
  const [key, setKey] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      <button
        onClick={() => setKey(k => k + 1)}
        style={{ marginBottom: 10, padding: "8px 16px", cursor: "pointer", fontSize: 12 }}
      >
        Remount if blank (key: {key})
      </button>
      <StorybookCanvas key={key} fps={fps} durationInFrames={durationInFrames}>
        {children}
      </StorybookCanvas>
    </div>
  );
};

/**
 * RichText3DGsap allows multiple fonts, sizes, and colors in a single text block.
 */
const meta: Meta<typeof RichText3DGsap> = {
  title: "Text/RichText3DGsap",
  component: RichText3DGsap,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RichText3DGsap>;

const interFont = "/fonts/Inter-Regular.ttf";
const poppinsFont = "/fonts/Poppins-SemiBold.ttf";
const playfairFont = "/fonts/PlayfairDisplay-Bold.ttf";

/**
 * Multiple fonts in one line
 */
export const MixedFonts: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <RichText3DGsap
        segments={[
          { text: "Build ", fontUrl: interFont, color: "#94a3b8" },
          { text: "amazing ", fontUrl: poppinsFont, color: "#60a5fa" },
          { text: "videos", fontUrl: playfairFont, color: "#f472b6" },
        ]}
        fontSize={0.6}
        position={[0, 0, 0]}
        createTimeline={richTextPresetSegmentStagger}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Wave animation across all segments
 */
export const WaveAnimation: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <RichText3DGsap
        segments={[
          { text: "Wave ", fontUrl: poppinsFont, color: "#22c55e" },
          { text: "Animation ", fontUrl: poppinsFont, color: "#3b82f6" },
          { text: "Effect", fontUrl: poppinsFont, color: "#a855f7" },
        ]}
        fontSize={0.7}
        position={[0, 0, 0]}
        createTimeline={richTextPresetWave}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Typewriter effect
 */
export const Typewriter: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <RichText3DGsap
        segments={[
          { text: "Type ", fontUrl: interFont, color: "#ffffff" },
          { text: "this ", fontUrl: interFont, color: "#60a5fa" },
          { text: "text", fontUrl: interFont, color: "#22c55e" },
        ]}
        fontSize={0.8}
        position={[0, 0, 0]}
        createTimeline={richTextPresetTypewriter}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Brand highlight style
 */
export const BrandHighlight: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <RichText3DGsap
        segments={[
          { text: "Powered by ", fontUrl: interFont, color: "#94a3b8" },
          { text: "Remotion", fontUrl: playfairFont, color: "#60a5fa" },
        ]}
        fontSize={0.5}
        position={[0, 0, 0]}
        createTimeline={richTextPresetSegmentStagger}
      />
    </AutoRemountCanvas>
  ),
};
