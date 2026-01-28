import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StorybookCanvas } from "../utils";
import {
  ExtrudedText3DGsap,
  extrudedPreset3DReveal,
  extrudedPresetFlipIn,
  extrudedPresetExplode,
  // In/Out presets
  extrudedPreset3DRevealInOut,
  extrudedPresetFlipInOut,
  extrudedPresetExplodeInOut,
  extrudedPresetSpinInOut,
} from "./ExtrudedText3DGsap";

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
 * ExtrudedText3DGsap creates true 3D text with depth using Three.js ExtrudeGeometry.
 */
const meta: Meta<typeof ExtrudedText3DGsap> = {
  title: "Text/ExtrudedText3DGsap",
  component: ExtrudedText3DGsap,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExtrudedText3DGsap>;

const fontUrl = "/fonts/Poppins-Bold.ttf";

/**
 * Cinematic 3D reveal animation
 */
export const Reveal3D: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <ExtrudedText3DGsap
        text="3D"
        fontUrl={fontUrl}
        fontSize={2}
        depth={0.3}
        bevelEnabled={true}
        bevelThickness={0.03}
        bevelSize={0.02}
        color="#60a5fa"
        metalness={0.5}
        roughness={0.3}
        position={[0, 0, 0]}
        createTimeline={extrudedPreset3DReveal}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Flip in from behind
 */
export const FlipIn: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <ExtrudedText3DGsap
        text="FLIP"
        fontUrl={fontUrl}
        fontSize={1.5}
        depth={0.2}
        bevelEnabled={false}
        color="#22c55e"
        metalness={0.3}
        roughness={0.5}
        position={[0, 0, 0]}
        createTimeline={extrudedPresetFlipIn}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Explode from center
 */
export const Explode: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <ExtrudedText3DGsap
        text="BOOM"
        fontUrl={fontUrl}
        fontSize={1.8}
        depth={0.25}
        bevelEnabled={true}
        color="#ef4444"
        metalness={0.6}
        roughness={0.2}
        position={[0, 0, 0]}
        createTimeline={extrudedPresetExplode}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Gold metallic text
 */
export const GoldMetallic: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <ExtrudedText3DGsap
        text="GOLD"
        fontUrl={fontUrl}
        fontSize={1.8}
        depth={0.3}
        bevelEnabled={true}
        bevelThickness={0.04}
        bevelSize={0.03}
        color="#fbbf24"
        metalness={0.9}
        roughness={0.1}
        position={[0, 0, 0]}
        createTimeline={extrudedPreset3DReveal}
      />
    </AutoRemountCanvas>
  ),
};

// ============================================================================
// IN/OUT ANIMATION EXAMPLES
// ============================================================================

/**
 * 3D Reveal In/Out - Dramatic depth reveal with exit
 */
export const Reveal3DInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <ExtrudedText3DGsap
        text="REVEAL"
        fontUrl={fontUrl}
        fontSize={1.5}
        depth={0.3}
        bevelEnabled={true}
        bevelThickness={0.03}
        bevelSize={0.02}
        color="#60a5fa"
        metalness={0.5}
        roughness={0.3}
        position={[0, 0, 0]}
        createTimeline={extrudedPreset3DRevealInOut(1.0, 1.5, 0.6, 0.04)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Flip In/Out - Characters flip in and out
 */
export const FlipInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <ExtrudedText3DGsap
        text="FLIP"
        fontUrl={fontUrl}
        fontSize={1.8}
        depth={0.25}
        bevelEnabled={true}
        color="#22c55e"
        metalness={0.4}
        roughness={0.4}
        position={[0, 0, 0]}
        createTimeline={extrudedPresetFlipInOut(0.7, 1.5, 0.5, 0.05)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Explode In/Out - Explode from center, implode to center
 */
export const ExplodeInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <ExtrudedText3DGsap
        text="BOOM"
        fontUrl={fontUrl}
        fontSize={1.8}
        depth={0.3}
        bevelEnabled={true}
        color="#ef4444"
        metalness={0.6}
        roughness={0.2}
        position={[0, 0, 0]}
        createTimeline={extrudedPresetExplodeInOut(0.8, 1.2, 0.5, 0.03)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Spin In/Out - Characters spin in and spin out
 */
export const SpinInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <ExtrudedText3DGsap
        text="SPIN"
        fontUrl={fontUrl}
        fontSize={1.6}
        depth={0.25}
        bevelEnabled={true}
        bevelThickness={0.03}
        bevelSize={0.02}
        color="#a855f7"
        metalness={0.5}
        roughness={0.3}
        position={[0, 0, 0]}
        createTimeline={extrudedPresetSpinInOut(0.8, 1.5, 0.5, 0.06)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Chrome In/Out - Shiny chrome metallic with in/out animation
 */
export const ChromeInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <ExtrudedText3DGsap
        text="CHROME"
        fontUrl={fontUrl}
        fontSize={1.3}
        depth={0.35}
        bevelEnabled={true}
        bevelThickness={0.04}
        bevelSize={0.03}
        color="#e8e8e8"
        metalness={0.95}
        roughness={0.05}
        position={[0, 0, 0]}
        createTimeline={extrudedPreset3DRevealInOut(1.2, 1.2, 0.6, 0.05)}
      />
    </AutoRemountCanvas>
  ),
};
