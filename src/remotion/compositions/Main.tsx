import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  interpolate,
  random,
} from "remotion";
import React from "react";
import * as THREE from "three";
import {
  SplitText3DGsap,
  RichText3DGsap,
  ExtrudedText3DGsap,
  GradientOrbs,
  MetaballsBackground,
  WaveGridBackground,
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
// COLOR PALETTE - Refined for cinematic look
// ============================================================================

const colors = {
  background: "#030014",
  primary: "#a855f7",
  secondary: "#06b6d4",
  accent: "#f472b6",
  gold: "#fbbf24",
  white: "#ffffff",
  offWhite: "#f0f0f5",
  gray: "#94a3b8",
  darkGray: "#475569",
};

// ============================================================================
// PROFESSIONAL EASING FUNCTIONS
// ============================================================================

// Custom bezier curves for refined motion
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// ============================================================================
// SCENE TRANSITION OVERLAY - Crossfade between scenes
// ============================================================================


// ============================================================================
// CINEMATIC VIGNETTE - Subtle edge darkening
// ============================================================================

const CinematicVignette: React.FC<{ intensity?: number }> = ({
  intensity = 0.4,
}) => {
  const vignetteTexture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 362);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0)");
    gradient.addColorStop(0.8, `rgba(0,0,0,${intensity * 0.5})`);
    gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [intensity]);

  return (
    <mesh position={[0, 0, 9]}>
      <planeGeometry args={[25, 15]} />
      <meshBasicMaterial map={vignetteTexture} transparent blending={THREE.MultiplyBlending} premultipliedAlpha />
    </mesh>
  );
};

// ============================================================================
// LIGHT STREAK - Cinematic anamorphic flare effect
// ============================================================================

