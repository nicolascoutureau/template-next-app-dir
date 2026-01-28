import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RemotionPreview } from "./RemotionPreview";
import {
  FluidGradient,
  AuroraBackground,
  SoftBlobs,
  SubtleGrid,
  GradientOrbs,
  GradientBackground,
} from "../backgrounds";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";

/**
 * Wrapper for shader backgrounds that need to be inside a ThreeCanvas.
 */
const ShaderBackgroundCanvas: React.FC<{
  children: React.ReactNode;
  width: number;
  height: number;
}> = ({ children, width, height }) => (
  <ThreeCanvas
    width={width}
    height={height}
    camera={{ position: [0, 0, 1], fov: 90 }}
  >
    {children}
  </ThreeCanvas>
);

const meta: Meta = {
  title: "Motion Library/Backgrounds",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

const W = 1280;
const H = 720;

/** Helper wrapper that auto-remounts to handle context issues */
const AutoRemount: React.FC<{ 
  children: React.ReactNode; 
  fps?: number; 
  durationInFrames?: number;
  width?: number;
  height?: number;
}> = ({
  children,
  fps = 30,
  durationInFrames = 150,
  width = W,
  height = H,
}) => {
  const [key, setKey] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <button
        onClick={() => setKey(k => k + 1)}
        style={{ marginBottom: 10, padding: "8px 16px", cursor: "pointer", fontSize: 12 }}
      >
        Remount if blank (key: {key})
      </button>
      <RemotionPreview 
        key={key} 
        fps={fps} 
        durationInFrames={durationInFrames}
        width={width}
        height={height}
      >
        {children}
      </RemotionPreview>
    </div>
  );
};

// ============================================================================
// SIMPLE CSS GRADIENT (No WebGL)
// ============================================================================

export const GradientSimple: Story = {
  name: "Gradient - Simple CSS",
  render: () => (
    <AutoRemount durationInFrames={60}>
      <AbsoluteFill>
        <GradientBackground
          type="linear"
          colors={["#1a1a2e", "#2d2d44", "#3a3a5a"]}
          angle={135}
        />
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 48, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>
            PREMIUM
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// FLUID GRADIENT - Subtle flowing organic gradients
// ============================================================================

export const FluidGradientMidnight: Story = {
  name: "Fluid Gradient - Midnight",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <FluidGradient
            primaryColor="#6a80a0"
            secondaryColor="#4a5080"
            backgroundColor="#1a1a2e"
            speed={0.3}
            intensity={1.0}
          />
        </ShaderBackgroundCanvas>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 56, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>
            FLUID
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const FluidGradientWarm: Story = {
  name: "Fluid Gradient - Warm",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <FluidGradient
            primaryColor="#8a5a5a"
            secondaryColor="#6a4050"
            backgroundColor="#1a1518"
            speed={0.25}
            intensity={1.0}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const FluidGradientCool: Story = {
  name: "Fluid Gradient - Cool",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <FluidGradient
            primaryColor="#5a8aa0"
            secondaryColor="#4a6a80"
            backgroundColor="#151a20"
            speed={0.35}
            intensity={1.0}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// AURORA BACKGROUND - Subtle wave-like color transitions
// ============================================================================

export const AuroraMidnight: Story = {
  name: "Aurora - Midnight",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <AuroraBackground style="midnight" speed={0.25} intensity={0.8} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const AuroraDusk: Story = {
  name: "Aurora - Dusk",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <AuroraBackground style="dusk" speed={0.2} intensity={0.8} />
        </ShaderBackgroundCanvas>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>
            ELEGANT
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const AuroraForest: Story = {
  name: "Aurora - Forest",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <AuroraBackground style="forest" speed={0.3} intensity={0.45} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const AuroraOcean: Story = {
  name: "Aurora - Ocean",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <AuroraBackground style="ocean" speed={0.25} intensity={0.5} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// SOFT BLOBS - Gentle organic shapes
// ============================================================================

export const SoftBlobsMidnight: Story = {
  name: "Soft Blobs - Midnight",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SoftBlobs
            primaryColor="#5a7090"
            secondaryColor="#705078"
            backgroundColor="#1a1a2e"
            speed={0.25}
            softness={0.6}
            opacity={0.85}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const SoftBlobsWarm: Story = {
  name: "Soft Blobs - Warm Earth",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SoftBlobs
            primaryColor="#5a4a40"
            secondaryColor="#4a4035"
            backgroundColor="#1a1815"
            speed={0.2}
            softness={0.9}
            opacity={0.4}
          />
        </ShaderBackgroundCanvas>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 52, fontWeight: 400, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>
            ORGANIC
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const SoftBlobsCool: Story = {
  name: "Soft Blobs - Cool Steel",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SoftBlobs
            primaryColor="#4a5a6a"
            secondaryColor="#3a4a5a"
            backgroundColor="#15181c"
            speed={0.3}
            softness={0.85}
            opacity={0.5}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// SUBTLE GRID - Minimal elegant grid patterns
// ============================================================================

export const SubtleGridMinimal: Story = {
  name: "Subtle Grid - Minimal",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SubtleGrid
            lineColor="#7070a0"
            backgroundColor="#1a1a2e"
            lineOpacity={0.6}
            gridDensity={10}
            breathing={true}
          />
        </ShaderBackgroundCanvas>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 60, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>
            MINIMAL
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const SubtleGridDense: Story = {
  name: "Subtle Grid - Dense",
  render: () => (
    <AutoRemount durationInFrames={300}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SubtleGrid
            lineColor="#506070"
            backgroundColor="#0f1318"
            lineOpacity={0.5}
            gridDensity={16}
            breathing={true}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const SubtleGridStatic: Story = {
  name: "Subtle Grid - Static",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <SubtleGrid
            lineColor="#6a6a80"
            backgroundColor="#1a1a28"
            lineOpacity={0.55}
            gridDensity={8}
            breathing={false}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// GRADIENT ORBS - Soft floating color areas
// ============================================================================

export const GradientOrbsMuted: Story = {
  name: "Gradient Orbs - Muted",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#4a70a0", "#7a50a0", "#5080a0"]}
            backgroundColor="#1a1a2e"
            speed={0.3}
            blur={0.5}
            orbSize={0.55}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const GradientOrbsWarm: Story = {
  name: "Gradient Orbs - Warm",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#5a4540", "#4a4038", "#4a4545"]}
            backgroundColor="#1a1815"
            speed={0.25}
            blur={0.85}
            orbSize={0.55}
          />
        </ShaderBackgroundCanvas>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 50, fontWeight: 500, color: "rgba(255,255,255,0.88)", letterSpacing: "0.1em" }}>
            SUBTLE
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const GradientOrbsCool: Story = {
  name: "Gradient Orbs - Cool",
  render: () => (
    <AutoRemount durationInFrames={360}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#3a4a5a", "#4a5a6a", "#3a5a5a"]}
            backgroundColor="#12161a"
            speed={0.35}
            blur={0.75}
            orbSize={0.48}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};
