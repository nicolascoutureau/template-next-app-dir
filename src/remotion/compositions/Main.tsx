import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import React from "react";
import { SplitText3DGsap, RichText3DGsap } from "../three/text";
import { getFontUrl } from "../fonts";

// Local fonts (downloaded via: npm run download-fonts)
// TypeScript ensures only valid font/weight combinations are allowed!
const poppinsFontUrl = getFontUrl("Poppins", 600);
const playfairFontUrl = getFontUrl("Playfair Display", 700);
const interFontUrl = getFontUrl("Inter", 400);

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

          {/* Main text - Poppins font, GSAP word animation */}
          <SplitText3DGsap
            text="welcome to"
            fontUrl={poppinsFontUrl}
            position={[0, 1.2, 0]}
            color="#ffffff"
            fontSize={0.7}
            createTimeline={({ tl, words }) => {
              // GSAP SplitText pattern with fromTo for proper animation
              words.forEach((word) => {
                // Animate word (moves all chars together)
                tl.fromTo(
                  word.state,
                  { y: 0.5, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
                )
                  // Animate chars within word (starts at same time!)
                  .fromTo(
                    word.chars,
                    { y: 0.3, opacity: 0 },
                    {
                      y: 0,
                      opacity: 1,
                      duration: 0.3,
                      stagger: 0.03,
                      ease: "power2.out",
                    },
                    "<", // Start at same time as word animation
                  );
              });

              return tl;
            }}
          />

          {/* Brand name - Playfair Display font, elastic char animation + rainbow */}
          <SplitText3DGsap
            text="Motionabl"
            fontUrl={playfairFontUrl}
            position={[0, -0.3, 0]}
            fontSize={1.2}
            charColor={rainbowColor}
            createTimeline={({ tl, chars }) => {
              // Elastic entrance with stagger using fromTo
              tl.fromTo(
                chars,
                {
                  scale: 0,
                  opacity: 0,
                  rotationZ: Math.PI / 3,
                  y: -0.5,
                },
                {
                  scale: 1,
                  opacity: 1,
                  rotationZ: 0,
                  y: 0,
                  duration: 1.2,
                  stagger: 0.05,
                  ease: "elastic.out(1, 0.4)",
                },
                0.8, // Start after first text
              );

              return tl;
            }}
          />

          {/* Rich text example - multiple fonts/styles in one text block! */}
          <RichText3DGsap
            segments={[
              { text: "Create ", fontUrl: interFontUrl, color: "#94a3b8" },
              { text: "stunning ", fontUrl: poppinsFontUrl, color: "#60a5fa" },
              { text: "videos", fontUrl: playfairFontUrl, color: "#f472b6" },
            ]}
            position={[0, -1.8, 0]}
            fontSize={0.4}
            createTimeline={({ tl, segments }) => {
              // Animate each segment with different timing and effects
              segments.forEach((seg, i) => {
                // Segment-level entrance
                tl.fromTo(
                  seg.state,
                  { opacity: 0, y: 0.2 },
                  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                  1.5 + i * 0.3, // Stagger segment entrances
                );
                // Character-level wave within each segment
                tl.fromTo(
                  seg.chars,
                  { y: 0.15, opacity: 0, scale: 0.8 },
                  {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.03,
                    ease: "back.out(1.7)",
                  },
                  1.5 + i * 0.3,
                );
              });
              return tl;
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
