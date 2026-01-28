import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StorybookCanvas } from "../utils";
import {
  SplitText3DGsap,
  gsapPresetElastic,
  gsapPresetFadeUp,
  gsapPresetWordByWord,
  // In/Out presets
  gsapPresetFadeUpInOut,
  gsapPresetScaleInOut,
  gsapPreset3DFlipInOut,
  gsapPresetWordByWordInOut,
  gsapPresetSlideInOut,
  gsapPresetLinesSweepInOut,
} from "./SplitText3DGsap";

/** Helper wrapper that auto-remounts StorybookCanvas to handle WebGL context issues */
const AutoRemountCanvas: React.FC<{ children: React.ReactNode; fps?: number; durationInFrames?: number }> = ({
  children,
  fps = 30,
  durationInFrames = 90,
}) => {
  const [key, setKey] = React.useState(0);
  
  // Auto-remount after 200ms to ensure clean WebGL context
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
 * SplitText3DGsap provides GSAP-powered 3D text animations similar to GSAP SplitText.
 *
 * It splits text into characters, words, and lines, allowing you to animate each level independently
 * using a GSAP timeline.
 */
const meta: Meta<typeof SplitText3DGsap> = {
  title: "Text/SplitText3DGsap",
  component: SplitText3DGsap,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SplitText3DGsap>;

const fontUrl = "/fonts/Poppins-SemiBold.ttf";

/**
 * Basic elastic animation preset
 */
export const Elastic: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <SplitText3DGsap
        text="Hello World"
        fontUrl={fontUrl}
        fontSize={1}
        color="#ffffff"
        position={[0, 0, 0]}
        createTimeline={gsapPresetElastic()}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Fade up animation with stagger
 */
export const FadeUp: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={90}>
      <SplitText3DGsap
        text="Animate Text"
        fontUrl={fontUrl}
        fontSize={1.2}
        color="#60a5fa"
        position={[0, 0, 0]}
        createTimeline={gsapPresetFadeUp()}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Word-by-word animation
 */
export const WordByWord: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <SplitText3DGsap
        text="Animate Each Word"
        fontUrl={fontUrl}
        fontSize={0.8}
        color="#22c55e"
        position={[0, 0, 0]}
        createTimeline={gsapPresetWordByWord()}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Rainbow colors per character
 */
export const RainbowColors: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <SplitText3DGsap
        text="Rainbow"
        fontUrl={fontUrl}
        fontSize={1.5}
        position={[0, 0, 0]}
        charColor={(_char: string, index: number, total: number) =>
          `hsl(${(index / total) * 360}, 80%, 65%)`
        }
        createTimeline={gsapPresetElastic()}
      />
    </AutoRemountCanvas>
  ),
};

// ============================================================================
// IN/OUT ANIMATION EXAMPLES
// ============================================================================

/**
 * Fade Up In/Out - Characters fade up in, hold, then fade down out
 */
export const FadeUpInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <SplitText3DGsap
        text="Hello World"
        fontUrl={fontUrl}
        fontSize={1.2}
        color="#60a5fa"
        position={[0, 0, 0]}
        createTimeline={gsapPresetFadeUpInOut(0.6, 1.5, 0.4, 0.03)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Scale In/Out - Characters scale up elastically, hold, then shrink away
 */
export const ScaleInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <SplitText3DGsap
        text="Bounce!"
        fontUrl={fontUrl}
        fontSize={1.5}
        color="#f472b6"
        position={[0, 0, 0]}
        createTimeline={gsapPresetScaleInOut(0.8, 1.2, 0.3, 0.05)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * 3D Flip In/Out - Characters flip in from behind, hold, then flip out
 */
export const FlipInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <SplitText3DGsap
        text="3D Flip"
        fontUrl={fontUrl}
        fontSize={1.3}
        color="#22c55e"
        position={[0, 0, 0]}
        createTimeline={gsapPreset3DFlipInOut(0.7, 1.5, 0.5, 0.05)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Word by Word In/Out - Words animate in sequentially, then out in reverse
 */
export const WordInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={180}>
      <SplitText3DGsap
        text="Word By Word"
        fontUrl={fontUrl}
        fontSize={1}
        color="#fbbf24"
        position={[0, 0, 0]}
        createTimeline={gsapPresetWordByWordInOut(0.5, 1.0, 0.3)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Slide In/Out - Characters slide in from alternating sides, then slide out
 */
export const SlideInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <SplitText3DGsap
        text="Slide"
        fontUrl={fontUrl}
        fontSize={1.5}
        color="#a855f7"
        position={[0, 0, 0]}
        createTimeline={gsapPresetSlideInOut(0.5, 1.5, 0.4, 0.04)}
      />
    </AutoRemountCanvas>
  ),
};

/**
 * Lines Sweep In/Out - Multi-line text with lines sweeping in and out
 */
export const LinesSweepInOut: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={180}>
      <SplitText3DGsap
        text={"Line One\nLine Two\nLine Three"}
        fontUrl={fontUrl}
        fontSize={0.8}
        color="#38bdf8"
        position={[0, 0, 0]}
        createTimeline={gsapPresetLinesSweepInOut(0.6, 1.5, 0.4, 0.25)}
      />
    </AutoRemountCanvas>
  ),
};
