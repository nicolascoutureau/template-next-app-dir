import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";

/**
 * Particle shape types.
 */
export type ParticleShape = "circle" | "square" | "star" | "glow" | "spark" | "dot";

/**
 * Motion pattern for particles.
 */
export type ParticleMotion =
  | "float" // Gentle floating with organic drift
  | "rise" // Float upward like bubbles
  | "fall" // Fall downward like snow/rain
  | "explode" // Burst outward from center
  | "implode" // Pull inward to center
  | "orbit" // Circular motion around center
  | "swirl" // Spiral motion
  | "flow" // Horizontal flow with waves
  | "sparkle" // Stationary with random twinkle
  | "confetti"; // Falling with rotation

/**
 * Emission area type.
 */
export type EmissionArea = "full" | "center" | "edges" | "bottom" | "top" | "point";

/**
 * Individual particle data (auto-generated).
 */
export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: ParticleShape;
  speed: number;
  phase: number;
  rotation: number;
  opacity: number;
};

/**
 * Props for the `Particles` component.
 */
export type ParticlesProps = {
  /** Number of particles. Defaults to 50. */
  count?: number;
  /** Particle shapes to use. Defaults to ["circle"]. */
  shapes?: ParticleShape[];
  /** Colors for particles. Defaults to white. */
  colors?: string[];
  /** Size range [min, max] in pixels. Defaults to [2, 8]. */
  sizeRange?: [number, number];
  /** Motion pattern. Defaults to "float". */
  motion?: ParticleMotion;
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number;
  /** Emission area. Defaults to "full". */
  emissionArea?: EmissionArea;
  /** Width in pixels. Defaults to 1920. */
  width?: number;
  /** Height in pixels. Defaults to 1080. */
  height?: number;
  /** Opacity range [min, max]. Defaults to [0.3, 1]. */
  opacityRange?: [number, number];
  /** Blur amount for glow effect. Defaults to 0. */
  blur?: number;
  /** Whether particles should wrap around edges. Defaults to true. */
  wrap?: boolean;
  /** Seed for deterministic generation. */
  seed?: number;
  /** Center X for radial motions (0-1). Defaults to 0.5. */
  centerX?: number;
  /** Center Y for radial motions (0-1). Defaults to 0.5. */
  centerY?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Seeded random number generator for deterministic particles.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generates smooth noise for organic motion.
 */
function noise(x: number, seed: number): number {
  const floorX = Math.floor(x);
  const t = x - floorX;
  const smoothT = t * t * (3 - 2 * t);

  const random1 = seededRandom(floorX + seed);
  const random2 = seededRandom(floorX + 1 + seed);

  return random1() * (1 - smoothT) + random2() * smoothT;
}

/**
 * Generates initial particle position based on emission area.
 */
function getInitialPosition(
  emission: EmissionArea,
  width: number,
  height: number,
  random: () => number,
  centerX: number,
  centerY: number
): { x: number; y: number } {
  switch (emission) {
    case "center":
      return {
        x: width * centerX + (random() - 0.5) * width * 0.3,
        y: height * centerY + (random() - 0.5) * height * 0.3,
      };
    case "edges": {
      const side = Math.floor(random() * 4);
      switch (side) {
        case 0:
          return { x: random() * width, y: 0 };
        case 1:
          return { x: width, y: random() * height };
        case 2:
          return { x: random() * width, y: height };
        default:
          return { x: 0, y: random() * height };
      }
    }
    case "bottom":
      return { x: random() * width, y: height + random() * 50 };
    case "top":
      return { x: random() * width, y: -random() * 50 };
    case "point":
      return { x: width * centerX, y: height * centerY };
    case "full":
    default:
      return { x: random() * width, y: random() * height };
  }
}

/**
 * Calculates particle position based on motion type.
 */
function calculateMotion(
  particle: Particle,
  motion: ParticleMotion,
  time: number,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  wrap: boolean
): { x: number; y: number; rotation: number; opacity: number; scale: number } {
  const { x: baseX, y: baseY, speed, phase, id } = particle;
  let x = baseX;
  let y = baseY;
  let rotation = particle.rotation;
  let opacity = particle.opacity;
  let scale = 1;

  const t = time * speed;
  const seed = id * 1000;

  switch (motion) {
    case "float": {
      const driftX = (noise(t * 0.3 + phase, seed) - 0.5) * 100;
      const driftY = (noise(t * 0.25 + phase + 100, seed) - 0.5) * 80;
      x = baseX + driftX;
      y = baseY + driftY - t * 20;
      opacity = particle.opacity * (0.7 + noise(t * 0.5, seed + 200) * 0.3);
      break;
    }

    case "rise": {
      const riseSpeed = t * 60;
      const wobble = Math.sin(t * 2 + phase * Math.PI * 2) * 30;
      x = baseX + wobble;
      y = baseY - riseSpeed;
      scale = 0.8 + Math.sin(t * 3 + phase * 10) * 0.2;
      break;
    }

    case "fall": {
      const fallSpeed = t * 50;
      const drift = Math.sin(t * 1.5 + phase * Math.PI * 2) * 40;
      x = baseX + drift;
      y = baseY + fallSpeed;
      rotation = particle.rotation + t * 30;
      break;
    }

    case "explode": {
      const angle = phase * Math.PI * 2;
      const distance = t * 200 * speed;
      const cx = width * centerX;
      const cy = height * centerY;
      x = cx + Math.cos(angle) * distance;
      y = cy + Math.sin(angle) * distance;
      opacity = particle.opacity * Math.max(0, 1 - t * 0.3);
      scale = 1 + t * 0.5;
      break;
    }

    case "implode": {
      const angle = phase * Math.PI * 2;
      const cx = width * centerX;
      const cy = height * centerY;
      const maxDist = Math.max(width, height) * 0.6;
      const distance = maxDist * Math.max(0, 1 - t * 0.5);
      x = cx + Math.cos(angle) * distance;
      y = cy + Math.sin(angle) * distance;
      opacity = particle.opacity * Math.min(1, t * 0.5);
      scale = Math.max(0.2, 1 - t * 0.3);
      break;
    }

    case "orbit": {
      const angle = phase * Math.PI * 2 + t * 2;
      const radius = 100 + phase * 200;
      const cx = width * centerX;
      const cy = height * centerY;
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius * 0.6; // Slight ellipse
      rotation = (angle * 180) / Math.PI;
      break;
    }

    case "swirl": {
      const angle = phase * Math.PI * 2 + t * 3;
      const radius = (50 + phase * 150) * (1 + t * 0.2);
      const cx = width * centerX;
      const cy = height * centerY;
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius;
      y -= t * 40; // Upward drift
      opacity = particle.opacity * Math.max(0, 1 - t * 0.2);
      break;
    }

    case "flow": {
      const flowX = t * 100;
      const waveY = Math.sin(t * 2 + phase * Math.PI * 4) * 30;
      x = baseX + flowX;
      y = baseY + waveY;
      rotation = Math.sin(t + phase * 10) * 15;
      break;
    }

    case "sparkle": {
      x = baseX;
      y = baseY;
      const sparkle = Math.sin(t * 8 + phase * Math.PI * 2);
      opacity = particle.opacity * (0.3 + (sparkle + 1) * 0.35);
      scale = 0.8 + (sparkle + 1) * 0.3;
      break;
    }

    case "confetti": {
      const fallSpeed = t * 80;
      const swayX = Math.sin(t * 2 + phase * 10) * 50;
      const swayAmplitude = Math.sin(t * 0.5 + phase * 5) * 20;
      x = baseX + swayX + swayAmplitude;
      y = baseY + fallSpeed;
      rotation = particle.rotation + t * 180 + Math.sin(t * 3) * 90;
      break;
    }
  }

  // Handle wrapping
  if (wrap) {
    const margin = 50;
    if (x < -margin) x = width + margin + (x % (width + margin * 2));
    if (x > width + margin) x = x % (width + margin * 2) - margin;
    if (y < -margin) y = height + margin + (y % (height + margin * 2));
    if (y > height + margin) y = y % (height + margin * 2) - margin;
  }

  return { x, y, rotation, opacity: Math.max(0, Math.min(1, opacity)), scale };
}

/**
 * Renders a single particle shape.
 */
function renderParticleShape(
  shape: ParticleShape,
  size: number,
  color: string
): JSX.Element {
  switch (shape) {
    case "circle":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
          }}
        />
      );

    case "square":
      return (
        <div
          style={{
            width: size,
            height: size,
            background: color,
            borderRadius: size * 0.15,
          }}
        />
      );

    case "star": {
      const starSize = size * 1.2;
      return (
        <svg
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={color}
        >
          <path d="M12 0L14.5 8.5L24 9.5L17 15L19 24L12 19L5 24L7 15L0 9.5L9.5 8.5L12 0Z" />
        </svg>
      );
    }

    case "glow":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      );

    case "spark":
      return (
        <div
          style={{
            width: size * 0.2,
            height: size,
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
            borderRadius: size,
          }}
        />
      );

    case "dot":
      return (
        <div
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: "50%",
            background: color,
          }}
        />
      );

    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
          }}
        />
      );
  }
}

