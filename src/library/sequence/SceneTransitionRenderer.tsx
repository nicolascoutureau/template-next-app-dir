import React, { useMemo } from "react";
import * as THREE from "three";
import type { TransitionSpec } from "./types";

export interface SceneTransitionRendererProps {
  /** The outgoing scene element */
  from: React.ReactNode;
  /** The incoming scene element */
  to: React.ReactNode;
  /** Transition progress from 0 to 1 */
  progress: number;
  /** Transition mode/specification */
  mode: TransitionSpec;
}

/**
 * SceneTransitionRenderer - Renders Three.js transitions between two scenes.
 * 
 * Handles various transition types:
 * - fade: Opacity crossfade with overlay planes
 * - wipe: Directional wipe using positioned planes
 * - dissolve: Noise-based dissolve effect
 * - glitch: RGB offset glitch effect
 * - pixelate: Scale-based pixelation simulation
 * - zoom: Zoom scale transition
 * - flip: 3D rotation flip transition
 */
export const SceneTransitionRenderer: React.FC<SceneTransitionRendererProps> = ({
  from,
  to,
  progress,
  mode,
}) => {
  return (
    <group>
      <TransitionRenderer
        from={from}
        to={to}
        progress={progress}
        mode={mode}
      />
    </group>
  );
};

interface TransitionRendererProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  mode: TransitionSpec;
}

const TransitionRenderer: React.FC<TransitionRendererProps> = ({
  from,
  to,
  progress,
  mode,
}) => {
  switch (mode.type) {
    case "fade":
      return <FadeTransition from={from} to={to} progress={progress} />;
    case "wipe":
      return <WipeTransition from={from} to={to} progress={progress} direction={mode.direction} />;
    case "dissolve":
      return <DissolveTransition from={from} to={to} progress={progress} softness={mode.softness} />;
    case "glitch":
      return <GlitchTransition from={from} to={to} progress={progress} intensity={mode.intensity} />;
    case "pixelate":
      return <PixelateTransition from={from} to={to} progress={progress} size={mode.size} />;
    case "zoom":
      return <ZoomTransition from={from} to={to} progress={progress} intensity={mode.intensity} />;
    case "flip":
      return <FlipTransition from={from} to={to} progress={progress} direction={mode.direction} />;
    default:
      return <FadeTransition from={from} to={to} progress={progress} />;
  }
};

// =============================================================================
// FADE TRANSITION
// =============================================================================

interface FadeTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({ from, to, progress }) => {
  return (
    <group>
      {/* Outgoing scene with fade-out overlay */}
      <group>
        {from}
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={progress}
            depthTest={false}
          />
        </mesh>
      </group>
      {/* Incoming scene with fade-in overlay */}
      <group position={[0, 0, 0.01]}>
        {to}
        <mesh position={[0, 0, 5]} renderOrder={1000}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - progress}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =============================================================================
// WIPE TRANSITION
// =============================================================================

interface WipeTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  direction: "left" | "right" | "up" | "down";
}

const WipeTransition: React.FC<WipeTransitionProps> = ({ from, to, progress, direction }) => {
  // Incoming scene position offset
  const toPosition = useMemo(() => {
    const offset = 50 * (1 - progress);
    switch (direction) {
      case "left":
        return new THREE.Vector3(-offset, 0, 0.01);
      case "right":
        return new THREE.Vector3(offset, 0, 0.01);
      case "up":
        return new THREE.Vector3(0, offset, 0.01);
      case "down":
        return new THREE.Vector3(0, -offset, 0.01);
      default:
        return new THREE.Vector3(-offset, 0, 0.01);
    }
  }, [progress, direction]);

  return (
    <group>
      {/* Outgoing scene */}
      <group>{from}</group>
      {/* Incoming scene slides in */}
      <group position={toPosition}>
        {to}
      </group>
    </group>
  );
};

// =============================================================================
// DISSOLVE TRANSITION
// =============================================================================

interface DissolveTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  softness?: number;
}

