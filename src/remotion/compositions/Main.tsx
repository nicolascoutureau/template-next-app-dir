import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import React from "react";
import * as THREE from "three";
import {
  SplitText3DGsap,
  RichText3DGsap,
  ExtrudedText3DGsap,
  // Beautiful shader backgrounds from the library
  ParticleNebula,
  AuroraBackground,
  GradientOrbs,
  StripeGradientMesh,
} from "../../library";
import { getFontUrl } from "../fonts";

// ============================================================================
// FONTS
// ============================================================================

const montserratBold = getFontUrl("Montserrat", 700);
const montserratMedium = getFontUrl("Montserrat", 500);
const interRegular = getFontUrl("Inter", 400);
const interBold = getFontUrl("Inter", 700);
const spaceGrotesk = getFontUrl("Space Grotesk", 700);

// ============================================================================
// COLOR PALETTE
// ============================================================================

const colors = {
  background: "#030014",
  primary: "#a855f7", // Purple
  secondary: "#06b6d4", // Cyan
  accent: "#f472b6", // Pink
  gold: "#fbbf24",
  white: "#ffffff",
  gray: "#94a3b8",
};


// ============================================================================
// FLOATING PARTICLES
// ============================================================================

const FloatingParticles: React.FC<{ count?: number; startDelay?: number }> = ({
  count = 30,
  startDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate particle positions deterministically
  const particles = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 137.5;
      result.push({
        x: Math.sin(seed) * 12,
        y: Math.cos(seed * 0.7) * 6,
        z: Math.sin(seed * 1.3) * 5 - 5,
        size: 0.02 + (i % 5) * 0.01,
        speed: 0.5 + (i % 3) * 0.3,
        phase: (i / count) * Math.PI * 2,
      });
    }
    return result;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => {
        const entrance = spring({
          fps,
          frame,
          config: { damping: 100, stiffness: 100, mass: 1 },
          delay: startDelay + i * 2,
        });

        const floatY = Math.sin((frame / fps) * p.speed + p.phase) * 0.3;
        const floatX = Math.cos((frame / fps) * p.speed * 0.5 + p.phase) * 0.2;

        return (
          <mesh
            key={i}
            position={[p.x + floatX, p.y + floatY, p.z]}
            scale={entrance}
          >
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ============================================================================
// GLOWING ORB
// ============================================================================

const GlowingOrb: React.FC<{
  position: [number, number, number];
  color: string;
  size?: number;
  delay?: number;
  pulseSpeed?: number;
}> = ({ position, color, size = 0.5, delay = 0, pulseSpeed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 50, stiffness: 100, mass: 0.8 },
    delay,
  });

  const pulse = 1 + Math.sin((frame / fps) * Math.PI * pulseSpeed) * 0.15;
  const floatY = Math.sin((frame / fps) * Math.PI * 0.5) * 0.2;

  return (
    <group position={[position[0], position[1] + floatY, position[2]]} scale={entrance}>
      {/* Core */}
      <mesh scale={pulse}>
        <sphereGeometry args={[size * 0.6, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={pulse * 1.2}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Halo ring */}
      <mesh rotation={[Math.PI / 2, 0, (frame / fps) * 0.5]}>
        <torusGeometry args={[size * 1.3, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4 * pulse}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// ANIMATED RING
// ============================================================================

const AnimatedRing: React.FC<{
  delay?: number;
  color?: string;
  size?: number;
}> = ({ delay = 0, color = colors.primary, size = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 100, stiffness: 80, mass: 1.2 },
    delay,
  });

  const rotation = (frame / fps) * 0.3;

  return (
    <group scale={entrance}>
      <mesh rotation={[Math.PI / 6, rotation, 0]} position={[0, 0, -3]}>
        <torusGeometry args={[size, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 8, -rotation * 0.7, Math.PI / 4]} position={[0, 0, -3]}>
        <torusGeometry args={[size * 0.85, 0.01, 16, 100]} />
        <meshBasicMaterial
          color={colors.secondary}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// SCENE 1: OPENING - "THE FUTURE IS HERE"
// ============================================================================

const Scene1Opening: React.FC = () => {
  return (
    <group>
      <SplitText3DGsap
        text="THE FUTURE"
        fontUrl={montserratBold}
        position={[0, 0.8, 0]}
        fontSize={1.1}
        color={colors.white}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, z: -2, rotationX: Math.PI / 3, scale: 0.5 });
          tl.to(chars, {
            opacity: 1,
            z: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.0,
            stagger: 0.04,
            ease: "power4.out",
          }, 0);
          // Subtle float
          tl.to(chars, {
            y: 0.05,
            duration: 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.0);
          return tl;
        }}
      />

      <SplitText3DGsap
        text="IS HERE"
        fontUrl={montserratBold}
        position={[0, -0.5, 0]}
        fontSize={1.1}
        charColor={(_, i, total) => {
          const t = i / total;
          return t < 0.5 ? colors.primary : colors.secondary;
        }}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, y: 1, scale: 0 });
          tl.to(chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.05,
            ease: "elastic.out(1, 0.5)",
          }, 0.6);
          return tl;
        }}
      />

      <AnimatedRing delay={30} />
      <GlowingOrb position={[-5, 2, -2]} color={colors.primary} delay={40} size={0.4} />
      <GlowingOrb position={[5, -1.5, -1]} color={colors.secondary} delay={50} size={0.35} />
    </group>
  );
};