const LightStreak: React.FC<{
  position: [number, number, number];
  color: string;
  delay?: number;
  duration?: number;
}> = ({ position, color, delay = 0, duration = 60 }) => {
  const frame = useCurrentFrame();

  const localFrame = frame - delay;
  if (localFrame < 0 || localFrame > duration) return null;

  const progress = localFrame / duration;
  const opacity = Math.sin(progress * Math.PI) * 0.25;
  const scaleX = 4 + easeOutExpo(progress) * 10;

  return (
    <mesh position={position} scale={[scaleX, 0.02, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ============================================================================
// FLOATING PARTICLES - Refined with depth layers
// ============================================================================

const FloatingParticles: React.FC<{
  count?: number;
  startDelay?: number;
  layer?: "front" | "mid" | "back";
}> = ({ count = 20, startDelay = 0, layer = "mid" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layerConfig = {
    front: { zRange: [-1, 2], sizeMultiplier: 0.8, opacity: 0.4 },
    mid: { zRange: [-4, -1], sizeMultiplier: 0.7, opacity: 0.25 },
    back: { zRange: [-8, -4], sizeMultiplier: 0.5, opacity: 0.12 },
  };

  const config = layerConfig[layer];

  const particles = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 137.5 + (layer === "front" ? 100 : layer === "back" ? 200 : 0);
      const zSeed = `particle-z-${layer}-${i}`;
      result.push({
        x: (Math.sin(seed) * 0.5 + 0.5) * 20 - 10,
        y: (Math.cos(seed * 0.7) * 0.5 + 0.5) * 10 - 5,
        z: config.zRange[0] + random(zSeed) * (config.zRange[1] - config.zRange[0]),
        size: (0.015 + (i % 5) * 0.008) * config.sizeMultiplier,
        speed: 0.3 + (i % 4) * 0.15,
        phase: (i / count) * Math.PI * 2,
        color: i % 4 === 0 ? colors.primary : i % 4 === 1 ? colors.secondary : i % 4 === 2 ? colors.accent : colors.white,
      });
    }
    return result;
  }, [count, layer, config]);

  return (
    <group>
      {particles.map((p, i) => {
        const entrance = spring({
          fps,
          frame,
          config: { damping: 200, stiffness: 50, mass: 1.5 },
          delay: startDelay + i * 3,
        });

        const time = frame / fps;
        const floatY = Math.sin(time * p.speed + p.phase) * 0.15;
        const floatX = Math.cos(time * p.speed * 0.7 + p.phase) * 0.1;
        const drift = time * 0.05;

        return (
          <mesh
            key={i}
            position={[p.x + floatX, p.y + floatY + drift, p.z]}
            scale={entrance}
          >
            <sphereGeometry args={[p.size, 6, 6]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={config.opacity * entrance}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ============================================================================
// GLOWING ORB - Refined with subtle motion
// ============================================================================

const GlowingOrb: React.FC<{
  position: [number, number, number];
  color: string;
  size?: number;
  delay?: number;
  exitDelay?: number;
}> = ({ position, color, size = 0.5, delay = 0, exitDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const entrance = spring({
    fps,
    frame,
    config: { damping: 80, stiffness: 60, mass: 1 },
    delay,
  });

  // Exit (if specified)
  let exit = 1;
  if (exitDelay !== undefined) {
    exit = interpolate(
      frame,
      [exitDelay, exitDelay + 20],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  const scale = entrance * exit;
  if (scale < 0.01) return null;

  const time = frame / fps;
  const pulse = 1 + Math.sin(time * Math.PI * 0.8) * 0.08;
  const floatY = Math.sin(time * Math.PI * 0.4) * 0.12;
  const floatX = Math.cos(time * Math.PI * 0.3) * 0.08;

  return (
    <group
      position={[position[0] + floatX, position[1] + floatY, position[2]]}
      scale={scale}
    >
      <mesh scale={pulse}>
        <sphereGeometry args={[size * 0.5, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={pulse * 1.3}>
        <sphereGeometry args={[size * 0.8, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// ANIMATED RING - More refined motion
// ============================================================================

const AnimatedRing: React.FC<{
  delay?: number;
  exitDelay?: number;
  color?: string;
  size?: number;
}> = ({ delay = 0, exitDelay, color = colors.primary, size = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 120, stiffness: 40, mass: 1.5 },
    delay,
  });

  let exit = 1;
  if (exitDelay !== undefined) {
    exit = interpolate(
      frame,
      [exitDelay, exitDelay + 25],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  const scale = entrance * exit;
  if (scale < 0.01) return null;

  const time = frame / fps;
  const rotation = time * 0.15;

  return (
    <group scale={scale}>
      <mesh rotation={[Math.PI / 8, rotation, 0]} position={[0, 0, -3]}>
        <torusGeometry args={[size, 0.008, 16, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 10, -rotation * 0.6, Math.PI / 6]}
        position={[0, 0, -3]}
      >
        <torusGeometry args={[size * 0.88, 0.006, 16, 128]} />
        <meshBasicMaterial
          color={colors.secondary}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// SCENE 1: OPENING - Refined professional animation
// ============================================================================

const Scene1Opening: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  return (
    <group>
      <SplitText3DGsap
        text="THE FUTURE"
        fontUrl={montserratBold}
        position={[0, 1, 0]}
        fontSize={1.0}
        color={colors.offWhite}
        createTimeline={({ tl, chars }) => {
          // Professional reveal: staggered fade with subtle position offset
          tl.set(chars, {
            opacity: 0,
            y: 0.3,
            rotationX: Math.PI / 8,
          });

          // Main entrance with refined easing
          tl.to(chars, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.035,
            ease: "power3.out",
          }, 0.2);

          // Subtle breathing - very gentle
          tl.to(chars, {
            y: 0.02,
            duration: 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.2);

          // Exit animation
          tl.to(chars, {
            opacity: 0,
            y: -0.2,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.in",
          }, 3.5);

          return tl;
        }}
      />

      <SplitText3DGsap
        text="IS HERE"
        fontUrl={montserratBold}
        position={[0, -0.4, 0]}
        fontSize={1.0}
        charColor={(_, i, total) => {
          const t = i / (total - 1);
          // Smooth gradient from primary to secondary
          const h1 = 270, h2 = 185;
          const hue = h1 + (h2 - h1) * t;
          return `hsl(${hue}, 75%, 65%)`;
        }}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, scale: 0.8, y: 0.4 });

          // Elegant scale-up entrance
          tl.to(chars, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.04,
            ease: "power2.out",
          }, 0.6);

          // Exit
          tl.to(chars, {
            opacity: 0,
            scale: 0.9,
            y: -0.15,
            duration: 0.4,
            stagger: 0.015,
            ease: "power2.in",
          }, 3.5);

          return tl;
        }}
      />

      {/* Decorative elements with exit animations */}
      <AnimatedRing delay={25} exitDelay={exitFrame - 30} />
      <GlowingOrb
        position={[-5, 2, -2]}
        color={colors.primary}
        delay={35}
        exitDelay={exitFrame - 25}
        size={0.35}
      />
      <GlowingOrb
        position={[5, -1.5, -1.5]}
        color={colors.secondary}
        delay={45}
        exitDelay={exitFrame - 20}
        size={0.3}
      />

      {/* Light streak for dramatic effect */}
      <LightStreak position={[0, 0.3, 1]} color={colors.primary} delay={15} duration={40} />
    </group>
  );
};

// ============================================================================
// SCENE 2: PRODUCT NAME REVEAL - Cinematic reveal
// ============================================================================

const Scene2ProductReveal: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const gradientColor = (_: string, index: number, total: number): string => {
    const t = index / (total - 1);
    const hue = 275 + t * 50;
    return `hsl(${hue}, 80%, 62%)`;
  };

  return (
    <group>
      {/* Pre-text with subtle tracking animation */}
      <SplitText3DGsap
        text="Introducing"
        fontUrl={interRegular}
        position={[0, 2.3, 0]}
        fontSize={0.4}
        color={colors.gray}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, x: -0.1 });

          tl.to(chars, {
            opacity: 0.8,
            x: 0,
            duration: 0.5,
            stagger: 0.015,
            ease: "power2.out",
          }, 0);

          // Exit
          tl.to(chars, {
            opacity: 0,
            y: -0.1,
            duration: 0.3,
            ease: "power2.in",
          }, 4.5);

          return tl;
        }}
      />

      {/* Main Product Name - Dramatic 3D reveal */}
      <ExtrudedText3DGsap
        text="AURORA"
        fontUrl={spaceGrotesk}
        position={[0, 0.4, 0]}
        fontSize={1.7}
        depth={0.22}
        bevelEnabled={true}
        bevelThickness={0.035}
        bevelSize={0.025}
        bevelSegments={4}
        metalness={0.6}
        roughness={0.25}
        charColor={gradientColor}
        createTimeline={({ tl, chars }) => {
          // Start hidden and far
          tl.set(chars, { opacity: 0, z: -3, rotationY: Math.PI * 0.6, scale: 0.3 });

          // Cinematic reveal - each letter emerges
          tl.to(chars, {
            opacity: 1,
            z: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: "expo.out",
          }, 0.4);

          // Very subtle depth breathing
          tl.to(chars, {
            z: 0.05,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.8);

          // Exit with elegance
          tl.to(chars, {
            opacity: 0,
            z: 0.5,
            rotationY: -Math.PI * 0.1,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.in",
          }, 4.5);

          return tl;
        }}
      />

      {/* Tagline with word-by-word reveal */}
      <RichText3DGsap
        segments={[
          { text: "Where ", fontUrl: interRegular, color: colors.darkGray },
          { text: "Dreams ", fontUrl: interBold, color: colors.primary },
          { text: "Meet ", fontUrl: interRegular, color: colors.darkGray },
          { text: "Reality", fontUrl: interBold, color: colors.secondary },
        ]}
        position={[0, -1.4, 0]}
        fontSize={0.45}
        createTimeline={({ tl, segments }) => {
          // Initialize all segments hidden
          segments.forEach((seg) => {
            tl.set(seg.state, { opacity: 0, y: 0.15 }, 0);
            tl.set(seg.chars, { opacity: 0 }, 0);
          });

          // Reveal each word with timing
          segments.forEach((seg, i) => {
            const startTime = 1.4 + i * 0.2;
            tl.to(seg.state, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            }, startTime);
            tl.to(seg.chars, {
              opacity: 1,
              duration: 0.3,
              stagger: 0.02,
              ease: "power2.out",
            }, startTime);
          });

          // Exit all segments
          segments.forEach((seg, i) => {
            tl.to(seg.state, {
              opacity: 0,
              y: -0.1,
              duration: 0.3,
              ease: "power2.in"
            }, 4.5 + i * 0.05);
          });

          return tl;
        }}
      />

      {/* Decorative elements */}
      <AnimatedRing delay={15} exitDelay={exitFrame - 35} color={colors.primary} size={3.8} />
      <GlowingOrb
        position={[-6, 1.5, -2.5]}
        color={colors.accent}
        delay={50}
        exitDelay={exitFrame - 25}
        size={0.45}
      />
      <GlowingOrb
        position={[6, -0.5, -2]}
        color={colors.gold}
        delay={60}
        exitDelay={exitFrame - 20}
        size={0.35}
      />

      {/* Light effects for product name emphasis */}
      <LightStreak position={[0, 0.4, 2]} color={colors.secondary} delay={30} duration={50} />
    </group>
  );
};

// ============================================================================
// SCENE 3: FEATURES - Clean, professional layout
// ============================================================================

const Scene3Features: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  return (
    <group>
      {/* Section title - clean fade in */}
      <SplitText3DGsap
        text="EXPERIENCE THE DIFFERENCE"
        fontUrl={montserratMedium}
        position={[0, 2.8, 0]}
        fontSize={0.48}
        color={colors.offWhite}
        createTimeline={({ tl, words }) => {
          words.forEach((word) => {
            tl.set(word.state, { opacity: 0, y: 0.2 }, 0);
            tl.set(word.chars, { opacity: 0 }, 0);
          });

          words.forEach((word, i) => {
            const startTime = i * 0.12;
            tl.to(word.state, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            }, startTime);
            tl.to(word.chars, {
              opacity: 1,
              duration: 0.25,
              stagger: 0.015,
              ease: "power2.out",
            }, startTime);
          });

          // Exit
          words.forEach((word, i) => {
            tl.to(word.state, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.in"
            }, 3.5 + i * 0.03);
          });

          return tl;
        }}
      />

      {/* Feature 1 - Left aligned */}
      <SplitText3DGsap
        text="Intelligent Design"
        fontUrl={interBold}
        position={[-3.5, 0.8, 0]}
        fontSize={0.55}
        color={colors.primary}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, x: -0.3 });

          tl.to(chars, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: "power3.out",
          }, 0.4);

          tl.to(chars, {
            opacity: 0,
            x: 0.1,
            duration: 0.3,
            stagger: 0.01,
            ease: "power2.in",
          }, 3.5);

          return tl;
        }}
      />

      {/* Feature 2 - Center */}
      <SplitText3DGsap
        text="Blazing Performance"
        fontUrl={interBold}
        position={[0, -0.1, 0]}
        fontSize={0.55}
        color={colors.secondary}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, scale: 0.9, y: 0.15 });

          tl.to(chars, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.out",
          }, 0.8);

          tl.to(chars, {
            opacity: 0,
            y: -0.1,
            duration: 0.3,
            stagger: 0.01,
            ease: "power2.in",
          }, 3.6);

          return tl;
        }}
      />

      {/* Feature 3 - Right aligned */}
      <SplitText3DGsap
        text="Unmatched Security"
        fontUrl={interBold}
        position={[3.5, -1, 0]}
        fontSize={0.55}
        color={colors.accent}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, x: 0.3 });

          tl.to(chars, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: "power3.out",
          }, 1.2);

          tl.to(chars, {
            opacity: 0,
            x: -0.1,
            duration: 0.3,
            stagger: 0.01,
            ease: "power2.in",
          }, 3.7);

          return tl;
        }}
      />

      {/* Accent orbs for each feature */}
      <GlowingOrb
        position={[-5.5, 0.8, -1]}
        color={colors.primary}
        delay={15}
        exitDelay={exitFrame - 30}
        size={0.25}
      />
      <GlowingOrb
        position={[-2, -0.1, -1]}
        color={colors.secondary}
        delay={30}
        exitDelay={exitFrame - 25}
        size={0.25}
      />
      <GlowingOrb
        position={[5.5, -1, -1]}
        color={colors.accent}
        delay={45}
        exitDelay={exitFrame - 20}
        size={0.25}
      />
    </group>
  );
};

