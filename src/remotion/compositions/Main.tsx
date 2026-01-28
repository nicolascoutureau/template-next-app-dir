import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import { Text } from "@react-three/drei";

// Inter Bold font from public folder
const interFontUrl = staticFile("fonts/Inter-Bold.ttf");

// Animated 3D Text component
const AnimatedText: React.FC<{
  text: string;
  position: [number, number, number];
  color: string;
  delay?: number;
  fontSize?: number;
}> = ({ text, position, color, delay = 0, fontSize = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance animation
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 80,
      stiffness: 150,
      mass: 0.8,
    },
    delay,
  });

  // Y position animation (rise up)
  const yOffset = interpolate(entrance, [0, 1], [-2, 0]);

  // Rotation animation
  const rotationX = interpolate(entrance, [0, 1], [Math.PI / 4, 0]);

  // Opacity
  const opacity = interpolate(entrance, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <Text
      position={[position[0], position[1] + yOffset, position[2]]}
      rotation={[rotationX, 0, 0]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={opacity}
      font={interFontUrl}
    >
      {text}
    </Text>
  );
};

// Floating decorative sphere
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

  // Floating animation
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

// Rotating torus decoration
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

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <>
      {/* Thumbnail artifact */}
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
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 5, 5]} intensity={0.5} color="#60a5fa" />

          {/* Main text */}
          <AnimatedText
            text="welcome to"
            position={[0, 1, 0]}
            color="#ffffff"
            delay={0}
            fontSize={0.8}
          />
          <AnimatedText
            text="Motionabl"
            position={[0, -0.5, 0]}
            color="#60a5fa"
            delay={15}
            fontSize={1.4}
          />

          {/* Decorative elements */}
          <RotatingTorus />

          {/* Floating spheres */}
          <FloatingSphere position={[-4, 2, -1]} color="#f472b6" delay={30} />
          <FloatingSphere position={[4, -1, -1]} color="#34d399" delay={35} />
          <FloatingSphere
            position={[-3, -2, 0]}
            color="#fbbf24"
            delay={40}
            size={0.2}
          />
          <FloatingSphere
            position={[3.5, 1.5, -0.5]}
            color="#a78bfa"
            delay={45}
            size={0.25}
          />
        </ThreeCanvas>
      </AbsoluteFill>
    </>
  );
};
