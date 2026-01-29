/**
 * @module library
 *
 * A collection of professional 3D text animation components for React Three Fiber + Remotion.
 */

// Re-export everything from backgrounds folder
export {
  // Backgrounds (all optimized for performance)
  GradientBackground,
  type GradientBackgroundProps,
  type GradientType,
  LavaShader,
  type LavaShaderProps,
  PlasmaBackground,
  type PlasmaBackgroundProps,
  type PlasmaStyle,
  MetaballsBackground,
  type MetaballsBackgroundProps,
  WaveGridBackground,
  type WaveGridBackgroundProps,
  GradientOrbs,
  type GradientOrbsProps,
} from "./backgrounds";

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

// Utilities
export { FPSMonitor, useFPS, type FPSMonitorProps } from "./utils";

// Media components
export {
  MediaFrame,
  type MediaFrameProps,
  Image3D,
  type Image3DProps,
  type ImageFit,
} from "./media";

// Decorative components
export { ColorBarHeader, type ColorBarHeaderProps } from "./decorative";

// Layout components
export { AsymmetricLayout, type AsymmetricLayoutProps } from "./layouts";

// Transition components
export {
  VerticalStripReveal,
  type VerticalStripRevealProps,
  // Flip Under Transition (3D flip on X axis + zoom blur)
  FlipUnderTransition,
  FlipUnderExit,
  ZoomBlurEnter,
  useFlipUnderTransition,
  type FlipUnderTransitionProps,
  type FlipUnderTransitionConfig,
  type FlipUnderTransitionResult,
} from "./transitions";

// Effects components
export { Glow, type GlowProps, Shimmer, type ShimmerProps } from "./effects";

// Scene components (camera movement & animations)
export {
  // Animation (Ken Burns style zoom/drift)
  SceneAnimation,
  SceneAnimation2D,
  useSceneAnimation,
  type SceneAnimationProps,
  type SceneAnimationConfig,
  type SceneAnimationResult,
  // Scene Transition (fade in/out)
  SceneTransition,
  SceneTransition2D,
  useSceneTransition,
  type SceneTransitionProps,
  type SceneTransitionConfig,
  type SceneTransitionResult,
  // Combined convenience component
  SceneContainer,
  type SceneContainerProps,
} from "./scenes";

// Sequence components (declarative scene sequencing)
export {
  // SceneStack - LLM-friendly API (recommended)
  SceneStack,
  SceneTransitionRenderer,
  type SceneStackProps,
  type SceneTransitionRendererProps,
  type TransitionSpec,
  type SceneSpec,
  type Segment,
  // Sequence3D - Original API
  Sequence3D,
  Scene,
  // Types
  type AnimationWrapper,
  type AnimationWrapperProps,
  type SceneProps,
  type Sequence3DProps,
  // Exit animations
  SlideDownExit,
  SlideUpExit,
  SlideLeftExit,
  SlideRightExit,
  FadeExit,
  ScaleExit,
  NoExit,
  // Entry animations
  ZoomInEntry,
  FadeEntry,
  SlideUpEntry,
  SlideDownEntry,
  ScaleEntry,
  NoEntry,
  // Presets
  slideDownZoomPreset,
  crossfadePreset,
  scalePreset,
  cutPreset,
} from "./sequence";
