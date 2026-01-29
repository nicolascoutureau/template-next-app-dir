import React from "react";
import { interpolate, Easing } from "remotion";

export interface SceneTransitionConfig {
  /** Duration of fade-in in frames (default: 18) */
  fadeInDuration?: number;
  /** Duration of fade-out in frames (default: 12) */
  fadeOutDuration?: number;
  /** Scale at start of fade-in (default: 0.94) */
  fadeInStartScale?: number;
  /** Scale at end of fade-out (default: 1.12) */
  fadeOutEndScale?: number;
  /** Easing for fade-in opacity (default: Easing.out(Easing.cubic)) */
  fadeInEasing?: (t: number) => number;
  /** Easing for fade-out opacity (default: Easing.in(Easing.cubic)) */
  fadeOutEasing?: (t: number) => number;
  /** Back easing overshoot for fade-in scale (default: 1.2) */
  fadeInBackOvershoot?: number;
}

export interface SceneTransitionResult {
  /** Combined opacity (0-1) */
  opacity: number;
  /** Combined scale for transitions */
  scale: number;
  /** Individual values */
  fadeInOpacity: number;
  fadeOutOpacity: number;
  fadeInScale: number;
  fadeOutScale: number;
  /** Whether currently in fade-in phase */
  isFadingIn: boolean;
  /** Whether currently in fade-out phase */
  isFadingOut: boolean;
}

/**
 * Hook for calculating scene transition values (fade in/out with scale).
 * Use this for smooth transitions between scenes.
 *
 * @param localFrame - Current frame relative to scene start
 * @param sceneDuration - Total duration of the scene in frames
 * @param config - Optional configuration
 */
export const useSceneTransition = (
  localFrame: number,
  sceneDuration: number,
  config: SceneTransitionConfig = {}
): SceneTransitionResult => {
  const {
    fadeInDuration = 18,
    fadeOutDuration = 12,
    fadeInStartScale = 0.94,
    fadeOutEndScale = 1.12,
    fadeInEasing = Easing.out(Easing.cubic),
    fadeOutEasing = Easing.in(Easing.cubic),
    fadeInBackOvershoot = 1.2,
  } = config;

  const fadeOutStart = sceneDuration - fadeOutDuration;

  // Fade in
  const fadeInOpacity = interpolate(
    localFrame,
    [0, fadeInDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: fadeInEasing }
  );
  const fadeInScale = interpolate(
    localFrame,
    [0, fadeInDuration],
    [fadeInStartScale, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(fadeInBackOvershoot)) }
  );

  // Fade out
  const fadeOutOpacity = interpolate(
    localFrame,
    [fadeOutStart, sceneDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: fadeOutEasing }
  );
  const fadeOutScale = interpolate(
    localFrame,
    [fadeOutStart, sceneDuration],
    [1, fadeOutEndScale],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );

  const isFadingIn = localFrame < fadeInDuration;
  const isFadingOut = localFrame >= fadeOutStart;

  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);
  const scale = isFadingOut ? fadeOutScale : fadeInScale;

  return {
    opacity,
    scale,
    fadeInOpacity,
    fadeOutOpacity,
    fadeInScale,
    fadeOutScale,
    isFadingIn,
    isFadingOut,
  };
};

export interface SceneTransitionProps {
  children: React.ReactNode;
  /** Current frame relative to scene start */
  localFrame: number;
  /** Total duration of the scene in frames */
  sceneDuration: number;
  /** Transition configuration */
  config?: SceneTransitionConfig;
  /** Color of fade overlay (default: "#000000") */
  fadeColor?: string;
  /** Size of fade overlay plane (default: 50) */
  fadeOverlaySize?: number;
  /** Z position of fade overlay (default: 5) */
  fadeOverlayZ?: number;
  /** Disable the fade overlay (only apply scale) */
  disableFadeOverlay?: boolean;
  /** Disable the scale transition */
  disableScale?: boolean;
}

/**
 * 3D component that provides smooth fade in/out transitions between scenes.
 * Includes scale animation and a fade overlay for cinematic transitions.
 *
 * @example
 * ```tsx
 * <SceneTransition localFrame={localFrame} sceneDuration={120}>
 *   <mesh>
 *     <boxGeometry />
 *   </mesh>
 * </SceneTransition>
 *
 * // With custom timing
 * <SceneTransition
 *   localFrame={localFrame}
 *   sceneDuration={100}
 *   config={{ fadeInDuration: 25, fadeOutDuration: 20 }}
 *   fadeColor="#1a1a1a"
 * >
 *   {content}
 * </SceneTransition>
 * ```
 */
export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  localFrame,
  sceneDuration,
  config,
  fadeColor = "#000000",
  fadeOverlaySize = 50,
  fadeOverlayZ = 5,
  disableFadeOverlay = false,
  disableScale = false,
}) => {
  const { opacity, scale } = useSceneTransition(localFrame, sceneDuration, config);

  const effectiveScale = disableScale ? 1 : scale;
  const fadeOverlayOpacity = 1 - opacity;

  return (
    <group scale={[effectiveScale, effectiveScale, 1]}>
      {children}
      {!disableFadeOverlay && fadeOverlayOpacity > 0.01 && (
        <mesh position={[0, 0, fadeOverlayZ]} renderOrder={999}>
          <planeGeometry args={[fadeOverlaySize, fadeOverlaySize]} />
          <meshBasicMaterial
            color={fadeColor}
            transparent
            opacity={fadeOverlayOpacity}
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * 2D/DOM version of SceneTransition using CSS.
 */
export const SceneTransition2D: React.FC<
  Omit<SceneTransitionProps, "fadeOverlaySize" | "fadeOverlayZ"> & {
    style?: React.CSSProperties;
    className?: string;
  }
> = ({
  children,
  localFrame,
  sceneDuration,
  config,
  fadeColor = "#000000",
  disableFadeOverlay = false,
  disableScale = false,
  style,
  className,
}) => {
  const { opacity, scale } = useSceneTransition(localFrame, sceneDuration, config);

  const effectiveScale = disableScale ? 1 : scale;
  const fadeOverlayOpacity = 1 - opacity;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    transform: `scale(${effectiveScale})`,
    transformOrigin: "center center",
    ...style,
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: fadeColor,
    opacity: fadeOverlayOpacity,
    pointerEvents: "none",
    zIndex: 9999,
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
      {!disableFadeOverlay && fadeOverlayOpacity > 0.01 && (
        <div style={overlayStyle} />
      )}
    </div>
  );
};
