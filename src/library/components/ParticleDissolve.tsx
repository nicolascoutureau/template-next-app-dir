import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing, random } from "remotion";
import { useMemo } from "react";

/**
 * Particle dissolve pattern.
 */
export type DissolvePattern = "scatter" | "vortex" | "explosion" | "gravity" | "wind";

/**
 * Props for the `ParticleDissolve` component.
 */
export type ParticleDissolveProps = {
  /** Content to dissolve. */
  children: ReactNode;
  /** Frame at which dissolve starts. */
  startFrame?: number;
  /** Duration of the dissolve in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Dissolve pattern. */
  pattern?: DissolvePattern;
  /** Number of particle columns. */
  columns?: number;
  /** Number of particle rows. */
  rows?: number;
  /** Whether this is a reveal (in) or dissolve (out). */
  mode?: "in" | "out";
  /** Intensity of particle movement. */
  intensity?: number;
  /** Stagger delay between particles (0-1). */
  stagger?: number;
  /** Seed for randomization. */
  seed?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

interface Particle {
  x: number;
  y: number;
  delay: number;
  angle: number;
  distance: number;
  rotation: number;
  scale: number;
}

/**
 * `ParticleDissolve` breaks content into animated particles.
 * Creates stunning dissolve/materialize effects.
 *
 * @example
 * ```tsx
 * // Scatter dissolve
 * <ParticleDissolve pattern="scatter" mode="out">
 *   <Content />
 * </ParticleDissolve>
 *
 * // Vortex reveal
 * <ParticleDissolve pattern="vortex" mode="in">
 *   <Content />
 * </ParticleDissolve>
 *
 * // Explosion effect
 * <ParticleDissolve pattern="explosion" intensity={2}>
 *   <Content />
 * </ParticleDissolve>
 * ```
 */
export const ParticleDissolve = ({
  children,
  startFrame = 0,
  durationInFrames = 45,
  easing = Easing.out(Easing.cubic),
  pattern = "scatter",
  columns = 10,
  rows = 10,
  mode = "out",
  intensity = 1,
  stagger = 0.4,
  seed = 0,
  className,
  style,
}: ParticleDissolveProps) => {
  const frame = useCurrentFrame();

  // Generate particle data
  const particles = useMemo((): Particle[] => {
    const result: Particle[] = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col / columns;
        const y = row / rows;
        const idx = row * columns + col;
        
        // Random values for this particle
        const randomAngle = random(`angle-${idx}-${seed}`) * Math.PI * 2;
        const randomDistance = (0.5 + random(`dist-${idx}-${seed}`) * 0.5) * intensity;
        const randomRotation = (random(`rot-${idx}-${seed}`) - 0.5) * 720;
        const randomScale = 0.5 + random(`scale-${idx}-${seed}`) * 0.5;
        
        // Calculate delay based on pattern
        let delay: number;
        const centerX = 0.5;
        const centerY = 0.5;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        switch (pattern) {
          case "vortex":
            const angle = Math.atan2(y - centerY, x - centerX);
            delay = (angle + Math.PI) / (Math.PI * 2) * 0.5 + distFromCenter * 0.5;
            break;
          case "explosion":
            delay = distFromCenter;
            break;
          case "gravity":
            delay = 1 - y; // Top particles go first
            break;
          case "wind":
            delay = x; // Left to right
            break;
          case "scatter":
          default:
            delay = random(`delay-${idx}-${seed}`);
            break;
        }
        
        result.push({
          x,
          y,
          delay,
          angle: randomAngle,
          distance: randomDistance * 200,
          rotation: randomRotation,
          scale: randomScale,
        });
      }
    }
    
    // Normalize delays to 0-1 range
    const maxDelay = Math.max(...result.map(p => p.delay));
    const minDelay = Math.min(...result.map(p => p.delay));
    result.forEach(p => {
      p.delay = (p.delay - minDelay) / (maxDelay - minDelay);
    });
    
    return result;
  }, [columns, rows, pattern, intensity, seed]);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? 1 - easedProgress : easedProgress;

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...style,
  };

  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;

  return (
    <div className={className} style={containerStyle}>
      {/* Hidden content for sizing */}
      <div style={{ visibility: "hidden" }}>{children}</div>
      
      {/* Particle grid */}
      {particles.map((particle, i) => {
        // Calculate this particle's animation progress
        const particleProgress = Math.min(1, Math.max(0, 
          (effectProgress - particle.delay * stagger) / (1 - stagger)
        ));
        
        // Movement calculations based on pattern
        let offsetX: number;
        let offsetY: number;
        
        switch (pattern) {
          case "vortex":
            const vortexAngle = particle.angle + particleProgress * Math.PI * 4;
            offsetX = Math.cos(vortexAngle) * particle.distance * particleProgress;
            offsetY = Math.sin(vortexAngle) * particle.distance * particleProgress;
            break;
          case "explosion":
            const explosionAngle = Math.atan2(particle.y - 0.5, particle.x - 0.5);
            offsetX = Math.cos(explosionAngle) * particle.distance * particleProgress;
            offsetY = Math.sin(explosionAngle) * particle.distance * particleProgress;
            break;
          case "gravity":
            offsetX = (random(`gx-${i}-${seed}`) - 0.5) * 50 * particleProgress;
            offsetY = particle.distance * particleProgress * 1.5;
            break;
          case "wind":
            offsetX = particle.distance * particleProgress;
            offsetY = Math.sin(particle.x * 10 + particleProgress * 5) * 30 * particleProgress;
            break;
          case "scatter":
          default:
            offsetX = Math.cos(particle.angle) * particle.distance * particleProgress;
            offsetY = Math.sin(particle.angle) * particle.distance * particleProgress;
            break;
        }
        
        const rotation = particle.rotation * particleProgress;
        const scale = 1 - particleProgress * (1 - particle.scale);
        const opacity = 1 - particleProgress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${particle.x * 100}%`,
              top: `${particle.y * 100}%`,
              width: `${cellWidth}%`,
              height: `${cellHeight}%`,
              overflow: "hidden",
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
              opacity,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `-${particle.x * 100 / cellWidth * 100}%`,
                top: `-${particle.y * 100 / cellHeight * 100}%`,
                width: `${columns * 100}%`,
                height: `${rows * 100}%`,
              }}
            >
              {children}
            </div>
          </div>
        );
      })}
    </div>
  );
};