// ============================================================================
// SCENE 2: PRODUCT NAME REVEAL
// ============================================================================

const Scene2ProductReveal: React.FC = () => {
  // Gradient color function for product name
  const gradientColor = (_: string, index: number, total: number): string => {
    const hue = 270 + (index / total) * 60; // Purple to magenta
    return `hsl(${hue}, 85%, 65%)`;
  };

  return (
    <group>
      {/* Pre-text */}
      <SplitText3DGsap
        text="Introducing"
        fontUrl={interRegular}
        position={[0, 2.2, 0]}
        fontSize={0.45}
        color={colors.gray}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, y: 0.3 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.02, ease: "power2.out" },
            0
          );
          return tl;
        }}
      />

      {/* Main Product Name - Extruded 3D */}
      <ExtrudedText3DGsap
        text="AURORA"
        fontUrl={spaceGrotesk}
        position={[0, 0.3, 0]}
        fontSize={1.8}
        depth={0.25}
        bevelEnabled={true}
        bevelThickness={0.04}
        bevelSize={0.03}
        bevelSegments={5}
        metalness={0.7}
        roughness={0.2}
        charColor={gradientColor}
        createTimeline={({ tl, chars }) => {
          // Dramatic entrance
          tl.set(chars, { opacity: 0, z: -5, rotationY: Math.PI, scale: 0 });
          tl.to(chars, {
            opacity: 1,
            z: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          }, 0.3);
          // Gentle breathe
          tl.to(chars, {
            z: 0.1,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.7);
          return tl;
        }}
      />

      {/* Tagline */}
      <RichText3DGsap
        segments={[
          { text: "Where ", fontUrl: interRegular, color: colors.gray },
          { text: "Dreams ", fontUrl: interBold, color: colors.primary },
          { text: "Meet ", fontUrl: interRegular, color: colors.gray },
          { text: "Reality", fontUrl: interBold, color: colors.secondary },
        ]}
        position={[0, -1.5, 0]}
        fontSize={0.5}
        createTimeline={({ tl, segments }) => {
          segments.forEach((seg) => {
            tl.set(seg.state, { opacity: 0, y: 0.3 }, 0);
            tl.set(seg.chars, { opacity: 0, scale: 0.5 }, 0);
          });

          segments.forEach((seg, i) => {
            const startTime = 1.2 + i * 0.25;
            tl.to(seg.state, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, startTime);
            tl.to(seg.chars, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: 0.03,
              ease: "back.out(1.7)",
            }, startTime);
          });
          return tl;
        }}
      />

      {/* Decorative elements */}
      <AnimatedRing delay={20} color={colors.primary} size={4} />
      <GlowingOrb position={[-6, 1, -3]} color={colors.accent} delay={60} size={0.5} pulseSpeed={0.8} />
      <GlowingOrb position={[6, -1, -2]} color={colors.gold} delay={70} size={0.4} pulseSpeed={1.2} />
    </group>
  );
};

// ============================================================================
// SCENE 3: FEATURES
// ============================================================================

