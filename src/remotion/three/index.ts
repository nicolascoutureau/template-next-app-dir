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
  // Font loading utilities
  useOpenTypeFont,
  useGoogleFont,
  getGoogleFontTTFUrl,
  getTextMetrics,
  // Google Font types
  type GoogleFontConfig,
  type GoogleFontWeight,
  // GSAP text animation
  SplitText3DGsap,
  type SplitText3DGsapProps,
  type SplitType,
  type CharAnimationState,
  type WordAnimationState,
  type WordData,
  gsapPresetFadeUp,
  gsapPresetElastic,
  gsapPresetWordByWord,
  gsapPresetCascade,
  gsapPresetTypewriter,
  gsapPreset3DReveal,
  gsapPresetWave,
  gsapPresetGlitch,
  // Rich text (multiple fonts/styles)
  RichText3DGsap,
  type RichText3DGsapProps,
  type TextSegment,
  type SegmentAnimationState,
  type SegmentData,
  type RichWordData,
  richTextPresetSegmentStagger,
  richTextPresetWave,
  richTextPresetTypewriter,
} from "./text";
