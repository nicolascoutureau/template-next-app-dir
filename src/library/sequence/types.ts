import { ComponentType } from "react";

// =============================================================================
// SceneStack Types (LLM-friendly API)
// =============================================================================

/**
 * Transition specification for SceneStack.
 * Simple discriminated union that LLMs can easily generate.
 */
export type TransitionSpec =
  | { type: "fade"; durationInFrames: number }
  | { type: "wipe"; durationInFrames: number; direction: "left" | "right" | "up" | "down" }
  | { type: "dissolve"; durationInFrames: number; seed?: number; softness?: number }
  | { type: "glitch"; durationInFrames: number; seed?: number; intensity?: number }
  | { type: "pixelate"; durationInFrames: number; size?: number }
  | { type: "zoom"; durationInFrames: number; intensity?: number }
  | { type: "flip"; durationInFrames: number; direction: "horizontal" | "vertical" };

/**
 * Scene specification for SceneStack.
 * LLM just provides id, duration, and the React element to render.
 */
export interface SceneSpec {
  /** Unique identifier for the scene */
  id: string;
  /** Duration of the scene in frames */
  durationInFrames: number;
  /** The React element to render for this scene */
  element: React.ReactNode;
}

/**
 * Internal timeline segment - either a scene or a transition.
 * Used internally by SceneStack to build the timeline.
 */
export type Segment =
  | { kind: "scene"; start: number; end: number; sceneIndex: number }
  | { kind: "transition"; start: number; end: number; from: number; to: number; spec: TransitionSpec };

// =============================================================================
// Sequence3D Types (Original API)
// =============================================================================

/**
 * Props passed to animation wrapper components
 */
export interface AnimationWrapperProps {
  /** The scene content to wrap */
  children: React.ReactNode;
  /** Animation progress from 0 to 1 */
  progress: number;
}

/**
 * A component that wraps scene content during animation.
 * Can apply transforms, effects, shaders, blur, glow, etc.
 * 
 * @example
 * ```tsx
 * const SlideDownExit: AnimationWrapper = ({ children, progress }) => (
 *   <group position={[0, -progress * 14, 2]}>
 *     {children}
 *   </group>
 * );
 * 
 * const BlurEntry: AnimationWrapper = ({ children, progress }) => (
 *   <EffectComposer>
 *     <Blur strength={1 - progress} />
 *     {children}
 *   </EffectComposer>
 * );
 * ```
 */
export type AnimationWrapper = ComponentType<AnimationWrapperProps>;

/**
 * Props for the Scene component
 */
export interface SceneProps {
  /** Scene content */
  children: React.ReactNode;
  /** Duration of the scene in frames (excluding transitions) */
  duration: number;
  /** Exit animation wrapper - how this scene disappears */
  exit?: AnimationWrapper;
  /** Entry animation wrapper - how this scene appears */
  enter?: AnimationWrapper;
}

/**
 * Props for the Sequence3D component
 */
export interface Sequence3DProps {
  /** Scene children */
  children: React.ReactNode;
  /** Duration of entry/exit animations in frames (default: 25) */
  transitionDuration?: number;
  /** Default exit animation wrapper */
  defaultExit?: AnimationWrapper;
  /** Default entry animation wrapper */
  defaultEnter?: AnimationWrapper;
}

/**
 * Internal scene data calculated by Sequence3D
 */
export interface SceneData {
  id: number;
  duration: number;
  startFrame: number;
  endFrame: number;
  exit?: AnimationWrapper;
  enter?: AnimationWrapper;
  content: React.ReactNode;
}