const Scene3Features: React.FC = () => {
  return (
    <group>
      {/* Section title */}
      <SplitText3DGsap
        text="EXPERIENCE THE DIFFERENCE"
        fontUrl={montserratMedium}
        position={[0, 2.5, 0]}
        fontSize={0.55}
        color={colors.white}
        createTimeline={({ tl, words }) => {
          words.forEach((word, i) => {
            tl.fromTo(
              word.state,
              { opacity: 0, x: -1 },
              { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
              i * 0.15
            );
            tl.fromTo(
              word.chars,
              { opacity: 0, y: 0.2 },
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: "power2.out" },
              i * 0.15
            );
          });
          return tl;
        }}
      />

      {/* Feature 1 */}
      <SplitText3DGsap
        text="Intelligent Design"
        fontUrl={interBold}
        position={[-4, 0.5, 0]}
        fontSize={0.6}
        color={colors.primary}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, rotationY: Math.PI / 2, x: -0.5 },
            { opacity: 1, rotationY: 0, x: 0, duration: 0.8, stagger: 0.03, ease: "power3.out" },
            0.5
          );
          return tl;
        }}
      />

      {/* Feature 2 */}
      <SplitText3DGsap
        text="Blazing Performance"
        fontUrl={interBold}
        position={[0, -0.3, 0]}
        fontSize={0.6}
        color={colors.secondary}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, scale: 0, rotationZ: Math.PI / 4 },
            { opacity: 1, scale: 1, rotationZ: 0, duration: 0.9, stagger: 0.025, ease: "elastic.out(1, 0.6)" },
            0.9
          );
          return tl;
        }}
      />

      {/* Feature 3 */}
      <SplitText3DGsap
        text="Unmatched Security"
        fontUrl={interBold}
        position={[4, -1.1, 0]}
        fontSize={0.6}
        color={colors.accent}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, y: 1, z: -1 },
            { opacity: 1, y: 0, z: 0, duration: 0.7, stagger: 0.03, ease: "power4.out" },
            1.3
          );
          return tl;
        }}
      />

      {/* Decorative orbs */}
      <GlowingOrb position={[-4, 1.2, -1]} color={colors.primary} delay={20} size={0.3} />
      <GlowingOrb position={[0, 0.4, -1]} color={colors.secondary} delay={35} size={0.3} />
      <GlowingOrb position={[4, -0.4, -1]} color={colors.accent} delay={50} size={0.3} />
    </group>
  );
};

// ============================================================================
// SCENE 4: CALL TO ACTION
// ============================================================================

const Scene4CTA: React.FC = () => {
  return (
    <group>
      {/* Main CTA */}
      <ExtrudedText3DGsap
        text="GET STARTED"
        fontUrl={montserratBold}
        position={[0, 0.5, 0]}
        fontSize={1.2}
        depth={0.2}
        bevelEnabled={true}
        bevelThickness={0.03}
        bevelSize={0.02}
        metalness={0.5}
        roughness={0.3}
        charColor={(_, i, total) => {
          const t = i / total;
          // Cyan to purple gradient
          const hue = 180 + t * 90;
          return `hsl(${hue}, 80%, 60%)`;
        }}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, scale: 0, y: 2, rotationX: Math.PI / 2 });
          tl.to(chars, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.06,
            ease: "elastic.out(1, 0.4)",
          }, 0);
          // Pulse effect
          tl.to(chars, {
            scale: 1.05,
            duration: 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.5);
          return tl;
        }}
      />

      {/* Subtext */}
      <SplitText3DGsap
        text="Available Now"
        fontUrl={interRegular}
        position={[0, -1.2, 0]}
        fontSize={0.5}
        color={colors.gray}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, y: -0.5 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power2.out" },
            0.8
          );
          return tl;
        }}
      />

      {/* Website */}
      <SplitText3DGsap
        text="aurora.io"
        fontUrl={spaceGrotesk}
        position={[0, -2.2, 0]}
        fontSize={0.7}
        charColor={(_, i, total) => {
          const t = i / total;
          return t < 0.5 ? colors.secondary : colors.primary;
        }}
        createTimeline={({ tl, chars }) => {
          tl.fromTo(
            chars,
            { opacity: 0, scale: 1.5, rotationY: -Math.PI / 4 },
            { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, stagger: 0.05, ease: "back.out(1.7)" },
            1.2
          );
          return tl;
        }}
      />

      {/* Multiple decorative rings */}
      <AnimatedRing delay={10} color={colors.secondary} size={3.5} />
      <AnimatedRing delay={25} color={colors.primary} size={4.5} />

      {/* Celebration orbs */}
      <GlowingOrb position={[-5, 2.5, -2]} color={colors.primary} delay={30} size={0.4} />
      <GlowingOrb position={[5, 2, -2]} color={colors.secondary} delay={40} size={0.45} />
      <GlowingOrb position={[-4, -2, -1]} color={colors.accent} delay={50} size={0.35} />
      <GlowingOrb position={[4, -2.5, -1.5]} color={colors.gold} delay={60} size={0.4} />
    </group>
  );
};

// ============================================================================
// LIGHTS SETUP
// ============================================================================

