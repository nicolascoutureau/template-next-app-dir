export { Scene, sceneSchema, type SceneProps } from "./Scene";
export { AdvancedScene, advancedSceneSchema, type AdvancedSceneProps } from "./AdvancedScene";
export { RotatingBox } from "./components/RotatingBox";
export { AnimatedSphere } from "./components/AnimatedSphere";
export { OrbitingObjects } from "./components/OrbitingObjects";
export { Lights } from "./components/Lights";

// Text utilities
export {
  SplitText3D,
  type SplitText3DProps,
  type AnimationPreset,
  type AnimationConfig,
  ANIMATION_PRESETS,
  useOpenTypeFont,
  getTextMetrics,
} from "./text";
