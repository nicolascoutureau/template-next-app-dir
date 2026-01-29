import React, { useMemo } from "react";
import { interpolate, Easing } from "remotion";

export interface FlipUnderTransitionConfig {
  /** Duration of the transition in frames (default: 30) */
  duration?: number;
  /** Maximum X rotation for exiting scene in degrees (default: -90, negative = flip backward/under) */
  exitRotationX?: number;
  /** How far the exiting scene moves down in Y (default: -2) */
  exitOffsetY?: number;
  /** How far the exiting scene moves back in Z (default: -3) */
  exitDepth?: number;
  /** Starting scale for entering scene (default: 0.7) */
  enterStartScale?: number;
  /** Starting blur amount for entering scene in world units (default: 0.3) */
  enterStartBlur?: number;
  /** Easing for exit animation (default: Easing.in(Easing.cubic)) */
  exitEasing?: (t: number) => number;
  /** Easing for enter animation (default: Easing.out(Easing.cubic)) */
  enterEasing?: (t: number) => number;
}

export interface FlipUnderTransitionResult {
  /** Exit scene values */
  exit: {
    rotationX: number;
    positionY: number;
    positionZ: number;
    opacity: number;
    visible: boolean;
  };
  /** Enter scene values */
  enter: {
    scale: number;
    blur: number;
    opacity: number;
    visible: boolean;
  };
  /** Overall progress (0-1) */
  progress: number;
}

/**
 * Hook for calculating flip-under transition values.
 * Scene A rotates on Y axis and goes under, Scene B zooms in with blur from behind.
 *
 * @param localFrame - Current frame relative to transition start
 * @param config - Optional configuration
 */