const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, -5, 3]} intensity={0.3} color="#a855f7" />
      <pointLight position={[0, 5, 8]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[-8, 0, 5]} intensity={0.4} color="#a855f7" />
      <pointLight position={[8, 0, 5]} intensity={0.4} color="#f472b6" />
    </>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

// ============================================================================
// BACKGROUND WRAPPER - Scales shader backgrounds to fill the view
// ============================================================================

const BackgroundLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The shader backgrounds use a 2x2 plane and expect camera at z=1 with FOV 90
  // Our main camera is at z=12 with FOV 50
  // To fill the view, we position the background at z=-5 and scale appropriately
  // At distance 17 (12 - (-5)), with FOV 50: visible height = 2 * 17 * tan(25°) ≈ 15.8
  // Scale factor: 15.8 / 2 ≈ 8
  return (
    <group position={[0, 0, -5]} scale={[14, 8, 1]}>
      {children}
    </group>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Scene timing (in frames)
  const scene1Start = 0;
  const scene1Duration = 120; // 4 seconds

  const scene2Start = scene1Duration;
  const scene2Duration = 150; // 5 seconds

  const scene3Start = scene2Start + scene2Duration;
  const scene3Duration = 120; // 4 seconds

  const scene4Start = scene3Start + scene3Duration;
  const scene4Duration = durationInFrames - scene4Start;

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      <AbsoluteFill style={{ backgroundColor: colors.background }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{
            fov: 50,
            position: [0, 0, 12],
          }}
        >
          {/* ============================================================== */}
          {/* SHADER BACKGROUNDS - Positioned behind 3D content              */}
          {/* ============================================================== */}

          {/* Scene 1: Particle Nebula - Cosmic, dramatic opening */}
          <Sequence from={scene1Start} durationInFrames={scene1Duration} layout="none">
            <BackgroundLayer>
              <ParticleNebula
                colors={["#7c3aed", "#a855f7", "#06b6d4"]}
                backgroundColor="#030014"
                brightness={0.8}
                density={3}
                speed={0.8}
                stars={true}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 2: Aurora Background - Ethereal product reveal */}
          <Sequence from={scene2Start} durationInFrames={scene2Duration} layout="none">
            <BackgroundLayer>
              <AuroraBackground
                colors={["#8b5cf6", "#ec4899", "#06b6d4"]}
                backgroundColor="#050510"
                intensity={0.85}
                speed={0.6}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 3: Gradient Orbs - Modern, dynamic features */}
          <Sequence from={scene3Start} durationInFrames={scene3Duration} layout="none">
            <BackgroundLayer>
              <GradientOrbs
                colors={["#a855f7", "#06b6d4", "#f472b6", "#10b981", "#fbbf24"]}
                backgroundColor="#0a0a1a"
                blur={0.7}
                orbSize={0.35}
                speed={0.8}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 4: Stripe Gradient Mesh - Clean, professional CTA */}
          <Sequence from={scene4Start} durationInFrames={scene4Duration} layout="none">
            <BackgroundLayer>
              <StripeGradientMesh
                colors={["#7c3aed", "#06b6d4", "#ec4899", "#8b5cf6", "#030014"]}
                speed={0.5}
                amplitude={0.4}
                blendFactor={0.6}
              />
            </BackgroundLayer>
          </Sequence>

          {/* ============================================================== */}
          {/* LIGHTING                                                       */}
          {/* ============================================================== */}
          <Lights />

          {/* ============================================================== */}
          {/* FLOATING PARTICLES                                             */}
          {/* ============================================================== */}
          <FloatingParticles count={40} startDelay={0} />

          {/* ============================================================== */}
          {/* SCENE CONTENT                                                  */}
          {/* ============================================================== */}

          {/* Scene 1: Opening */}
          <Sequence from={scene1Start} durationInFrames={scene1Duration} layout="none">
            <Scene1Opening />
          </Sequence>

          {/* Scene 2: Product Reveal */}
          <Sequence from={scene2Start} durationInFrames={scene2Duration} layout="none">
            <Scene2ProductReveal />
          </Sequence>

          {/* Scene 3: Features */}
          <Sequence from={scene3Start} durationInFrames={scene3Duration} layout="none">
            <Scene3Features />
          </Sequence>

          {/* Scene 4: CTA */}
          <Sequence from={scene4Start} durationInFrames={scene4Duration} layout="none">
            <Scene4CTA />
          </Sequence>
        </ThreeCanvas>
      </AbsoluteFill>
    </>
  );
};