/**
 * `Particles` creates animated particle effects for video compositions.
 * Supports multiple motion patterns, shapes, and emission areas for versatile effects
 * like floating dust, explosions, confetti, snow, and sparkles.
 *
 * @example
 * ```tsx
 * // Floating dust particles
 * <Particles
 *   count={100}
 *   motion="float"
 *   colors={["#ffffff", "#f0f0f0"]}
 *   sizeRange={[2, 6]}
 *   opacityRange={[0.2, 0.6]}
 * />
 *
 * // Explosion effect
 * <Particles
 *   count={80}
 *   motion="explode"
 *   shapes={["circle", "star"]}
 *   colors={["#ff6b6b", "#ffd93d", "#ff8c42"]}
 *   speed={1.5}
 * />
 *
 * // Falling confetti
 * <Particles
 *   count={60}
 *   motion="confetti"
 *   shapes={["square"]}
 *   colors={["#ff0080", "#7928ca", "#0070f3", "#00d4aa"]}
 *   emissionArea="top"
 *   sizeRange={[8, 16]}
 * />
 *
 * // Twinkling stars
 * <Particles
 *   count={40}
 *   motion="sparkle"
 *   shapes={["star", "glow"]}
 *   colors={["#ffffff", "#fffacd"]}
 *   sizeRange={[4, 12]}
 * />
 *
 * // Snow effect
 * <Particles
 *   count={150}
 *   motion="fall"
 *   shapes={["circle"]}
 *   colors={["#ffffff"]}
 *   sizeRange={[2, 8]}
 *   emissionArea="top"
 *   speed={0.5}
 * />
 * ```
 */
