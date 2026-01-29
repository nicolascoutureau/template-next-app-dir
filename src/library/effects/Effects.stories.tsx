import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useEffect } from "react";
import { StorybookCanvas } from "../utils";
import { Glow } from "./Glow";
import { Shimmer } from "./Shimmer";

const AutoRemountCanvas: React.FC<{
  children: React.ReactNode;
  fps?: number;
  durationInFrames?: number;
}> = ({ children, fps = 30, durationInFrames = 150 }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setKey((prev) => prev + 1), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <button onClick={() => setKey((k) => k + 1)} style={{ marginBottom: 8 }}>
        Remount if blank (key: {key})
      </button>
      <StorybookCanvas key={key} fps={fps} durationInFrames={durationInFrames}>
        {children}
      </StorybookCanvas>
    </div>
  );
};

const meta: Meta = {
  title: "Effects",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const DemoBox = ({ color = "#4a90d9" }: { color?: string }) => (
  <mesh>
    <boxGeometry args={[1.5, 1.5, 1.5]} />
    <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
  </mesh>
);

export const GlowEffect: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <DemoBox />
      <Glow
        color="#00ffff"
        intensity={1.2}
        size={3}
        pulseSpeed={0.5}
        pulseAmount={0.3}
        position={[0, 0, -1]}
      />
    </AutoRemountCanvas>
  ),
};

export const ShimmerEffect: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={120}>
      <mesh>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
      </mesh>
      <Shimmer
        color="#ffffff"
        width={6}
        height={3}
        speed={0.8}
        angle={-0.4}
        thickness={0.08}
        position={[0, 0, 0.1]}
      />
    </AutoRemountCanvas>
  ),
};

export const Combined: Story = {
  render: () => (
    <AutoRemountCanvas fps={30} durationInFrames={150}>
      <DemoBox color="#9b59b6" />
      <Glow
        color="#9b59b6"
        intensity={0.8}
        size={4}
        pulseSpeed={1}
        pulseAmount={0.2}
        position={[0, 0, -1]}
      />
      <Shimmer
        color="#ffffff"
        width={5}
        height={3}
        speed={0.6}
        thickness={0.06}
        position={[0, 0, 1]}
      />
    </AutoRemountCanvas>
  ),
};
