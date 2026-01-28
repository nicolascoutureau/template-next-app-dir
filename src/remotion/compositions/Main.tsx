import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";
import React from "react";
import { SplitText3D } from "../three/text";

// Inter Bold font from public folder
const interFontUrl = staticFile("fonts/Inter-Bold.ttf");

// ============================================================================
// DECORATIVE COMPONENTS
// ============================================================================

const FloatingSphere: React.FC<{
  position: [number, number, number];
  color: string;
  delay: number;
  size?: number;
}> = ({ position, color, delay, size = 0.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
    delay,
  });

  const floatY = Math.sin((frame / fps) * Math.PI * 2) * 0.1;

  return (
    <mesh
      position={[position[0], position[1] + floatY, position[2]]}
      scale={entrance}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.4}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const RotatingTorus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 100, stiffness: 100, mass: 1 },
    delay: 20,
  });

  const rotation = (frame / fps) * 0.5;

  return (
    <mesh
      position={[0, 0, -2]}
      rotation={[rotation, rotation * 0.5, 0]}
      scale={entrance * 3}
    >
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Rainbow color function for characters
  const rainbowColor = (char: string, index: number, total: number): string => {
    const hue = (index / total) * 360;
    return `hsl(${hue}, 80%, 65%)`;
  };

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{
            fov: 50,
            position: [0, 0, 10],
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} />
          <pointLight position={[0, 5, 5]} intensity={0.6} color="#60a5fa" />

          {/* Main text with split animation */}
          <SplitText3D
            text="welcome to"
            fontUrl={interFontUrl}
            position={[0, 1.2, 0]}
            color="#ffffff"
            fontSize={0.7}
            delay={0}
            preset="cascade"
            continuousAnimation={{
              wave: { amplitude: 0.05, frequency: 3 },
            }}
          />

          {/* Brand name with elastic animation and rainbow colors */}
          <SplitText3D
            text="Motionabl"
            fontUrl={interFontUrl}
            position={[0, -0.3, 0]}
            fontSize={1.2}
            delay={25}
            preset="elastic"
            charColor={rainbowColor}
            continuousAnimation={{
              pulse: { min: 0.98, max: 1.02, frequency: 4 },
            }}
          />

          {/* Decorative elements */}
          <RotatingTorus />

          <FloatingSphere position={[-4, 2, -1]} color="#f472b6" delay={50} />
          <FloatingSphere position={[4, -1, -1]} color="#34d399" delay={55} />
          <FloatingSphere
            position={[-3, -2, 0]}
            color="#fbbf24"
            delay={60}
            size={0.2}
          />
          <FloatingSphere
            position={[3.5, 1.5, -0.5]}
            color="#a78bfa"
            delay={65}
            size={0.25}
          />
        </ThreeCanvas>
      </AbsoluteFill>
    </>
  );
};