export const Particles = ({
  count = 50,
  shapes = ["circle"],
  colors = ["#ffffff"],
  sizeRange = [2, 8],
  motion = "float",
  speed = 1,
  emissionArea = "full",
  width = 1920,
  height = 1080,
  opacityRange = [0.3, 1],
  blur = 0,
  wrap = true,
  seed = 42,
  centerX = 0.5,
  centerY = 0.5,
  className,
  style,
}: ParticlesProps) => {
  const frame = useCurrentFrame();

  // Generate particles deterministically
  const particles = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: count }, (_, i): Particle => {
      const pos = getInitialPosition(
        emissionArea,
        width,
        height,
        random,
        centerX,
        centerY
      );
      return {
        id: i,
        x: pos.x,
        y: pos.y,
        size: sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(random() * colors.length)],
        shape: shapes[Math.floor(random() * shapes.length)],
        speed: 0.5 + random() * 1,
        phase: random(),
        rotation: random() * 360,
        opacity: opacityRange[0] + random() * (opacityRange[1] - opacityRange[0]),
      };
    });
  }, [count, seed, shapes, colors, sizeRange, opacityRange, emissionArea, width, height, centerX, centerY]);

  const time = (frame / 30) * speed;

  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width,
    height,
    overflow: "hidden",
    pointerEvents: "none",
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {particles.map((particle) => {
        const { x, y, rotation, opacity, scale } = calculateMotion(
          particle,
          motion,
          time,
          width,
          height,
          centerX,
          centerY,
          wrap
        );

        const particleStyle: CSSProperties = {
          position: "absolute",
          left: x - (particle.size * scale) / 2,
          top: y - (particle.size * scale) / 2,
          opacity,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          willChange: "transform, opacity",
        };

        return (
          <div key={particle.id} style={particleStyle}>
            {renderParticleShape(particle.shape, particle.size, particle.color)}
          </div>
        );
      })}
    </div>
  );
};
