import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

/**
 * Props for VignetteBlur component.
 */
export interface VignetteBlurProps {
  /** Maximum blur amount at the edges in pixels */
  blurAmount?: number;
  /** How far the clear center extends (0-1, 0 = no clear area, 1 = mostly clear) */
  clearRadius?: number;
  /** Blur falloff curve - higher values = sharper transition */
  falloff?: number;
  /** Number of blur layers (more = smoother gradient, but heavier) */
  layers?: number;
  /** Shape: "circle" for radial, "ellipse" for screen-fitting oval */
  shape?: "circle" | "ellipse";
  /** Center position X (0-1) */
  centerX?: number;
  /** Center position Y (0-1) */
  centerY?: number;
  /** Animate the blur amount */
  animate?: boolean;
  /** Animation type */
  animationType?: "pulse" | "breathe" | "fadeIn" | "fadeOut";
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Optional tint color for the blurred edges */
  tintColor?: string;
  /** Tint opacity (0-1) */
  tintOpacity?: number;
  /** Content to display */
  children?: ReactNode;
  /** Additional styles */
  style?: CSSProperties;
}

/**
 * Vignette blur effect component.
 * Creates a progressive blur from center to edges, like a depth-of-field effect.
 *
 * @example
 * // Basic vignette blur
 * <VignetteBlur blurAmount={20}>
 *   <YourContent />
 * </VignetteBlur>
 *
 * @example
 * // Animated with tint
 * <VignetteBlur
 *   blurAmount={30}
 *   clearRadius={0.4}
 *   animate
 *   animationType="breathe"
 *   tintColor="#000000"
 *   tintOpacity={0.3}
 * >
 *   <YourContent />
 * </VignetteBlur>
 *
 * @example
 * // Off-center focus
 * <VignetteBlur centerX={0.3} centerY={0.4} blurAmount={25}>
 *   <YourContent />
 * </VignetteBlur>
 */
export const VignetteBlur: React.FC<VignetteBlurProps> = ({
  blurAmount = 20,
  clearRadius = 0.3,
  falloff = 2,
  layers = 5,
  shape = "ellipse",
  centerX = 0.5,
  centerY = 0.5,
  animate = false,
  animationType = "breathe",
  animationSpeed = 1,
  delay = 0,
  tintColor,
  tintOpacity = 0.2,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation calculations
  const delayFrames = Math.round(delay * fps);
  const effectiveFrame = Math.max(0, frame - delayFrames);
  const time = (effectiveFrame / fps) * animationSpeed;

  // Calculate animated blur amount
  const animatedBlurAmount = useMemo(() => {
    if (!animate) return blurAmount;

    switch (animationType) {
      case "pulse":
        return blurAmount * (0.7 + Math.sin(time * 3) * 0.3);
      case "breathe":
        return blurAmount * (0.8 + Math.sin(time * 1.5) * 0.2);
      case "fadeIn":
        return interpolate(effectiveFrame, [0, fps * 1.5], [0, blurAmount], {
          extrapolateRight: "clamp",
        });
      case "fadeOut":
        return interpolate(effectiveFrame, [0, fps * 1.5], [blurAmount, 0], {
          extrapolateRight: "clamp",
        });
      default:
        return blurAmount;
    }
  }, [animate, animationType, blurAmount, time, effectiveFrame, fps]);

  // Generate blur layers
  const blurLayers = useMemo(() => {
    const result: Array<{
      blur: number;
      maskStart: number;
      maskEnd: number;
    }> = [];

    for (let i = 0; i < layers; i++) {
      const progress = i / (layers - 1);
      // Apply falloff curve to blur distribution
      const blurProgress = Math.pow(progress, 1 / falloff);
      const blur = animatedBlurAmount * blurProgress;

      // Calculate mask gradient stops
      // Each layer reveals a ring from the center outward
      const innerRadius = clearRadius + (1 - clearRadius) * (i / layers);
      const outerRadius = clearRadius + (1 - clearRadius) * ((i + 1) / layers);

      result.push({
        blur,
        maskStart: innerRadius * 100,
        maskEnd: outerRadius * 100,
      });
    }

    return result;
  }, [layers, clearRadius, falloff, animatedBlurAmount]);

  // Shape dimensions for gradient
  const gradientShape = shape === "circle" ? "circle" : "ellipse 70% 50%";
  const centerPosition = `${centerX * 100}% ${centerY * 100}%`;

  return (
    <AbsoluteFill style={style}>
      {/* Content layer */}
      {children}

      {/* Blur layers - from least blur to most */}
      {blurLayers.map((layer, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            // Mask reveals only the ring for this layer
            maskImage: `radial-gradient(${gradientShape} at ${centerPosition}, 
              transparent ${layer.maskStart}%, 
              black ${layer.maskEnd}%
            )`,
            WebkitMaskImage: `radial-gradient(${gradientShape} at ${centerPosition}, 
              transparent ${layer.maskStart}%, 
              black ${layer.maskEnd}%
            )`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Optional tint overlay */}
      {tintColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(${gradientShape} at ${centerPosition}, 
              transparent ${clearRadius * 100}%, 
              ${tintColor} 100%
            )`,
            opacity: tintOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Preset: Cinematic depth of field blur.
 */
export const CinematicBlur: React.FC<Omit<VignetteBlurProps, "blurAmount" | "clearRadius" | "layers" | "tintColor" | "tintOpacity">> = (props) => (
  <VignetteBlur
    {...props}
    blurAmount={25}
    clearRadius={0.35}
    layers={6}
    tintColor="#000000"
    tintOpacity={0.15}
  />
);

/**
 * Preset: Dreamy soft focus effect.
 */
export const DreamyBlur: React.FC<Omit<VignetteBlurProps, "blurAmount" | "clearRadius" | "falloff" | "layers">> = (props) => (
  <VignetteBlur
    {...props}
    blurAmount={35}
    clearRadius={0.25}
    falloff={1.5}
    layers={7}
  />
);

/**
 * Preset: Subtle focus vignette.
 */
export const SubtleVignette: React.FC<Omit<VignetteBlurProps, "blurAmount" | "clearRadius" | "layers">> = (props) => (
  <VignetteBlur
    {...props}
    blurAmount={12}
    clearRadius={0.45}
    layers={4}
  />
);

/**
 * Preset: Intense tunnel vision effect.
 */
export const TunnelVision: React.FC<Omit<VignetteBlurProps, "blurAmount" | "clearRadius" | "falloff" | "layers" | "tintColor" | "tintOpacity">> = (props) => (
  <VignetteBlur
    {...props}
    blurAmount={40}
    clearRadius={0.2}
    falloff={3}
    layers={8}
    tintColor="#000000"
    tintOpacity={0.4}
  />
);

export default VignetteBlur;
