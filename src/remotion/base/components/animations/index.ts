/**
 * Animation primitives barrel export.
 *
 * @example
 * import { Animate, Motion, FadeIn, SlideIn, ScaleIn, Rotate } from './animations';
 */

export { Animate, type AnimateProps, type AnimatableProperties } from "./Animate";
export { Motion, type MotionProps, type MotionType } from "./Motion";
export { FadeIn, FadeOut, type FadeInProps, type FadeOutProps, type FadeDirection } from "./FadeIn";
export { SlideIn, SlideOut, type SlideInProps, type SlideOutProps, type SlideDirection } from "./SlideIn";
export { ScaleIn, ScaleOut, type ScaleInProps, type ScaleOutProps, type ScaleOrigin } from "./ScaleIn";
export { Rotate, Spin, type RotateProps, type SpinProps, type RotateAxis } from "./Rotate";
