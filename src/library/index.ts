// Components
export { GradientBackground } from "./components/GradientBackground";
export type {
  GradientBackgroundProps,
  GradientType,
  GradientStop,
  MeshPoint,
} from "./components/GradientBackground";

export { Noise, GrainOverlay } from "./components/Noise";
export type {
  NoiseProps,
  NoiseType,
  NoiseBlendMode,
} from "./components/Noise";

export { Shimmer } from "./components/Shimmer";
export type {
  ShimmerProps,
  ShimmerMode,
  ShimmerDirection,
} from "./components/Shimmer";

/** @deprecated Use `<Shimmer mode="text">` instead */
export { TextShimmer } from "./components/TextShimmer";
/** @deprecated Use ShimmerProps with mode="text" instead */
export type { TextShimmerProps } from "./components/TextShimmer";

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

export { DotGrid } from "./components/DotGrid";
export type { DotGridProps, DotAnimation, SpotlightConfig } from "./components/DotGrid";

export { Cursor } from "./components/Cursor";
export type { CursorProps, CursorAction, CursorVariant } from "./components/Cursor";

export { Counter } from "./components/Counter";
export type { CounterProps, CounterMode, CounterEasing } from "./components/Counter";

export { TextAnimation } from "./components/TextAnimation";
export type {
  TextAnimationProps,
  TextAnimationPreset,
  SplitType,
  AnimationDirection,
} from "./components/TextAnimation";

export { Camera } from "./components/Camera";
export type {
  CameraProps,
  CameraRef,
  CameraKeyframe,
  EasingFunction,
  EasingPreset,
} from "./components/Camera";

// Hooks
export { useFrameProgress } from "./hooks/useFrameProgress";
export type { FrameProgressOptions } from "./hooks/useFrameProgress";

export { useGsapTimeline } from "./hooks/useGsapTimeline";
export type { GsapTimelineOptions } from "./hooks/useGsapTimeline";