export const useFlipUnderTransition = (
  localFrame: number,
  config: FlipUnderTransitionConfig = {}
): FlipUnderTransitionResult => {
  const {
    duration = 30,
    exitRotationX = -90,
    exitOffsetY = -2,
    exitDepth = -3,
    enterStartScale = 0.7,
    enterStartBlur = 0.3,
    exitEasing = Easing.in(Easing.cubic),
    enterEasing = Easing.out(Easing.cubic),
  } = config;

  const progress = interpolate(
    localFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Exit animation (Scene A flips backward on X axis and goes under)
  const exitProgress = interpolate(
    localFrame,
    [0, duration * 0.6], // Exit completes at 60% of transition
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: exitEasing }
  );

  const exitRotation = exitProgress * exitRotationX * (Math.PI / 180);
  const exitY = exitProgress * exitOffsetY;
  const exitZ = exitProgress * exitDepth;
  const exitOpacity = interpolate(
    exitProgress,
    [0, 0.5, 1],
    [1, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Enter animation (Scene B zooms in with blur)
  const enterProgress = interpolate(
    localFrame,
    [duration * 0.3, duration], // Enter starts at 30% of transition
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: enterEasing }
  );

  const enterScale = interpolate(
    enterProgress,
    [0, 1],
    [enterStartScale, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const enterBlur = interpolate(
    enterProgress,
    [0, 1],
    [enterStartBlur, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const enterOpacity = interpolate(
    enterProgress,
    [0, 0.5, 1],
    [0, 0.5, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    exit: {
      rotationX: exitRotation,
      positionY: exitY,
      positionZ: exitZ,
      opacity: exitOpacity,
      visible: exitOpacity > 0.01,
    },
    enter: {
      scale: enterScale,
      blur: enterBlur,
      opacity: enterOpacity,
      visible: enterOpacity > 0.01,
    },
    progress,
  };
};

export interface FlipUnderTransitionProps {
  /** Exiting scene content (Scene A) */
  exitScene: React.ReactNode;
  /** Entering scene content (Scene B) */
  enterScene: React.ReactNode;
  /** Current frame relative to transition start */
  localFrame: number;
  /** Transition configuration */
  config?: FlipUnderTransitionConfig;
  /** Blur overlay color (default: transparent white) */
  blurColor?: string;
}

/**
 * 3D transition where Scene A rotates on Y axis and goes under,
 * while Scene B emerges with a zoom-blur effect from behind.
 *
 * @example
 * ```tsx
 * // During transition frames (e.g., frames 90-120)
 * {isTransitioning && (
 *   <FlipUnderTransition
 *     localFrame={frame - transitionStart}
 *     exitScene={<Scene1Content />}
 *     enterScene={<Scene2Content />}
 *     config={{ duration: 30 }}
 *   />
 * )}
 * ```
 */
export const FlipUnderTransition: React.FC<FlipUnderTransitionProps> = ({
  exitScene,
  enterScene,
  localFrame,
  config,
  blurColor = "rgba(255,255,255,0.1)",
}) => {
  const { exit, enter } = useFlipUnderTransition(localFrame, config);

  // Create blur planes for the zoom-blur effect
  const blurPlanes = useMemo(() => {
    if (enter.blur <= 0.01) return null;
    
    const layers = 5;
    const planes = [];
    
    for (let i = 0; i < layers; i++) {
      const layerProgress = i / layers;
      const layerScale = 1 + enter.blur * layerProgress * 0.5;
      const layerOpacity = (1 - layerProgress) * enter.blur * 0.3;
      
      planes.push(
        <mesh
          key={i}
          position={[0, 0, -0.1 * (i + 1)]}
          scale={[layerScale, layerScale, 1]}
          renderOrder={100 - i}
        >
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial
            color={blurColor}
            transparent
            opacity={layerOpacity}
            depthTest={false}
          />
        </mesh>
      );
    }
    
    return planes;
  }, [enter.blur, blurColor]);

  return (
    <>
      {/* Enter scene (Scene B) - behind, with zoom blur */}
      {enter.visible && (
        <group
          position={[0, 0, -2]}
          scale={[enter.scale, enter.scale, 1]}
        >
          {enterScene}
          {blurPlanes}
          {/* Fade overlay */}
          {enter.opacity < 0.99 && (
            <mesh position={[0, 0, 4]} renderOrder={998}>
              <planeGeometry args={[50, 50]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={1 - enter.opacity}
                depthTest={false}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Exit scene (Scene A) - rotates on X axis and goes under */}
      {exit.visible && (
        <group
          position={[0, exit.positionY, exit.positionZ]}
          rotation={[exit.rotationX, 0, 0]}
        >
          {exitScene}
          {/* Fade overlay for exit */}
          {exit.opacity < 0.99 && (
            <mesh position={[0, 0, 5]} renderOrder={999}>
              <planeGeometry args={[50, 50]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={1 - exit.opacity}
                depthTest={false}
              />
            </mesh>
          )}
        </group>
      )}
    </>
  );
};

/**
 * Simpler version: just the exit animation (flip under)
 */
export const FlipUnderExit: React.FC<{
  children: React.ReactNode;
  localFrame: number;
  duration?: number;
  config?: Pick<FlipUnderTransitionConfig, "exitRotationX" | "exitOffsetY" | "exitDepth" | "exitEasing">;
}> = ({ children, localFrame, duration = 30, config }) => {
  const { exit } = useFlipUnderTransition(localFrame, { duration, ...config });

  if (!exit.visible) return null;

  return (
    <group
      position={[0, exit.positionY, exit.positionZ]}
      rotation={[exit.rotationX, 0, 0]}
    >
      {children}
      {exit.opacity < 0.99 && (
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - exit.opacity}
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Simpler version: just the enter animation (zoom blur)
 */
export const ZoomBlurEnter: React.FC<{
  children: React.ReactNode;
  localFrame: number;
  duration?: number;
  config?: Pick<FlipUnderTransitionConfig, "enterStartScale" | "enterStartBlur" | "enterEasing">;
}> = ({ children, localFrame, duration = 30, config }) => {
  const { enter } = useFlipUnderTransition(localFrame, { duration, ...config });

  if (!enter.visible) return null;

  return (
    <group scale={[enter.scale, enter.scale, 1]}>
      {children}
      {enter.opacity < 0.99 && (
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - enter.opacity}
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};
