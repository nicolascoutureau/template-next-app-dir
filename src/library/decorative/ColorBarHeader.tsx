import { useMemo, useRef } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import * as THREE from "three";

export interface ColorBarHeaderProps {
  /** Bar color */
  color?: string;
  /** Full width of the bar when fully animated */
  width?: number;
  /** Height/thickness of the bar */
  height?: number;
  /** Position offset [x, y, z] */
  position?: [number, number, number];
  /** Whether to animate the width */
  animateWidth?: boolean;
  /** Frame at which animation starts */
  startFrame?: number;
  /** Duration of the animation in frames */
  durationInFrames?: number;
  /** Scale origin: "left", "center", or "right" */
  origin?: "left" | "center" | "right";
}

/**
 * `ColorBarHeader` creates an animated bar/line decoration in 3D space.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   {/* Gold accent bar above text *\/}
 *   <ColorBarHeader
 *     color="#D4AF37"
 *     width={4}
 *     height={0.08}
 *     position={[0, 1.5, 0]}
 *     animateWidth
 *     durationInFrames={20}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const ColorBarHeader = ({
  color = "#D4AF37",
  width = 4,
  height = 0.08,
  position = [0, 0, 0],
  animateWidth = true,
  startFrame = 0,
  durationInFrames = 20,
  origin = "center",
}: ColorBarHeaderProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const scale = animateWidth
    ? interpolate(localFrame, [0, durationInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
    : 1;

  const barColor = useMemo(() => new THREE.Color(color), [color]);

  // Calculate position offset based on origin
  const positionOffset = useMemo(() => {
    if (!animateWidth || origin === "center") return 0;
    const currentWidth = width * scale;
    const diff = (width - currentWidth) / 2;
    return origin === "left" ? -diff : diff;
  }, [animateWidth, origin, width, scale]);

  if (localFrame < 0) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[position[0] + positionOffset, position[1], position[2]]}
      scale={[scale, 1, 1]}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={barColor} />
    </mesh>
  );
};
