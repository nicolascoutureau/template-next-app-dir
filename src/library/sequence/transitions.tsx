import React from "react";
import type { AnimationWrapper } from "./types";

// =============================================================================
// EXIT ANIMATIONS - How scenes leave
// =============================================================================

/**
 * Slide down exit - scene slides down off screen
 */
export const SlideDownExit: AnimationWrapper = ({ children, progress }) => (
  <group position={[0, -progress * 14, 2]}>
    {children}
  </group>
);

/**
 * Slide up exit - scene slides up off screen
 */
export const SlideUpExit: AnimationWrapper = ({ children, progress }) => (
  <group position={[0, progress * 14, 2]}>
    {children}
  </group>
);

/**
 * Slide left exit - scene slides left off screen
 */
export const SlideLeftExit: AnimationWrapper = ({ children, progress }) => (
  <group position={[-progress * 14, 0, 2]}>
    {children}
  </group>
);

/**
 * Slide right exit - scene slides right off screen
 */
export const SlideRightExit: AnimationWrapper = ({ children, progress }) => (
  <group position={[progress * 14, 0, 2]}>
    {children}
  </group>
);

/**
 * Fade exit - scene fades out with black overlay
 */
export const FadeExit: AnimationWrapper = ({ children, progress }) => (
  <group>
    {children}
    <mesh position={[0, 0, 5]} renderOrder={999}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={progress}
        depthTest={false}
      />
    </mesh>
  </group>
);

/**
 * Scale exit - scene scales down and fades
 */
export const ScaleExit: AnimationWrapper = ({ children, progress }) => {
  const scale = 1 - progress * 0.3;
  return (
    <group scale={[scale, scale, 1]} position={[0, 0, 2]}>
      {children}
      <mesh position={[0, 0, 5]} renderOrder={999}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={progress}
          depthTest={false}
        />
      </mesh>
    </group>
  );
};

/**
 * No animation exit - instant cut
 */
export const NoExit: AnimationWrapper = ({ children, progress }) => (
  progress < 0.5 ? <>{children}</> : null
);

// =============================================================================
// ENTRY ANIMATIONS - How scenes appear
// =============================================================================

/**
 * Zoom in entry - scene zooms from slightly smaller
 */
export const ZoomInEntry: AnimationWrapper = ({ children, progress }) => {
  const scale = 0.95 + progress * 0.05;
  return (
    <group scale={[scale, scale, 1]}>
      {children}
    </group>
  );
};

/**
 * Fade entry - scene fades in
 */
export const FadeEntry: AnimationWrapper = ({ children, progress }) => (
  <group>
    {children}
    <mesh position={[0, 0, 5]} renderOrder={999}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={1 - progress}
        depthTest={false}
      />
    </mesh>
  </group>
);

/**
 * Slide up entry - scene slides up from below
 */
export const SlideUpEntry: AnimationWrapper = ({ children, progress }) => (
  <group position={[0, (1 - progress) * -14, 0]}>
    {children}
  </group>
);

/**
 * Slide down entry - scene slides down from above
 */
export const SlideDownEntry: AnimationWrapper = ({ children, progress }) => (
  <group position={[0, (1 - progress) * 14, 0]}>
    {children}
  </group>
);

/**
 * Scale entry - scene scales up from smaller
 */
export const ScaleEntry: AnimationWrapper = ({ children, progress }) => {
  const scale = 0.7 + progress * 0.3;
  return (
    <group scale={[scale, scale, 1]}>
      {children}
      <mesh position={[0, 0, 5]} renderOrder={999}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={1 - progress}
          depthTest={false}
        />
      </mesh>
    </group>
  );
};

/**
 * No animation entry - instant appear
 */
export const NoEntry: AnimationWrapper = ({ children, progress }) => (
  progress >= 0.5 ? <>{children}</> : null
);

// =============================================================================
// COMBINED PRESETS - Common combinations
// =============================================================================

/**
 * Slide down with zoom - exit slides down, entry zooms in
 */
export const slideDownZoomPreset = {
  exit: SlideDownExit,
  enter: ZoomInEntry,
};

/**
 * Crossfade preset - both scenes fade
 */
export const crossfadePreset = {
  exit: FadeExit,
  enter: FadeEntry,
};

/**
 * Scale preset - exit scales down, entry scales up
 */
export const scalePreset = {
  exit: ScaleExit,
  enter: ScaleEntry,
};

/**
 * Cut preset - instant cut between scenes
 */
export const cutPreset = {
  exit: NoExit,
  enter: NoEntry,
};
