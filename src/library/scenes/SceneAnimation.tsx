import React from "react";
import { interpolate, Easing } from "remotion";

export interface SceneAnimationConfig {
  /** Zoom amount during scene (0.06 = 6% zoom, default: 0.06) */
  zoomAmount?: number;
  /** Y drift range [start, end] for cinematic feel (default: [0.05, -0.05]) */
  yDriftRange?: [number, number];
  /** Easing for zoom (default: Easing.inOut(Easing.quad)) */
  zoomEasing?: (t: number) => number;
  /** Direction of zoom: "in" zooms closer, "out" zooms away (default: "in") */
  zoomDirection?: "in" | "out";
}

export interface SceneAnimationResult {
  /** Zoom scale value */
  zoom: number;
  /** Y position drift */
  yDrift: number;
}

/**
 * Hook for calculating scene animation values (Ken Burns style zoom and drift).
 * Use this for camera-like movement during a scene.
 *
 * @param localFrame - Current frame relative to scene start
 * @param sceneDuration - Total duration of the scene in frames
 * @param config - Optional configuration
 */
export const useSceneAnimation = (
  localFrame: number,
  sceneDuration: number,
  config: SceneAnimationConfig = {}
): SceneAnimationResult => {
  const {
    zoomAmount = 0.06,
    yDriftRange = [0.05, -0.05],
    zoomEasing = Easing.inOut(Easing.quad),
    zoomDirection = "in",
  } = config;

  const progress = interpolate(
    localFrame,
    [0, sceneDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: zoomEasing }
  );

  // Zoom: 1.0 -> 1.0 + zoomAmount (or reverse for "out")
  const zoom = zoomDirection === "in"
    ? 1 + progress * zoomAmount
    : 1 + zoomAmount - progress * zoomAmount;

  const yDrift = interpolate(
    localFrame,
    [0, sceneDuration],
    yDriftRange,
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return { zoom, yDrift };
};

export interface SceneAnimationProps {
  children: React.ReactNode;
  /** Current frame relative to scene start */
  localFrame: number;
  /** Total duration of the scene in frames */
  sceneDuration: number;
  /** Animation configuration */
  config?: SceneAnimationConfig;
  /** Disable zoom effect */
  disableZoom?: boolean;
  /** Disable Y drift effect */
  disableYDrift?: boolean;
  /** Additional position offset [x, y, z] */
  positionOffset?: [number, number, number];
}

/**
 * 3D component that provides Ken Burns style camera movement.
 * Wraps content with subtle zoom and vertical drift animation.
 *
 * @example
 * ```tsx
 * <SceneAnimation localFrame={localFrame} sceneDuration={120}>
 *   <mesh>
 *     <boxGeometry />
 *   </mesh>
 * </SceneAnimation>
 *
 * // With custom zoom
 * <SceneAnimation
 *   localFrame={localFrame}
 *   sceneDuration={100}
 *   config={{ zoomAmount: 0.1, zoomDirection: "out" }}
 * >
 *   {content}
 * </SceneAnimation>
 * ```
 */
export const SceneAnimation: React.FC<SceneAnimationProps> = ({
  children,
  localFrame,
  sceneDuration,
  config,
  disableZoom = false,
  disableYDrift = false,
  positionOffset = [0, 0, 0],
}) => {
  const { zoom, yDrift } = useSceneAnimation(localFrame, sceneDuration, config);

  const scale = disableZoom ? 1 : zoom;
  const y = disableYDrift ? 0 : yDrift;

  const position: [number, number, number] = [
    positionOffset[0],
    positionOffset[1] + y,
    positionOffset[2],
  ];

  return (
    <group scale={[scale, scale, 1]} position={position}>
      {children}
    </group>
  );
};

/**
 * 2D/DOM version of SceneAnimation using CSS transforms.
 */
export const SceneAnimation2D: React.FC<
  Omit<SceneAnimationProps, "positionOffset"> & {
    style?: React.CSSProperties;
    className?: string;
  }
> = ({
  children,
  localFrame,
  sceneDuration,
  config,
  disableZoom = false,
  disableYDrift = false,
  style,
  className,
}) => {
  const { zoom, yDrift } = useSceneAnimation(localFrame, sceneDuration, config);

  const scale = disableZoom ? 1 : zoom;
  const y = disableYDrift ? 0 : yDrift * 100; // Convert to pixels

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `scale(${scale}) translateY(${y}px)`,
    transformOrigin: "center center",
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
};
