import type { ReactNode } from "react";
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";

export interface VerticalStripRevealProps {
  /** Content to reveal (3D children) */
  children: ReactNode;
  /** Number of vertical strips */
  strips?: number;
  /** Frame at which animation starts */
  startFrame?: number;
  /** Duration of each strip's animation in frames */
  durationInFrames?: number;
  /** Delay between each strip starting (in frames) */
  staggerDelay?: number;
  /** Direction of strip reveal */
  direction?: "left-to-right" | "right-to-left" | "center-out" | "edges-in";
  /** Reveal mode */
  revealMode?: "slide" | "fade" | "scale";
  /** Size of the reveal area [width, height] */
  size?: [number, number];
  /** Color of mask strips */
  maskColor?: string;
}

/**
 * `VerticalStripReveal` creates a staggered vertical strip reveal effect in 3D.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <VerticalStripReveal
 *     strips={5}
 *     durationInFrames={30}
 *     direction="center-out"
 *   >
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </VerticalStripReveal>
 * </ThreeCanvas>
 * ```
 */
export const VerticalStripReveal = ({
  children,
  strips = 5,
  startFrame = 0,
  durationInFrames = 30,
  staggerDelay = 4,
  direction = "center-out",
  revealMode = "slide",
  size = [10, 6],
  maskColor = "#000000",
}: VerticalStripRevealProps) => {
  const frame = useCurrentFrame();
  const { height: videoHeight } = useVideoConfig();
  const localFrame = frame - startFrame;

  const stripOrder = useMemo(() => getStripOrder(strips, direction), [strips, direction]);
  const stripWidth = size[0] / strips;

  const color = useMemo(() => new THREE.Color(maskColor), [maskColor]);

  if (localFrame < 0) {
    return null;
  }

  // Calculate total animation time to know when it's fully revealed
  const maxDelay = Math.max(...stripOrder) * staggerDelay;
  const totalAnimationDuration = maxDelay + durationInFrames;
  const isFullyRevealed = localFrame >= totalAnimationDuration;

  return (
    <group>
      {/* Content layer */}
      {children}

      {/* Mask strips that slide/fade away to reveal content */}
      {!isFullyRevealed &&
        stripOrder.map((orderIndex, i) => {
          const stripDelay = orderIndex * staggerDelay;
          const stripLocalFrame = localFrame - stripDelay;

          const progress = interpolate(
            stripLocalFrame,
            [0, durationInFrames],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          // Skip rendering if strip animation is complete
          if (progress >= 1) return null;

          const stripX = -size[0] / 2 + stripWidth / 2 + i * stripWidth;
          const { position, scale, opacity } = getStripTransform(
            revealMode,
            progress,
            stripX,
            size[1]
          );

          return (
            <mesh
              key={i}
              position={[position[0], position[1], 0.1]}
              scale={[scale[0], scale[1], 1]}
            >
              <planeGeometry args={[stripWidth * 1.01, size[1] * 1.01]} />
              <meshBasicMaterial
                color={color}
                transparent={revealMode === "fade"}
                opacity={opacity}
              />
            </mesh>
          );
        })}
    </group>
  );
};

function getStripOrder(
  strips: number,
  direction: "left-to-right" | "right-to-left" | "center-out" | "edges-in"
): number[] {
  const indices = Array.from({ length: strips }, (_, i) => i);

  switch (direction) {
    case "left-to-right":
      return indices;
    case "right-to-left":
      return indices.reverse();
    case "center-out": {
      const result: number[] = [];
      const center = Math.floor(strips / 2);
      for (let i = 0; i <= center; i++) {
        if (center - i >= 0) result[center - i] = i;
        if (center + i < strips) result[center + i] = i;
      }
      return result;
    }
    case "edges-in": {
      const result: number[] = [];
      for (let i = 0; i < strips; i++) {
        const distanceFromEdge = Math.min(i, strips - 1 - i);
        result[i] = distanceFromEdge;
      }
      return result;
    }
    default:
      return indices;
  }
}

function getStripTransform(
  revealMode: "slide" | "fade" | "scale",
  progress: number,
  stripX: number,
  height: number
): {
  position: [number, number];
  scale: [number, number];
  opacity: number;
} {
  switch (revealMode) {
    case "slide":
      return {
        position: [stripX, -progress * height, ],
        scale: [1, 1],
        opacity: 1,
      };
    case "fade":
      return {
        position: [stripX, 0],
        scale: [1, 1],
        opacity: 1 - progress,
      };
    case "scale":
      return {
        position: [stripX, 0],
        scale: [1, 1 - progress],
        opacity: 1,
      };
    default:
      return {
        position: [stripX, 0],
        scale: [1, 1],
        opacity: 1,
      };
  }
}
