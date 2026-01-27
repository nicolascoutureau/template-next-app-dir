// ============================================================================
// COMPONENTS
// ============================================================================

// Background & Texture
export { GradientBackground } from "./components/GradientBackground";
export type {
  GradientBackgroundProps,
  GradientType,
  GradientStop,
  MeshPoint,
} from "./components/GradientBackground";

export { Noise, GrainOverlay } from "./components/Noise";
export type { NoiseProps, NoiseBlendMode } from "./components/Noise";

export { DotGrid } from "./components/DotGrid";
export type { DotGridProps, DotAnimation, SpotlightConfig } from "./components/DotGrid";

export { FloatingElements } from "./components/FloatingElements";
export type {
  FloatingElementsProps,
  FloatingShape,
  FloatingElement,
} from "./components/FloatingElements";

export { Particles } from "./components/Particles";
export type {
  ParticlesProps,
  ParticleShape,
  ParticleMotion,
  EmissionArea,
  Particle,
} from "./components/Particles";

// Shader Backgrounds
export { ShaderPlane } from "./components/ShaderPlane";
export type {
  ShaderPlaneProps,
  ShaderPlaneRef,
  UniformValue,
  Uniforms,
} from "./components/ShaderPlane";

export { PlasmaBackground } from "./components/PlasmaBackground";
export type {
  PlasmaBackgroundProps,
  PlasmaStyle,
} from "./components/PlasmaBackground";

export { NoiseFlowBackground } from "./components/NoiseFlowBackground";
export type {
  NoiseFlowBackgroundProps,
  NoisePattern,
} from "./components/NoiseFlowBackground";

export { TunnelBackground } from "./components/TunnelBackground";
export type {
  TunnelBackgroundProps,
  TunnelStyle,
} from "./components/TunnelBackground";

// Effects & Animation
export { Animate } from "./components/Animate";
export type {
  AnimateProps,
  AnimatePreset,
  AnimateMode,
  AnimateCustomFn,
} from "./components/Animate";

export { Shimmer } from "./components/Shimmer";
export type {
  ShimmerProps,
  ShimmerMode,
  ShimmerDirection,
} from "./components/Shimmer";

export { Glow } from "./components/Glow";
export type { GlowProps } from "./components/Glow";

export { RevealMask } from "./components/RevealMask";
export type {
  RevealMaskProps,
  RevealType,
  RevealDirection,
} from "./components/RevealMask";

export { Stagger } from "./components/Stagger";
export type {
  StaggerProps,
  StaggerDirection,
  StaggerPreset,
  StaggerAnimationParams,
} from "./components/Stagger";

export { MotionPath } from "./components/MotionPath";
export type { MotionPathProps } from "./components/MotionPath";

// Text
export { TextAnimation } from "./components/TextAnimation";
export type {
  TextAnimationProps,
  TextAnimationPreset,
  SplitType,
  AnimationDirection,
} from "./components/TextAnimation";

/** @deprecated Use `<Shimmer mode="text">` instead */
export { TextShimmer } from "./components/TextShimmer";
/** @deprecated Use ShimmerProps with mode="text" instead */
export type { TextShimmerProps } from "./components/TextShimmer";

// Data Display
export { Counter } from "./components/Counter";
export type { CounterProps, CounterMode, CounterEasing } from "./components/Counter";

// Device Mockups
export { PhoneMockup } from "./components/PhoneMockup";
export type {
  PhoneMockupProps,
  PhoneDevice,
  PhoneColor,
  PhoneSlotProps,
  DeviceSpecs,
  PhoneMockupRef,
} from "./components/PhoneMockup";

export { BrowserMockup } from "./components/BrowserMockup";
export type {
  BrowserMockupProps,
  BrowserTheme,
  BrowserSlotProps,
  BrowserMockupRef,
} from "./components/BrowserMockup";

export { Terminal } from "./components/Terminal";
export type {
  TerminalProps,
  TerminalTheme,
  TerminalLine,
  TerminalSlotProps,
  TerminalRef,
} from "./components/Terminal";

export { TypingBar, SearchIcon } from "./components/TypingBar";
export type { TypingBarProps, TypingBarTheme } from "./components/TypingBar";

// Camera & Cursor
export { Camera } from "./components/Camera";
export type {
  CameraProps,
  CameraRef,
  CameraKeyframe,
  EasingFunction,
  EasingPreset,
} from "./components/Camera";

export { Cursor } from "./components/Cursor";
export type { CursorProps, CursorAction, CursorVariant } from "./components/Cursor";

// ============================================================================
// HOOKS
// ============================================================================

export { useFrameProgress } from "./hooks/useFrameProgress";
export type { FrameProgressOptions } from "./hooks/useFrameProgress";

export { useGsapTimeline } from "./hooks/useGsapTimeline";
export type { GsapTimelineOptions } from "./hooks/useGsapTimeline";

export { useWiggle } from "./hooks/useWiggle";
export type { WiggleConfig } from "./hooks/useWiggle";

export { useStagger } from "./hooks/useStagger";
export type { UseStaggerConfig, UseStaggerResult } from "./hooks/useStagger";

export { useChain } from "./hooks/useChain";
export type { UseChainConfig, UseChainResult, ChainSegment } from "./hooks/useChain";

export { useLoopProgress, useLoop } from "./hooks/useLoopProgress";
export type { UseLoopProgressConfig } from "./hooks/useLoopProgress";

// ============================================================================
// UTILITIES
// ============================================================================

export { easing } from "./utils/easing";
export { color } from "./utils/color";
export { layout } from "./utils/layout";
export type { Point, GridConfig, CircleConfig, DistributeConfig } from "./utils/layout";
