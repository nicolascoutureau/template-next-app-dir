export {
  SplitText3D,
  type SplitText3DProps,
  type AnimationPreset,
  type AnimationConfig,
  ANIMATION_PRESETS,
  useOpenTypeFont,
  getTextMetrics,
} from "./SplitText3D";

export {
  SplitText3DGsap,
  type SplitText3DGsapProps,
  type SplitType,
  type CharAnimationState,
  // Preset timeline factories
  gsapPresetFadeUp,
  gsapPresetElastic,
  gsapPresetWordByWord,
  gsapPresetCascade,
  gsapPresetTypewriter,
  gsapPreset3DReveal,
  gsapPresetWave,
  gsapPresetGlitch,
} from "./SplitText3DGsap";
