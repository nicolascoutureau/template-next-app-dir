"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { Player } from "@remotion/player";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// Re-export remotion functions for convenience
export {
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  spring,
  interpolate,
  Easing,
} from "remotion";

// ============================================================================
// STORYBOOK CANVAS COMPONENT (uses Remotion Player)
// ============================================================================

export interface StorybookCanvasProps {
  children: React.ReactNode;
  /** Frames per second (default: 30) */
  fps?: number;
  /** Total duration in frames (default: 150) */
  durationInFrames?: number;
  /** Canvas width (default: 1920) */
  width?: number;
  /** Canvas height (default: 1080) */
  height?: number;
  /** Auto-play animation (default: true) */
  autoPlay?: boolean;
  /** Loop animation (default: true) */
  loop?: boolean;
}

// Store for passing children to composition (workaround for serialization)
const childrenStore = new Map<string, React.ReactNode>();
let idCounter = 0;

// ============================================================================
// GRADIENT ENVIRONMENT FOR METALLIC REFLECTIONS
// ============================================================================

/**
 * Creates a procedural gradient environment map for metallic reflections.
 * This gives metallic materials something to reflect, making them look shiny.
 */
const GradientEnvironment: React.FC = () => {
  const { gl, scene } = useThree();
  const envMapRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    // Create a simple gradient texture for environment
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Create a radial gradient - bright center fading to darker edges
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, "#ffffff");     // Bright white center
    gradient.addColorStop(0.3, "#e0e8f0");   // Light blue-white
    gradient.addColorStop(0.6, "#a0b8d0");   // Soft blue
    gradient.addColorStop(1, "#4a6080");     // Darker blue edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // Use PMREMGenerator for proper environment map
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    
    // Set as scene environment (for metallic reflections)
    scene.environment = envMap;
    
    envMapRef.current = envMap;

    // Cleanup
    texture.dispose();
    pmremGenerator.dispose();

    return () => {
      if (envMapRef.current) {
        envMapRef.current.dispose();
        scene.environment = null;
      }
    };
  }, [gl, scene]);

  return null;
};

interface CompositionProps {
  storeId: string;
  [key: string]: unknown; // Index signature for Remotion Player compatibility
}

/**
 * The actual composition component that runs inside the Remotion Player.
 */
const ThreeComposition: React.FC<CompositionProps> = ({ storeId }) => {
  const { width, height } = useVideoConfig();
  const children = childrenStore.get(storeId);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
        }}
      >
        {/* Environment map for metallic reflections */}
        <GradientEnvironment />
        
        {/* Improved lighting setup */}
        <ambientLight intensity={0.8} color={0xffffff} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color={0xffffff} />
        <directionalLight position={[-5, 3, 2]} intensity={0.8} color={0x8899ff} />
        <pointLight position={[0, 5, 8]} intensity={1.2} color={0xffffff} />
        
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/**
 * StorybookCanvas - A wrapper for previewing R3F + Remotion components in Storybook
 *
 * Uses auto-remount pattern to handle WebGL context issues in Storybook.
 * The Player is rendered immediately, then remounted after 300ms to ensure
 * a clean WebGL context.
 *
 * @example
 * ```tsx
 * <StorybookCanvas fps={30} durationInFrames={150}>
 *   <SplitText3DGsap text="Hello" fontUrl="/fonts/Inter-Bold.ttf" ... />
 * </StorybookCanvas>
 * ```
 */
export const StorybookCanvas: React.FC<StorybookCanvasProps> = ({
  children,
  fps = 30,
  durationInFrames = 150,
  width = 1920,
  height = 1080,
  autoPlay = true,
  loop = true,
}) => {
  // Generate a unique ID for this instance - stable across renders
  const storeIdRef = React.useRef<string | null>(null);
  if (!storeIdRef.current) {
    storeIdRef.current = `storybook-${++idCounter}`;
  }
  const storeId = storeIdRef.current;

  // Store children synchronously BEFORE rendering (not in useEffect)
  // This ensures children are available when ThreeComposition first renders
  childrenStore.set(storeId, children);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      childrenStore.delete(storeId);
    };
  }, [storeId]);

  const inputProps: CompositionProps = useMemo(() => ({ storeId }), [storeId]);

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <Player
        key={`player-${storeId}`}
        component={ThreeComposition}
        inputProps={inputProps}
        compositionWidth={width}
        compositionHeight={height}
        durationInFrames={durationInFrames}
        fps={fps}
        autoPlay={autoPlay}
        loop={loop}
        controls
        style={{
          width: "100%",
          aspectRatio: `${width} / ${height}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        renderLoading={() => (
          <div style={{ padding: 20, color: "#666" }}>Loading 3D scene...</div>
        )}
      />
    </div>
  );
};

export default StorybookCanvas;
