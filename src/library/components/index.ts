/**
 * @module components
 *
 * A collection of 3D transition and effect components for React Three Fiber + Remotion.
 * All components are designed to work inside a ThreeCanvas.
 */

// Blur-based transitions
export { BlurTransition, type BlurTransitionProps, type BlurType } from "./BlurTransition";
export { RackFocus, type RackFocusProps } from "./RackFocus";
export { ZoomBlur, type ZoomBlurProps, type ZoomDirection } from "./ZoomBlur";

// Digital effects
export { GlitchTransition, type GlitchTransitionProps, type GlitchIntensity } from "./GlitchTransition";

// Light effects
export { LightLeak, type LightLeakProps, type LightLeakStyle } from "./LightLeak";

// Distortion effects
export { LiquidWarp, type LiquidWarpProps, type LiquidStyle } from "./LiquidWarp";

// Mask-based transitions
export { MaskTransition, type MaskTransitionProps, type MaskShape } from "./MaskTransition";

// Particle effects
export { ParticleDissolve, type ParticleDissolveProps, type DissolvePattern } from "./ParticleDissolve";

// Slide transitions
export { SlideTransition, type SlideTransitionProps, type SlideEffect, type SlideDirection } from "./SlideTransition";
