import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

/**
 * Particle behavior types.
 */
export type ParticleBehavior =
  | "float"
  | "confetti"
  | "snow"
  | "sparkle"
  | "rise";

/**
 * Particle shape types.
 */
export type ParticleShape = "circle" | "square" | "star";

/**
 * Props for Particles component.
 */
export interface ParticlesProps {
  /** Number of particles */
  count?: number;
  /** Particle behavior */
  behavior?: ParticleBehavior;
  /** Particle shape */
  shape?: ParticleShape;
  /** Min and max size in pixels */
  size?: [number, number];
  /** Array of colors */
  colors?: string[];
  /** Min and max opacity */
  opacity?: [number, number];
  /** Animation speed multiplier */
  speed?: number;
  /** Burst origin for confetti [x, y] as 0-1 values */
  origin?: [number, number];
  /** Spread angle for confetti (degrees) */
  spread?: number;
  /** Gravity strength for confetti */
  gravity?: number;
  /** Horizontal wind for snow */
  wind?: number;
  /** Twinkle speed for sparkle */
  twinkleSpeed?: number;
  /** Wobble amount for rise */
  wobble?: number;
  /** Random seed for deterministic rendering */
  seed?: string;
  /** Container width */
  width?: number | string;
  /** Container height */
  height?: number | string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Generate a particle's initial state.
 */
function generateParticle(
  index: number,
  seed: string,
  size: [number, number],
  colors: string[],
  opacity: [number, number],
) {
  const particleSeed = `${seed}-${index}`;

  return {
    x: random(particleSeed + "-x") * 100,
    y: random(particleSeed + "-y") * 100,
    size: size[0] + random(particleSeed + "-size") * (size[1] - size[0]),
    color: colors[Math.floor(random(particleSeed + "-color") * colors.length)],
    opacity:
      opacity[0] +
      random(particleSeed + "-opacity") * (opacity[1] - opacity[0]),
    delay: random(particleSeed + "-delay"),
    speedMod: 0.5 + random(particleSeed + "-speed") * 1,
    angle: random(particleSeed + "-angle") * 360,
  };
}

/**
 * Basic particle system with preset behaviors.
 *
 * @example
 * // Floating particles
 * <Particles behavior="float" count={30} colors={["#fff", "#f0f"]} />
 *
 * @example
 * // Confetti burst
 * <Particles
 *   behavior="confetti"
 *   count={100}
 *   origin={[0.5, 0.5]}
 *   colors={["#ff0", "#f0f", "#0ff", "#0f0"]}
 * />
 *
 * @example
 * // Snow effect
 * <Particles behavior="snow" count={50} wind={0.2} />
 *
 * @example
 * // Sparkle/twinkle
 * <Particles behavior="sparkle" count={20} twinkleSpeed={0.5} />
 *
 * @example
 * // Rising bubbles
 * <Particles behavior="rise" count={15} wobble={0.3} />
 */
export const Particles: React.FC<ParticlesProps> = ({
  count = 30,
  behavior = "float",
  shape = "circle",
  size = [2, 6],
  colors = ["#ffffff"],
  opacity = [0.3, 0.8],
  speed = 1,
  origin = [0.5, 0.5],
  spread = 60,
  gravity = 0.5,
  wind = 0,
  twinkleSpeed = 0.5,
  wobble = 0.3,
  seed = "particles",
  width = "100%",
  height = "100%",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) =>
      generateParticle(i, seed, size, colors, opacity),
    );
  }, [count, seed, size, colors, opacity]);

  // Calculate particle positions based on behavior
  const particleStyles = useMemo(() => {
    return particles.map((particle, index) => {
      let x = particle.x;
      let y = particle.y;
      let currentOpacity = particle.opacity;
      let scale = 1;
      let rotation = 0;

      const particleTime =
        time * speed * particle.speedMod + particle.delay * 10;

      switch (behavior) {
        case "float": {
          // Gentle floating motion
          x += Math.sin(particleTime * 0.5 + index) * 3;
          y += Math.cos(particleTime * 0.3 + index * 0.5) * 2;
          y = ((y + particleTime * 2) % 120) - 10; // Slow upward drift
          break;
        }

        case "confetti": {
          // Burst from origin with gravity
          const burstTime = Math.max(0, time - particle.delay * 0.5);
          const burstSpeed = 200 * particle.speedMod;
          const burstAngle = ((particle.angle - 90) * spread) / 180 + 90;
          const angleRad = (burstAngle * Math.PI) / 180;

          const vx = Math.cos(angleRad) * burstSpeed;
          const vy = Math.sin(angleRad) * burstSpeed;

          x = origin[0] * 100 + vx * burstTime * 0.3;
          y =
            origin[1] * 100 +
            vy * burstTime * 0.3 +
            gravity * burstTime * burstTime * 50;

          rotation = burstTime * 360 * particle.speedMod;
          currentOpacity = Math.max(
            0,
            particle.opacity * (1 - burstTime * 0.3),
          );
          break;
        }

        case "snow": {
          // Falling with wind drift
          const fallSpeed = 10 * particle.speedMod;
          y = ((particle.y + particleTime * fallSpeed) % 120) - 10;
          x =
            particle.x +
            Math.sin(particleTime + index) * 5 +
            wind * particleTime * 20;
          x = (((x % 120) + 120) % 120) - 10;
          rotation = Math.sin(particleTime) * 30;
          break;
        }

        case "sparkle": {
          // Stationary with twinkling
          const twinkleCycle = Math.sin(
            particleTime * twinkleSpeed * Math.PI * 2 + index * 1.5,
          );
          currentOpacity = particle.opacity * ((twinkleCycle + 1) / 2);
          scale = 0.5 + ((twinkleCycle + 1) / 2) * 0.5;
          break;
        }

        case "rise": {
          // Rising with wobble
          const riseSpeed = 15 * particle.speedMod;
          y = 100 - ((particleTime * riseSpeed + particle.y) % 120);
          x = particle.x + Math.sin(particleTime * 2 + index) * wobble * 20;
          scale = 0.8 + Math.sin(particleTime * 3 + index) * 0.2;
          break;
        }
      }

      // Get shape styles
      let borderRadius = "50%";
      let clipPath: string | undefined;

      if (shape === "square") {
        borderRadius = "0";
      } else if (shape === "star") {
        clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
      }

      return {
        position: "absolute" as const,
        left: `${x}%`,
        top: `${y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        borderRadius,
        clipPath,
        opacity: currentOpacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        pointerEvents: "none" as const,
      };
    });
  }, [
    particles,
    behavior,
    time,
    speed,
    origin,
    spread,
    gravity,
    wind,
    twinkleSpeed,
    wobble,
    shape,
  ]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {particleStyles.map((particleStyle, index) => (
        <div key={index} style={particleStyle} />
      ))}
    </div>
  );
};

export default Particles;