// ============================================================================
// SCENE 4: CALL TO ACTION - Impactful finale
// ============================================================================

const Scene4CTA: React.FC = () => {
  return (
    <group>
      {/* Main CTA - Bold statement */}
      <ExtrudedText3DGsap
        text="GET STARTED"
        fontUrl={montserratBold}
        position={[0, 0.6, 0]}
        fontSize={1.1}
        depth={0.18}
        bevelEnabled={true}
        bevelThickness={0.025}
        bevelSize={0.018}
        metalness={0.55}
        roughness={0.3}
        charColor={(_, i, total) => {
          const t = i / (total - 1);
          const hue = 190 + t * 80;
          return `hsl(${hue}, 75%, 58%)`;
        }}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, y: 1, scale: 0.5, rotationX: Math.PI / 4 });

          // Powerful entrance
          tl.to(chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.0,
            stagger: 0.05,
            ease: "power3.out",
          }, 0);

          // Subtle scale pulse - very refined
          tl.to(chars, {
            scale: 1.02,
            duration: 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }, 1.2);

          return tl;
        }}
      />

      {/* Availability text */}
      <SplitText3DGsap
        text="Available Now"
        fontUrl={interRegular}
        position={[0, -1, 0]}
        fontSize={0.45}
        color={colors.gray}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, y: -0.2 });

          tl.to(chars, {
            opacity: 0.85,
            y: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "power2.out",
          }, 0.7);

          return tl;
        }}
      />

      {/* Website URL - Brand emphasis */}
      <SplitText3DGsap
        text="aurora.io"
        fontUrl={spaceGrotesk}
        position={[0, -2, 0]}
        fontSize={0.65}
        charColor={(_, i, total) => {
          const t = i / (total - 1);
          return t < 0.5 ? colors.secondary : colors.primary;
        }}
        createTimeline={({ tl, chars }) => {
          tl.set(chars, { opacity: 0, scale: 1.2 });

          tl.to(chars, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.out",
          }, 1.0);

          return tl;
        }}
      />

      {/* Decorative rings - layered */}
      <AnimatedRing delay={8} color={colors.secondary} size={3.2} />
      <AnimatedRing delay={20} color={colors.primary} size={4.2} />

      {/* Celebration orbs */}
      <GlowingOrb position={[-5.5, 2.5, -2]} color={colors.primary} delay={25} size={0.38} />
      <GlowingOrb position={[5.5, 2, -2]} color={colors.secondary} delay={35} size={0.42} />
      <GlowingOrb position={[-4.5, -2.2, -1.5]} color={colors.accent} delay={45} size={0.32} />
      <GlowingOrb position={[4.5, -2.5, -1.5]} color={colors.gold} delay={55} size={0.36} />

      {/* Final light effects */}
      <LightStreak position={[0, 0.6, 1.5]} color={colors.primary} delay={10} duration={45} />
      <LightStreak position={[0, -2, 1]} color={colors.secondary} delay={65} duration={35} />
    </group>
  );
};

