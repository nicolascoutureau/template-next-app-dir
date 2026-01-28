import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { ParticleDissolve, GradientBackground } from "../index";
import type { ParticleDissolveProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<ParticleDissolveProps> = {
  title: "Motion Library/Transitions/ParticleDissolve",
  component: ParticleDissolve,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    pattern: {
      control: "select",
      options: ["scatter", "vortex", "explosion", "gravity", "wind"],
    },
    mode: {
      control: "select",
      options: ["in", "out"],
    },
  },
};

export default meta;
type Story = StoryObj<ParticleDissolveProps>;

export const ScatterDissolve: Story = {
  name: "Scatter Dissolve",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ParticleDissolve
          pattern="scatter"
          mode="out"
          startFrame={20}
          durationInFrames={50}
          columns={15}
          rows={10}
          intensity={1.5}
          stagger={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <GradientBackground
              type="linear"
              colors={["#8b5cf6", "#ec4899"]}
              angle={135}
              width={800}
              height={450}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">SCATTER</div>
            </div>
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const VortexReveal: Story = {
  name: "Vortex Reveal",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <ParticleDissolve
          pattern="vortex"
          mode="in"
          startFrame={5}
          durationInFrames={60}
          columns={12}
          rows={8}
          intensity={1.2}
          stagger={0.4}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-cyan-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">VORTEX</div>
            </div>
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const ExplosionEffect: Story = {
  name: "Explosion",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ParticleDissolve
          pattern="explosion"
          mode="out"
          startFrame={20}
          durationInFrames={40}
          columns={15}
          rows={10}
          intensity={2}
          stagger={0.3}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-orange-500 to-red-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-black text-white">BOOM</div>
            </div>
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const GravityFall: Story = {
  name: "Gravity Fall",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ParticleDissolve
          pattern="gravity"
          mode="out"
          startFrame={20}
          durationInFrames={50}
          columns={20}
          rows={12}
          intensity={1.5}
          stagger={0.6}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
              alt="Mountain"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const WindSweep: Story = {
  name: "Wind Sweep",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <ParticleDissolve
          pattern="wind"
          mode="out"
          startFrame={20}
          durationInFrames={50}
          columns={18}
          rows={10}
          intensity={1.3}
          stagger={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-r from-emerald-400 to-teal-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white">WIND</div>
            </div>
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const Materialize: Story = {
  name: "Materialize (Reverse)",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <ParticleDissolve
          pattern="scatter"
          mode="in"
          startFrame={5}
          durationInFrames={60}
          columns={15}
          rows={10}
          intensity={1.5}
          stagger={0.5}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill className="bg-gradient-to-br from-violet-600 to-purple-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-white">MATERIALIZE</div>
            </div>
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

export const HighDensity: Story = {
  name: "High Density Particles",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-black">
        <ParticleDissolve
          pattern="explosion"
          mode="out"
          startFrame={20}
          durationInFrames={50}
          columns={25}
          rows={15}
          intensity={1}
          stagger={0.4}
          style={{ position: "absolute", inset: 0 }}
        >
          <AbsoluteFill>
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop"
              alt="Night"
              className="h-full w-full object-cover"
            />
          </AbsoluteFill>
        </ParticleDissolve>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
