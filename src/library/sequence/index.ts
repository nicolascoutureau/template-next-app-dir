// Types
export type {
  // SceneStack types (LLM-friendly API)
  TransitionSpec,
  SceneSpec,
  Segment,
  // Sequence3D types (Original API)
  AnimationWrapper,
  AnimationWrapperProps,
  SceneProps,
  Sequence3DProps,
  SceneData,
} from "./types";

// SceneStack (LLM-friendly API)
export { SceneStack } from "./SceneStack";
export type { SceneStackProps } from "./SceneStack";
export { SceneTransitionRenderer } from "./SceneTransitionRenderer";
export type { SceneTransitionRendererProps } from "./SceneTransitionRenderer";

// Sequence3D (Original API)
export { Sequence3D } from "./Sequence3D";
export { Scene } from "./Scene";

// Exit animations
export {
  SlideDownExit,
  SlideUpExit,
  SlideLeftExit,
  SlideRightExit,
  FadeExit,
  ScaleExit,
  NoExit,
} from "./transitions";

// Entry animations
export {
  ZoomInEntry,
  FadeEntry,
  SlideUpEntry,
  SlideDownEntry,
  ScaleEntry,
  NoEntry,
} from "./transitions";

// Presets
export {
  slideDownZoomPreset,
  crossfadePreset,
  scalePreset,
  cutPreset,
} from "./transitions";
