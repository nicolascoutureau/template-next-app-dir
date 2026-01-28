import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Image } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { Color } from "three";

export interface Image3DProps
  extends Omit<ThreeElements["mesh"], "scale" | "ref"> {
  url: string;
  scale?: number | [number, number];
  zoom?: number;
  radius?: number;
  grayscale?: number;
  color?: Color;
  toneMapped?: boolean;
  transparent?: boolean;
  opacity?: number;
  segments?: number;
  // Remotion animations
  fadeIn?: boolean;
  fadeInDelay?: number;
  fadeInDuration?: number;
  scaleIn?: boolean;
  scaleInDelay?: number;
  scaleInConfig?: { damping?: number; stiffness?: number; mass?: number };
}

export const Image3D: React.FC<Image3DProps> = ({
  url,
  scale = 1,
  zoom,
  radius,
  grayscale,
  color,
  toneMapped,
  transparent,
  opacity = 1,
  segments,
  fadeIn = false,
  fadeInDelay = 0,
  fadeInDuration = 15,
  scaleIn = false,
  scaleInDelay = 0,
  scaleInConfig = { damping: 80, stiffness: 100, mass: 0.8 },
  ...meshProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade animation
  const fadeOpacity = fadeIn
    ? interpolate(frame - fadeInDelay, [0, fadeInDuration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Scale animation
  const scaleProgress = scaleIn
    ? spring({
        fps,
        frame: frame - scaleInDelay,
        config: scaleInConfig,
      })
    : 1;

  const finalOpacity = opacity * fadeOpacity;
  const clampedScale = Math.max(0, Math.min(1, scaleProgress));

  // Apply scale animation to the scale prop
  const baseScale = Array.isArray(scale) ? scale : [scale, scale];
  const animatedScale: [number, number] = [
    baseScale[0] * clampedScale,
    baseScale[1] * clampedScale,
  ];

  if (finalOpacity <= 0 || clampedScale <= 0) {
    return null;
  }

  return (
    <Image
      url={url}
      scale={animatedScale}
      zoom={zoom}
      radius={radius}
      grayscale={grayscale}
      color={color}
      toneMapped={toneMapped}
      transparent={transparent || finalOpacity < 1}
      opacity={finalOpacity}
      segments={segments}
      {...meshProps}
    />
  );
};
