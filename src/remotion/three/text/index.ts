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
  type LineAnimationState,
  type WordData,
  type LineData,
  // Preset timeline factories
  gsapPresetFadeUp,
  gsapPresetElastic,
  gsapPresetWordByWord,
  gsapPresetCascade,
  gsapPresetTypewriter,
  gsapPreset3DReveal,
  gsapPresetWave,
  gsapPresetGlitch,
  gsapPresetLineByLine,
  gsapPresetLinesReveal,
} from "./SplitText3DGsap";

// Rich text (multiple fonts/styles in single text block)
export {
  RichText3DGsap,
  type RichText3DGsapProps,
  type TextSegment,
  type SegmentAnimationState,
  type SegmentData,
  type RichWordData,
  // Preset timeline factories
  richTextPresetSegmentStagger,
  richTextPresetWave,
  richTextPresetTypewriter,
  // Layout utilities (for testing)
  calculateRichTextLayout,
  verifyLayoutCentered,
  verifyNoOverlap,
} from "./RichText3DGsap";

// Text layout utilities (pure functions for testing)
export {
  calculateTextMetrics,
  calculateBaselineOffset,
  verifySegmentOrder,
  type CharMetric,
  type TextMetricsResult,
  type SegmentLayout,
  type RichTextLayout,
} from "./textLayout";
