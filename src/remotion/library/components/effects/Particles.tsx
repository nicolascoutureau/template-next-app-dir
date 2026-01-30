import React, { useMemo, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

/**
 * Particle behavior types.
 */
export type ParticleBehavior =
  | "float"
  | "confetti"
  | "snow"
  | "sparkle"
  | "rise"
  | "vortex"
  | "rain";

/**
 * Props for Particles component.
 */
export interface ParticlesProps {
  /** Number of particles */
  count?: number;
  /** Particle behavior */
  behavior?: ParticleBehavior;
  /** Min and max size in pixels */
  size?: [number, number];
  /** Array of colors */
  colors?: string[];
  /** Min and max opacity */
  opacity?: [number, number];
  /** Animation speed multiplier */
  speed?: number;
  /** Blending mode */
  blendMode?: GlobalCompositeOperation;
  /** Horizontal wind force */
  wind?: number;
  /** Gravity force (positive = down) */
  gravity?: number;
  /** Spread angle for confetti (degrees) */
  spread?: number;
  /** Burst origin for confetti [x, y] as 0-1 values */
  origin?: [number, number];
  /** Random seed for deterministic rendering */
  seed?: string;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  phase: number; // for oscillation
}

/**
 * Generate deterministic random number.
 */
function seededRandom(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h >>>= 0;
  return (h % 1000000) / 1000000;
}

/**
 * High-performance HTML5 Canvas particle system.
 * Renders thousands of particles efficiently.
 * 
 * @example
 * // Floating dust
 * <Particles behavior="float" count={100} opacity={[0.1, 0.4]} />
 * 
 * @example
 * // Confetti explosion
 * <Particles 
 *   behavior="confetti" 
 *   count={300} 
 *   colors={["#ff0", "#f0f", "#0ff"]} 
 *   speed={1.5} 
 * />
 * 
 * @example
 * // Magical sparkles
 * <Particles 
 *   behavior="sparkle" 
 *   count={50} 
 *   blendMode="screen" 
 *   colors={["#ffffff", "#ffd700"]} 
 * />
 */
export const Particles: React.FC<ParticlesProps> = ({
  count = 100,
  behavior = "float",
  size = [1, 4],
  colors = ["#ffffff"],
  opacity = [0.2, 0.8],
  speed = 1,
  blendMode = "source-over",
  wind = 0,
  gravity = 0,
  spread = 60,
  origin = [0.5, 0.5],
  seed = "particles",
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Initialize particles strictly based on seed
  // This must be deterministic: same seed = same initial state
  const particles = useMemo(() => {
    const prng = (id: number, suffix: string) => seededRandom(`${seed}-${id}-${suffix}`);
    
    return Array.from({ length: count }).map((_, i) => {
      // Position 0-1
      const x = prng(i, 'x');
      const y = prng(i, 'y');
      
      // Velocity
      const vx = (prng(i, 'vx') - 0.5) * 2; // -1 to 1
      const vy = (prng(i, 'vy') - 0.5) * 2; // -1 to 1
      
      // Properties
      const pSize = size[0] + prng(i, 'size') * (size[1] - size[0]);
      const color = colors[Math.floor(prng(i, 'color') * colors.length)];
      const pOpacity = opacity[0] + prng(i, 'opacity') * (opacity[1] - opacity[0]);
      
      return {
        x, // normalized 0-1
        y, // normalized 0-1
        vx, // normalized velocity
        vy,
        size: pSize,
        color,
        opacity: pOpacity,
        rotation: prng(i, 'rot') * Math.PI * 2,
        rotationSpeed: (prng(i, 'rotSpd') - 0.5) * 0.2,
        phase: prng(i, 'phase') * Math.PI * 2,
        initialX: x,
        initialY: y,
      };
    });
  }, [count, seed, size, colors, opacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = blendMode;

    const time = frame / fps;

    particles.forEach((p, i) => {
      let drawX = p.x * width;
      let drawY = p.y * height;
      let drawOpacity = p.opacity;
      let drawScale = 1;
      let rotation = p.rotation;

      // Apply behavior physics
      // Note: We calculate position analytically based on time where possible
      // to allow seeking without simulation steps.
      
      const t = time * speed;

      switch (behavior) {
        case "float":
          // Gentle floating with noise
          drawX = (p.x * width + Math.cos(t * 0.5 + p.phase) * 30 + wind * t * 100) % (width + 100) - 50;
          drawY = (p.y * height + Math.sin(t * 0.3 + p.phase) * 20 - t * 20) % (height + 100) - 50;
          // Wrap around logic handled by modulo, but we need to handle negative
          if (drawX < -50) drawX += width + 100;
          if (drawY < -50) drawY += height + 100;
          break;

        case "snow":
          // Falling with horizontal drift
          const snowFall = (gravity || 0.5) * 100; // pixels per second
          drawY = (p.y * height + t * (snowFall + p.vy * 20)) % (height + 50) - 25;
          drawX = (p.x * width + Math.sin(t + p.phase) * 50 + wind * t * 200) % (width + 100) - 50;
          if (drawX < -50) drawX += width + 100;
          if (drawY < -25) drawY += height + 50;
          rotation += t * p.rotationSpeed;
          break;

        case "rain":
          // Fast falling streaks
          const rainSpeed = (gravity || 2) * 500;
          drawY = (p.y * height + t * (rainSpeed + p.vy * 100)) % (height + 100) - 50;
          drawX = (p.x * width + wind * t * 300) % (width + 50) - 25;
          if (drawX < -25) drawX += width + 50;
          // Rain trails done via scaleY
          break;

        case "rise":
          // Bubbles rising
          const riseSpeed = (Math.abs(gravity) || 0.5) * 80;
          drawY = (p.y * height - t * (riseSpeed + p.vy * 20));
          // Wrap from bottom
          drawY = height + 50 - (Math.abs(drawY) % (height + 100));
          
          drawX = p.x * width + Math.sin(t * 2 + p.phase) * 20;
          drawScale = 0.5 + Math.sin(t + p.phase) * 0.5;
          break;

        case "confetti":
          // Burst from origin
          // Physics: x = x0 + v*t, y = y0 + vy*t + 0.5*g*t^2
          const burstTime = Math.max(0, t - p.phase * 0.1); // Stagger start
          if (burstTime <= 0) {
            drawOpacity = 0;
            break;
          }
          
          const angle = (p.vx * 0.5 + 0.5) * spread * (Math.PI / 180) - Math.PI / 2; // -90 +/- spread/2
          const velocity = 500 + p.vy * 200; // Speed variation
          
          const vx = Math.cos(angle) * velocity;
          const vy = Math.sin(angle) * velocity;
          const g = (gravity || 1.5) * 800; // Strong gravity
          
          drawX = origin[0] * width + vx * burstTime;
          drawY = origin[1] * height + vy * burstTime + 0.5 * g * burstTime * burstTime;
          
          rotation += burstTime * 10;
          // Fade out after 2 seconds
          drawOpacity = Math.max(0, p.opacity * (1 - burstTime / 3));
          break;

        case "sparkle":
          // Static position, twinkling opacity
          drawX = p.x * width;
          drawY = p.y * height;
          const twinkle = Math.sin(t * 5 + p.phase);
          drawScale = 0.5 + (twinkle + 1) * 0.5;
          drawOpacity = p.opacity * ((twinkle + 1) / 2);
          break;
          
        case "vortex":
          // Spiral toward center
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.4 * (1 - ((t * 0.2 + p.x) % 1));
          const vAngle = t * 2 + p.phase * 10;
          
          drawX = centerX + Math.cos(vAngle) * radius;
          drawY = centerY + Math.sin(vAngle) * radius;
          drawScale = (radius / (Math.min(width, height) * 0.4)); // Smaller at center
          break;
      }

      // Draw particle
      if (drawOpacity > 0.01) {
        ctx.globalAlpha = drawOpacity;
        ctx.fillStyle = p.color;
        
        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(rotation);
        ctx.scale(drawScale, drawScale);
        
        if (behavior === "rain") {
          // Rain drop shape
          ctx.fillRect(-1, -10, 2, 20 + p.size * 5);
        } else if (behavior === "confetti") {
          // Square/Rect confetti
          ctx.fillRect(-p.size, -p.size/2, p.size * 2, p.size);
        } else {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    });

  }, [frame, width, height, particles, behavior, speed, wind, gravity, spread, origin, blendMode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

export default Particles;
