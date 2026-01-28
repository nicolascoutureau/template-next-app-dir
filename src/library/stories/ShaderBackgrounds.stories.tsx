import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RemotionPreview } from "./RemotionPreview";
import {
  LavaShader,
  StripeGradientMesh,
  AuroraBackground,
  NoiseGradient,
  PlasmaBackground,
  MetaballsBackground,
  WaveGridBackground,
  GradientOrbs,
  FluidSimulation,
  ParticleNebula,
  GradientBackground,
} from "../backgrounds";
import { AbsoluteFill } from "remotion";

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
// LAVA SHADER
// ============================================================================

export const LavaClassic: Story = {
  name: "Lava - Classic Magma",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <LavaShader
          primaryColor="#ff4500"
          secondaryColor="#ff8c00"
          backgroundColor="#1a0000"
          scale={3}
          glowIntensity={0.8}
          width={W}
          height={H}
        />
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
        <LavaShader
          primaryColor="#00bfff"
          secondaryColor="#0040ff"
          backgroundColor="#000020"
          scale={4}
          glowIntensity={0.9}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const LavaPurple: Story = {
  name: "Lava - Purple Energy",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <LavaShader
          primaryColor="#9333ea"
          secondaryColor="#ec4899"
          backgroundColor="#0a0015"
          scale={2.5}
          glowIntensity={0.7}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// STRIPE GRADIENT MESH
// ============================================================================

export const StripeDefault: Story = {
  name: "Stripe - Default",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <StripeGradientMesh
          colors={["#7928CA", "#FF0080", "#FF4D4D", "#F9CB28", "#4DFFDF"]}
          amplitude={0.2}
          width={W}
          height={H}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-white mix-blend-overlay">
            GRADIENT MESH
          </div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const StripeOcean: Story = {
  name: "Stripe - Ocean",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <StripeGradientMesh
          colors={["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"]}
          amplitude={0.3}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const StripeSunset: Story = {
  name: "Stripe - Sunset",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <StripeGradientMesh
          colors={["#1a1a2e", "#e94560", "#ff6b6b", "#ffd93d", "#ffb347"]}
          amplitude={0.25}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// AURORA BACKGROUND
// ============================================================================

export const AuroraClassic: Story = {
  name: "Aurora - Northern Lights",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <AuroraBackground
          colors={["#00ff87", "#60efff", "#ff00ff"]}
          backgroundColor="#0a0a1a"
          intensity={0.7}
          width={W}
          height={H}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-white/80">AURORA</div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const AuroraPurple: Story = {
  name: "Aurora - Purple Dreams",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <AuroraBackground
          colors={["#8b5cf6", "#ec4899", "#06b6d4"]}
          backgroundColor="#0f0f23"
          intensity={0.9}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// NOISE GRADIENT
// ============================================================================

export const NoiseWarm: Story = {
  name: "Noise - Warm Sunset",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <NoiseGradient
          colors={["#1a1a2e", "#16213e", "#e94560", "#ff6b6b"]}
          noiseType="simplex"
          scale={3}
          grain={0.03}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const NoiseVoronoi: Story = {
  name: "Noise - Voronoi Cells",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <NoiseGradient
          colors={["#0f0f23", "#1e3a5f", "#3d5a80", "#98c1d9"]}
          noiseType="voronoi"
          scale={5}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const NoiseWorley: Story = {
  name: "Noise - Worley Pattern",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <NoiseGradient
          colors={["#0d1117", "#161b22", "#21262d", "#30363d"]}
          noiseType="worley"
          scale={4}
          contrast={1.2}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// PLASMA BACKGROUND
// ============================================================================

export const PlasmaClassic: Story = {
  name: "Plasma - Classic",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <PlasmaBackground style="classic" complexity={1} width={W} height={H} />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaNeon: Story = {
  name: "Plasma - Neon Cyberpunk",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <PlasmaBackground style="neon" complexity={1.5} width={W} height={H} />
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
        <PlasmaBackground style="fire" complexity={1.2} width={W} height={H} />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const PlasmaPsychedelic: Story = {
  name: "Plasma - Psychedelic",
  render: () => (
    <AutoRemount durationInFrames={120}>
      <AbsoluteFill>
        <PlasmaBackground
          style="psychedelic"
          complexity={2}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// METABALLS BACKGROUND
// ============================================================================

export const MetaballsPurple: Story = {
  name: "Metaballs - Purple Pink",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <MetaballsBackground
          primaryColor="#8b5cf6"
          secondaryColor="#ec4899"
          backgroundColor="#1a1a2e"
          sharpness={0.5}
          glow
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const MetaballsGreen: Story = {
  name: "Metaballs - Organic Green",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <MetaballsBackground
          primaryColor="#22c55e"
          secondaryColor="#06b6d4"
          backgroundColor="#0a1628"
          sharpness={0.3}
          glow
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// WAVE GRID BACKGROUND
// ============================================================================

export const WaveGridSynthwave: Story = {
  name: "Wave Grid - Synthwave",
  render: () => (
    <AutoRemount durationInFrames={150}>
      <AbsoluteFill>
        <WaveGridBackground
          lineColor="#ff00ff"
          glowColor="#00ffff"
          backgroundColor="#0a0015"
          gridDensity={20}
          amplitude={0.2}
          perspective={0.5}
          width={W}
          height={H}
        />
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
        <WaveGridBackground
          lineColor="#3b82f6"
          glowColor="#60a5fa"
          backgroundColor="#0f172a"
          amplitude={0.1}
          gridDensity={25}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// GRADIENT ORBS
// ============================================================================

export const GradientOrbsPastel: Story = {
  name: "Gradient Orbs - Soft Pastels",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <GradientOrbs
          colors={["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"]}
          backgroundColor="#1e1b4b"
          blur={0.6}
          orbSize={0.3}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const GradientOrbsVibrant: Story = {
  name: "Gradient Orbs - Vibrant",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <GradientOrbs
          colors={["#ff0080", "#7928ca", "#0070f3", "#00dfd8", "#ff4d4d"]}
          backgroundColor="#0a0a0a"
          blur={0.8}
          orbSize={0.35}
          width={W}
          height={H}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-white/90">DYNAMIC</div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// FLUID SIMULATION
// ============================================================================

export const FluidInk: Story = {
  name: "Fluid - Ink in Water",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <FluidSimulation
          colors={["#1e3a8a", "#7c3aed", "#db2777"]}
          backgroundColor="#0f0f23"
          turbulence={0.5}
          viscosity={1}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const FluidLava: Story = {
  name: "Fluid - Slow Lava",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <FluidSimulation
          colors={["#dc2626", "#f97316", "#fbbf24"]}
          backgroundColor="#1c1917"
          viscosity={2}
          turbulence={0.3}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const FluidOcean: Story = {
  name: "Fluid - Ocean Currents",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <FluidSimulation
          colors={["#0284c7", "#06b6d4", "#22d3ee"]}
          backgroundColor="#0c1929"
          viscosity={1.5}
          turbulence={0.6}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

// ============================================================================
// PARTICLE NEBULA
// ============================================================================

export const NebulaClassic: Story = {
  name: "Nebula - Deep Space",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ParticleNebula
          colors={["#7c3aed", "#ec4899", "#06b6d4"]}
          backgroundColor="#050510"
          brightness={0.7}
          stars
          width={W}
          height={H}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-white/80">NEBULA</div>
        </div>
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const NebulaFire: Story = {
  name: "Nebula - Fiery",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ParticleNebula
          colors={["#dc2626", "#f97316", "#fbbf24"]}
          backgroundColor="#0a0505"
          brightness={0.9}
          stars
          density={4}
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};

export const NebulaGreen: Story = {
  name: "Nebula - Cosmic Green",
  render: () => (
    <AutoRemount durationInFrames={180}>
      <AbsoluteFill>
        <ParticleNebula
          colors={["#059669", "#10b981", "#34d399"]}
          backgroundColor="#030a08"
          brightness={0.8}
          stars
          width={W}
          height={H}
        />
      </AbsoluteFill>
    </AutoRemount>
  ),
};
