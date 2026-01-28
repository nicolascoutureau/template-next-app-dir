/**
 * @module library
 *
 * A collection of professional 3D text animation components for React Three Fiber + Remotion.
 */

// Re-export everything from text folder
export {
  // SplitText3D
  SplitText3D,
  type SplitText3DProps,
  type AnimationPreset,
  type AnimationConfig,
  ANIMATION_PRESETS,
  useOpenTypeFont,
  useGoogleFont,
  getGoogleFontTTFUrl,
  getTextMetrics,
  type GoogleFontConfig,
  type GoogleFontWeight,
  // SplitText3DGsap
  SplitText3DGsap,
  type SplitText3DGsapProps,
  type SplitType,
  type CharAnimationState,
  type WordAnimationState,
  type LineAnimationState,
  type WordData,
  type LineData,
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
  // RichText3DGsap
  RichText3DGsap,
  type RichText3DGsapProps,
  type TextSegment,
  type SegmentAnimationState,
  type SegmentData,
  type RichWordData,
  richTextPresetSegmentStagger,
  richTextPresetWave,
  richTextPresetTypewriter,
  calculateRichTextLayout,
  verifyLayoutCentered,
  verifyNoOverlap,
  // ExtrudedText3DGsap
  ExtrudedText3DGsap,
  type ExtrudedText3DGsapProps,
  extrudedPreset3DReveal,
  extrudedPresetFlipIn,
  extrudedPresetExplode,
  extrudedPresetMatrix,
  extrudedPresetDomino,
  // Text layout utilities
  calculateTextMetrics,
  calculateBaselineOffset,
  verifySegmentOrder,
  type CharMetric,
  type TextMetricsResult,
  type SegmentLayout,
  type RichTextLayout,
} from "./text";