const DissolveTransition: React.FC<DissolveTransitionProps> = ({
  from,
  to,
  progress,
  softness = 0.08
}) => {
  // Adjusted progress with softness for smoother dissolve
  const adjustedProgress = Math.min(1, Math.max(0, (progress - softness) / (1 - 2 * softness)));

  return (
    <group>
      {/* Outgoing scene */}
      <group>
        {from}
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={adjustedProgress}
            depthTest={false}
          />
        </mesh>
      </group>
      {/* Incoming scene */}
      <group position={[0, 0, 0.01]}>
        {to}
        <mesh position={[0, 0, 5]} renderOrder={1000}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - adjustedProgress}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =============================================================================
// GLITCH TRANSITION
// =============================================================================

interface GlitchTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  intensity?: number;
}

const GlitchTransition: React.FC<GlitchTransitionProps> = ({
  from,
  to,
  progress,
  intensity = 0.5
}) => {
  // Create glitch offset based on progress
  const glitchOffset = useMemo(() => {
    const glitchAmount = intensity * Math.sin(progress * Math.PI) * 0.5;
    return {
      from: new THREE.Vector3(glitchAmount, glitchAmount * 0.3, 0),
      to: new THREE.Vector3(-glitchAmount, -glitchAmount * 0.3, 0.01),
    };
  }, [progress, intensity]);

  return (
    <group>
      {/* Outgoing scene with glitch offset */}
      <group position={glitchOffset.from}>
        {from}
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={progress}
            depthTest={false}
          />
        </mesh>
      </group>
      {/* Incoming scene with inverse glitch offset */}
      <group position={glitchOffset.to}>
        {to}
        <mesh position={[0, 0, 5]} renderOrder={1000}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - progress}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =============================================================================
// PIXELATE TRANSITION
// =============================================================================

interface PixelateTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  size?: number;
}

const PixelateTransition: React.FC<PixelateTransitionProps> = ({
  from,
  to,
  progress,
  size = 10
}) => {
  // Simulate pixelation with scale jitter at midpoint
  const scaleEffect = useMemo(() => {
    const pixelProgress = Math.sin(progress * Math.PI);
    const scaleFactor = 1 - (pixelProgress * 0.02 * (size / 10));
    return Math.max(0.9, scaleFactor);
  }, [progress, size]);

  return (
    <group>
      {/* Outgoing scene */}
      <group scale={[scaleEffect, scaleEffect, 1]}>
        {from}
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={progress}
            depthTest={false}
          />
        </mesh>
      </group>
      {/* Incoming scene */}
      <group scale={[scaleEffect, scaleEffect, 1]} position={[0, 0, 0.01]}>
        {to}
        <mesh position={[0, 0, 5]} renderOrder={1000}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - progress}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =============================================================================
// ZOOM TRANSITION
// =============================================================================

interface ZoomTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  intensity?: number;
}

const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  from,
  to,
  progress,
  intensity = 0.3
}) => {
  const fromScale = 1 + progress * intensity;
  const toScale = 1 + (1 - progress) * intensity;

  return (
    <group>
      {/* Outgoing scene zooms in and fades */}
      <group scale={[fromScale, fromScale, 1]}>
        {from}
        <mesh position={[0, 0, 5]} renderOrder={999}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={progress}
            depthTest={false}
          />
        </mesh>
      </group>
      {/* Incoming scene zooms from larger and fades in */}
      <group scale={[toScale, toScale, 1]} position={[0, 0, 0.01]}>
        {to}
        <mesh position={[0, 0, 5]} renderOrder={1000}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1 - progress}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =============================================================================
// FLIP TRANSITION
// =============================================================================

interface FlipTransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number;
  direction: "horizontal" | "vertical";
}

const FlipTransition: React.FC<FlipTransitionProps> = ({
  from,
  to,
  progress,
  direction
}) => {
  const rotation = useMemo(() => {
    const angle = progress * Math.PI;
    if (direction === "horizontal") {
      return new THREE.Euler(0, angle, 0);
    }
    return new THREE.Euler(angle, 0, 0);
  }, [progress, direction]);

  const showFrom = progress < 0.5;

  return (
    <group rotation={rotation}>
      {showFrom ? (
        <group>{from}</group>
      ) : (
        <group rotation={direction === "horizontal" ? [0, Math.PI, 0] : [Math.PI, 0, 0]}>
          {to}
        </group>
      )}
    </group>
  );
};

SceneTransitionRenderer.displayName = "SceneTransitionRenderer";