// ============================================================================
// REFINED LIGHTING SETUP
// ============================================================================

const Lights: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Subtle light intensity variation for organic feel
  const breathe = 1 + Math.sin(time * 0.5) * 0.05;

  return (
    <>
      <ambientLight intensity={0.35 * breathe} />
      <directionalLight
        position={[10, 10, 8]}
        intensity={0.9 * breathe}
        color="#ffffff"
      />
      <directionalLight
        position={[-8, -5, 5]}
        intensity={0.25}
        color={colors.primary}
      />
      <pointLight position={[0, 6, 10]} intensity={0.5 * breathe} color={colors.secondary} />
      <pointLight position={[-10, 0, 6]} intensity={0.3} color={colors.primary} />
      <pointLight position={[10, 0, 6]} intensity={0.3} color={colors.accent} />
    </>
  );
};

// ============================================================================
// BACKGROUND WRAPPER
// ============================================================================

const BackgroundLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const aspect = width / height;
  const frustumHeight = 12;
  const frustumWidth = frustumHeight * aspect;
  return (
    <group position={[0, 0, -5]} scale={[frustumWidth / 2, frustumHeight / 2, 1]}>
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

  // Scene timing with proper transition overlap
  const transitionDuration = 20; // frames for crossfade

  const scene1Start = 0;
  const scene1Duration = 120;
  const scene1Exit = scene1Start + scene1Duration - transitionDuration;

  const scene2Start = scene1Duration - transitionDuration;
  const scene2Duration = 150;
  const scene2Exit = scene2Start + scene2Duration - transitionDuration;

  const scene3Start = scene2Start + scene2Duration - transitionDuration;
  const scene3Duration = 120;
  const scene3Exit = scene3Start + scene3Duration - transitionDuration;

  const scene4Start = scene3Start + scene3Duration - transitionDuration;
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
          orthographic
          camera={{
            position: [0, 0, 12],
            left: -6 * (width / height),
            right: 6 * (width / height),
            top: 6,
            bottom: -6,
            near: 0.1,
            far: 1000,
          }}
        >
          {/* ============================================================== */}
          {/* SHADER BACKGROUNDS                                             */}
          {/* ============================================================== */}

          {/* Scene 1: Subtle gradient orbs - dark and slow */}
          <Sequence from={scene1Start} durationInFrames={scene1Duration} layout="none">
            <BackgroundLayer>
              <GradientOrbs
                colors={["#2d1b4e", "#1a3a4a", "#1e1e2e"]}
                backgroundColor="#030014"
                blur={0.85}
                orbSize={0.5}
                speed={0.15}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 2: Very subtle wave grid */}
          <Sequence from={scene2Start} durationInFrames={scene2Duration} layout="none">
            <BackgroundLayer>
              <WaveGridBackground
                lineColor="#3b2d5a"
                glowColor="#1a4a5a"
                backgroundColor="#030014"
                speed={0.15}
                gridDensity={12}
                amplitude={0.06}
                perspective={0.25}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 3: Soft gradient orbs */}
          <Sequence from={scene3Start} durationInFrames={scene3Duration} layout="none">
            <BackgroundLayer>
              <GradientOrbs
                colors={["#2a1f4a", "#1a3545", "#251a3a"]}
                backgroundColor="#050510"
                blur={0.9}
                orbSize={0.45}
                speed={0.12}
              />
            </BackgroundLayer>
          </Sequence>

          {/* Scene 4: Subtle metaballs */}
          <Sequence from={scene4Start} durationInFrames={scene4Duration} layout="none">
            <BackgroundLayer>
              <MetaballsBackground
                primaryColor="#2d1b4e"
                secondaryColor="#1a3a4a"
                backgroundColor="#030014"
                speed={0.2}
                sharpness={0.25}
                glow={false}
              />
            </BackgroundLayer>
          </Sequence>

          {/* ============================================================== */}
          {/* SCENE TRANSITIONS - Smooth crossfades                          */}
          {/* ============================================================== */}


          {/* ============================================================== */}
          {/* LIGHTING                                                       */}
          {/* ============================================================== */}

          {/* ============================================================== */}
          {/* MULTI-LAYER PARTICLES - Subtle accents                         */}
          {/* ============================================================== */}
          <FloatingParticles count={8} startDelay={0} layer="back" />
          <FloatingParticles count={10} startDelay={15} layer="mid" />
          <FloatingParticles count={6} startDelay={30} layer="front" />

          {/* ============================================================== */}
          {/* CINEMATIC VIGNETTE                                             */}
          {/* ============================================================== */}
          <CinematicVignette intensity={0.25} />

          {/* ============================================================== */}
          {/* SCENE CONTENT                                                  */}
          {/* ============================================================== */}

          <Sequence from={scene1Start} durationInFrames={scene1Duration} layout="none">
            <Scene1Opening exitFrame={scene1Exit} />
          </Sequence>

          <Sequence from={scene2Start} durationInFrames={scene2Duration} layout="none">
            <Scene2ProductReveal exitFrame={scene2Exit} />
          </Sequence>

          <Sequence from={scene3Start} durationInFrames={scene3Duration} layout="none">
            <Scene3Features exitFrame={scene3Exit} />
          </Sequence>

          <Sequence from={scene4Start} durationInFrames={scene4Duration} layout="none">
            <Scene4CTA />
          </Sequence>
        </ThreeCanvas>
      </AbsoluteFill>
    </>
  );
};
