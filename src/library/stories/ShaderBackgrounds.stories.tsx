import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RemotionPreview } from "./RemotionPreview";
import {
  LavaShader,
  PlasmaBackground,
  MetaballsBackground,
  WaveGridBackground,
  GradientOrbs,
  GradientBackground,
} from "../backgrounds";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";

/**
 * Wrapper for shader backgrounds that need to be inside a ThreeCanvas.
 * These backgrounds are now just shader meshes without their own canvas.
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
// TEST - Simple CSS gradient (no WebGL)
// ============================================================================

export const TestSimple: Story = {
  name: "Test - Simple Gradient (No WebGL)",
  render: () => (
    <AutoRemount durationInFrames={60}>
      <AbsoluteFill>
        <GradientBackground
          type="linear"
          colors={["#ff0080", "#7928ca", "#0070f3"]}
          angle={135}
        />
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ fontSize: 48, fontWeight: "bold", color: "white" }}>
            TEST
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const TestBasic: Story = {
  name: "Test - Basic (Just Div)",
  render: () => (
    <AutoRemount durationInFrames={60}>
      <div style={{ 
        width: "100%", 
        height: "100%", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ color: "white", fontSize: 60, fontWeight: "bold" }}>
          HELLO
        </span>
      </div>
    </AutoRemount>
  ),
};

// ============================================================================
// LAVA SHADER (FAST)
// ============================================================================

export const LavaClassic: Story = {
  name: "Lava - Classic Magma",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <LavaShader
            primaryColor="#ff4500"
            secondaryColor="#ff8c00"
            backgroundColor="#1a0000"
            scale={3}
            glowIntensity={0.8}
          />
        </ShaderBackgroundCanvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-black text-white drop-shadow-2xl">
            LAVA
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const LavaBlue: Story = {
  name: "Lava - Blue Plasma",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <LavaShader
            primaryColor="#00bfff"
            secondaryColor="#0040ff"
            backgroundColor="#000020"
            scale={4}
            glowIntensity={0.9}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const LavaPurple: Story = {
  name: "Lava - Purple Energy",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <LavaShader
            primaryColor="#9333ea"
            secondaryColor="#ec4899"
            backgroundColor="#0a0015"
            scale={2.5}
            glowIntensity={0.7}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// PLASMA BACKGROUND (FAST - only sin functions)
// ============================================================================

export const PlasmaClassic: Story = {
  name: "Plasma - Classic",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <PlasmaBackground style="classic" complexity={1} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaNeon: Story = {
  name: "Plasma - Neon Cyberpunk",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <PlasmaBackground style="neon" complexity={1.5} />
        </ShaderBackgroundCanvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-black text-white mix-blend-difference">
            NEON
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaFire: Story = {
  name: "Plasma - Fire",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <PlasmaBackground style="fire" complexity={1.2} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaOcean: Story = {
  name: "Plasma - Ocean",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <PlasmaBackground style="ocean" complexity={1} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaPsychedelic: Story = {
  name: "Plasma - Psychedelic",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <PlasmaBackground style="psychedelic" complexity={2} />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// METABALLS BACKGROUND (FAST - simple math)
// ============================================================================

export const MetaballsPurple: Story = {
  name: "Metaballs - Purple Pink",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <MetaballsBackground
            primaryColor="#8b5cf6"
            secondaryColor="#ec4899"
            backgroundColor="#1a1a2e"
            sharpness={0.5}
            glow
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const MetaballsGreen: Story = {
  name: "Metaballs - Organic Green",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <MetaballsBackground
            primaryColor="#22c55e"
            secondaryColor="#06b6d4"
            backgroundColor="#0a1628"
            sharpness={0.3}
            glow
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const MetaballsOrange: Story = {
  name: "Metaballs - Sunset Orange",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <MetaballsBackground
            primaryColor="#f97316"
            secondaryColor="#fbbf24"
            backgroundColor="#1c1917"
            sharpness={0.4}
            glow
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// WAVE GRID BACKGROUND (FAST - simple math)
// ============================================================================

export const WaveGridSynthwave: Story = {
  name: "Wave Grid - Synthwave",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <WaveGridBackground
            lineColor="#ff00ff"
            glowColor="#00ffff"
            backgroundColor="#0a0015"
            gridDensity={20}
            amplitude={0.2}
            perspective={0.5}
          />
        </ShaderBackgroundCanvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
            RETRO
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const WaveGridTech: Story = {
  name: "Wave Grid - Tech",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <WaveGridBackground
            lineColor="#3b82f6"
            glowColor="#60a5fa"
            backgroundColor="#0f172a"
            amplitude={0.1}
            gridDensity={25}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const WaveGridNeon: Story = {
  name: "Wave Grid - Neon Green",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <WaveGridBackground
            lineColor="#22c55e"
            glowColor="#4ade80"
            backgroundColor="#052e16"
            gridDensity={18}
            amplitude={0.15}
            perspective={0.6}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// GRADIENT ORBS (FAST - distance calculations)
// ============================================================================

export const GradientOrbsPastel: Story = {
  name: "Gradient Orbs - Soft Pastels",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"]}
            backgroundColor="#1e1b4b"
            blur={0.6}
            orbSize={0.3}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const GradientOrbsVibrant: Story = {
  name: "Gradient Orbs - Vibrant",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#ff0080", "#7928ca", "#0070f3", "#00dfd8", "#ff4d4d"]}
            backgroundColor="#0a0a0a"
            blur={0.8}
            orbSize={0.35}
          />
        </ShaderBackgroundCanvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-white/90">DYNAMIC</div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const GradientOrbsSunset: Story = {
  name: "Gradient Orbs - Sunset",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ShaderBackgroundCanvas width={W} height={H}>
          <GradientOrbs
            colors={["#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#fbbf24"]}
            backgroundColor="#1c1917"
            blur={0.7}
            orbSize={0.32}
          />
        </ShaderBackgroundCanvas>
      </AbsoluteFill>
    </AutoRemount>
  ),
};
