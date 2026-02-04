/**
 * @module library
 *
 * A collection of professional 3D animation components for React Three Fiber + Remotion.
 * All components are designed to work inside a ThreeCanvas.
 */

// Re-export everything from backgrounds folder (all Three.js shaders)
export {
  // Gradient Background
  GradientBackground,
  type GradientBackgroundProps,
  type GradientType,
  // Fluid Gradient (flowing gradient with organic movement)
  FluidGradient,
  type FluidGradientProps,
  LavaShader,
  type LavaShaderProps,
  // Aurora Background (subtle aurora/wave effect)
  AuroraBackground,
  type AuroraBackgroundProps,
  type AuroraStyle,
  PlasmaBackground,
  type PlasmaBackgroundProps,
  type PlasmaStyle,
  // Soft Blobs (organic shapes with breathing motion)
  SoftBlobs,
  type SoftBlobsProps,
  MetaballsBackground,
  type MetaballsBackgroundProps,
  // Subtle Grid (minimal grid pattern)
  SubtleGrid,
  type SubtleGridProps,
  WaveGridBackground,
  type WaveGridBackgroundProps,
  // Gradient Orbs (floating gradient orbs)
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

// Media components (3D)
export {
  MediaFrame,
  type MediaFrameProps,
  Image3D,
  type Image3DProps,
  type ImageFit,
} from "./media";

// Decorative components (3D)
export { ColorBarHeader, type ColorBarHeaderProps } from "./decorative";

// Layout components (3D groups)
export { AsymmetricLayout, type AsymmetricLayoutProps } from "./layouts";

// Transition components (3D)
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

// Effects components (3D shaders)
export { Glow, type GlowProps, Shimmer, type ShimmerProps } from "./effects";

// 3D transition/effect components
export {
  // Blur-based transitions
  BlurTransition,
  type BlurTransitionProps,
  type BlurType,
  RackFocus,
  type RackFocusProps,
  ZoomBlur,
  type ZoomBlurProps,
  type ZoomDirection,
  // Digital effects
  GlitchTransition,
  type GlitchTransitionProps,
  type GlitchIntensity,
  // Light effects
  LightLeak,
  type LightLeakProps,
  type LightLeakStyle,
  // Distortion effects
  LiquidWarp,
  type LiquidWarpProps,
  type LiquidStyle,
  // Mask-based transitions
  MaskTransition,
  type MaskTransitionProps,
  type MaskShape,
  // Particle effects
  ParticleDissolve,
  type ParticleDissolveProps,
  type DissolvePattern,
  // Slide transitions
  SlideTransition,
  type SlideTransitionProps,
  type SlideEffect,
  type SlideDirection,
} from "./components";

// Scene components (3D camera movement & animations)
export {
  // Animation (Ken Burns style zoom/drift)
  SceneAnimation,
  useSceneAnimation,
  type SceneAnimationProps,
  type SceneAnimationConfig,
  type SceneAnimationResult,
} from "./scenes";

// Sequence components (declarative scene sequencing - 3D)
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
