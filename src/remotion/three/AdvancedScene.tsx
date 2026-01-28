import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { RotatingBox } from "./components/RotatingBox";
import { OrbitingObjects } from "./components/OrbitingObjects";
import { Lights } from "./components/Lights";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Stars } from "@react-three/drei";

// Schema for the advanced scene props
export const advancedSceneSchema = z.object({
  boxColor: zColor(),
  backgroundColor: zColor(),
  rotationSpeed: z.number().default(1),
  showOrbiting: z.boolean().default(true),
  showStars: z.boolean().default(true),
});

export type AdvancedSceneProps = z.infer<typeof advancedSceneSchema>;

export const AdvancedScene: React.FC<AdvancedSceneProps> = ({
  boxColor,
  backgroundColor,
  rotationSpeed,
  showOrbiting = true,
  showStars = true,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          fov: 75,
          position: [0, 2, 8],
        }}
      >
        <Lights />

        {/* Background stars */}
        {showStars && (
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        )}

        {/* Central rotating box */}
        <RotatingBox color={boxColor} rotationSpeed={rotationSpeed} />

        {/* Orbiting spheres */}
        {showOrbiting && (
          <OrbitingObjects
            count={6}
            radius={4}
            colors={["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#a8e6cf", "#dcedc1"]}
          />
        )}

        {/* Ground plane with reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
