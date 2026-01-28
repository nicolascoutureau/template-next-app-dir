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
} from "./SplitText3D";

export {
  SplitText3DGsap,
  type SplitText3DGsapProps,
  type SplitType,
  type CharAnimationState,
  type WordAnimationState,
  type WordData,
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
