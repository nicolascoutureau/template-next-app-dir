import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { RotatingBox } from "./components/RotatingBox";
import { Lights } from "./components/Lights";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Scene container styles
const container: React.CSSProperties = {
  backgroundColor: "#1a1a2e",
};

// Schema for the scene props
export const sceneSchema = z.object({
  boxColor: zColor(),
  backgroundColor: zColor(),
  rotationSpeed: z.number().default(1),
});

export type SceneProps = z.infer<typeof sceneSchema>;

export const Scene: React.FC<SceneProps> = ({
  boxColor,
  backgroundColor,
  rotationSpeed,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ ...container, backgroundColor }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          fov: 75,
          position: [0, 0, 5],
        }}
      >
        <Lights />
        <RotatingBox color={boxColor} rotationSpeed={rotationSpeed} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
