import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from "react";
import { useCurrentFrame } from "remotion";

/**
 * Easing function type.
 */
export type EasingFunction = (t: number) => number;

/**
 * Built-in easing presets.
 */
export type EasingPreset =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "spring"
  | "bounce";

/**
 * Props for `Camera`.
 */
export type CameraProps = {
  /** Content to apply camera effects to. */
  children: ReactNode;

  // Transform controls
  /** Zoom level (1 = 100%, 2 = 200%, 0.5 = 50%). */
  zoom?: number;
  /** Horizontal pan in pixels (positive = right). */
  panX?: number;
  /** Vertical pan in pixels (positive = down). */
  panY?: number;
  /** Rotation angle in degrees. */
  rotate?: number;
  /** 3D rotation on X axis (tilt forward/back). */
  rotateX?: number;
  /** 3D rotation on Y axis (turn left/right). */
  rotateY?: number;

  // Shake effect
  /** Shake intensity (0 = none, higher = more shake). */
  shakeIntensity?: number;
  /** Shake frequency in Hz. */
  shakeFrequency?: number;
  /** Whether shake affects rotation too. */
  shakeRotation?: boolean;

  // 3D Perspective
  /** 3D perspective distance in pixels. */
  perspective?: number;
  /** Transform origin (e.g., "center", "top left", "50% 50%"). */
  origin?: string;

  // Animation controls (for animated transitions)
  /** Target zoom to animate to. */
  zoomTo?: number;
  /** Target panX to animate to. */
  panXTo?: number;
  /** Target panY to animate to. */
  panYTo?: number;
  /** Target rotation to animate to. */
  rotateTo?: number;
  /** Frame at which animation starts. */
  animationStartFrame?: number;
  /** Duration of the animation in frames. */
  animationDuration?: number;
  /** Easing preset or custom function. */
  easing?: EasingPreset | EasingFunction;

  /** Additional className. */
  className?: string;
  /** Additional styles for the outer wrapper. */
  style?: CSSProperties;
  /** Additional styles for the inner content wrapper. */
  contentStyle?: CSSProperties;
  /** 
   * Current frame override. If provided, uses this instead of useCurrentFrame().
   * Useful when using the component outside of a Remotion composition.
   */
  frame?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export type CameraRef = ComponentPropsWithRef<"div">["ref"];

const easingPresets: Record<EasingPreset, EasingFunction> = {
  linear: (t) => t,
  easeIn: (t) => t * t * t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  bounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/**
 * `Camera` applies camera-like effects to its children.
 * Useful for creating cinematic zoom, pan, rotation, and shake effects in Remotion compositions.
 *
 * @example
 * ```tsx
 * // Static zoom and pan
 * <Camera zoom={1.2} panX={-50} panY={20}>
 *   <Content />
 * </Camera>
 *
 * // Animated zoom
 * <Camera
 *   zoom={1}
 *   zoomTo={1.5}
 *   animationStartFrame={0}
 *   animationDuration={30}
 *   easing="easeOut"
 * >
 *   <Content />
 * </Camera>
 *
 * // Shake effect
 * <Camera shakeIntensity={5} shakeFrequency={15}>
 *   <Content />
 * </Camera>
 *
 * // 3D perspective rotation
 * <Camera perspective={1000} rotateY={-15} rotateX={5}>
 *   <Content />
 * </Camera>
 * ```
 */
export const Camera = forwardRef<HTMLDivElement, CameraProps>(
  (
    {
      children,
      zoom = 1,
      panX = 0,
      panY = 0,
      rotate = 0,
      rotateX = 0,
      rotateY = 0,
      shakeIntensity = 0,
      shakeFrequency = 10,
      shakeRotation = false,
      perspective = 1000,
      origin = "center",
      zoomTo,
      panXTo,
      panYTo,
      rotateTo,
      animationStartFrame = 0,
      animationDuration = 30,
      easing = "easeOut",
      className,
      style,
      contentStyle,
      frame: frameProp,
      ...restProps
    },
    ref,
  ) => {
    const frameFromHook = useCurrentFrame();
    const frame = frameProp ?? frameFromHook;

    // Resolve easing function
    const easingFn =
      typeof easing === "function" ? easing : easingPresets[easing];

    // Calculate animation progress
    const rawProgress = Math.max(
      0,
      Math.min(1, (frame - animationStartFrame) / animationDuration),
    );
    const progress = easingFn(rawProgress);

    // Interpolate animated values
    const currentZoom =
      zoomTo !== undefined ? zoom + (zoomTo - zoom) * progress : zoom;
    const currentPanX =
      panXTo !== undefined ? panX + (panXTo - panX) * progress : panX;
    const currentPanY =
      panYTo !== undefined ? panY + (panYTo - panY) * progress : panY;
    const currentRotate =
      rotateTo !== undefined ? rotate + (rotateTo - rotate) * progress : rotate;

    // Calculate shake offsets
    let shakeX = 0;
    let shakeY = 0;
    let shakeRot = 0;

    if (shakeIntensity > 0) {
      const time = frame / 30; // Convert frames to seconds (assuming 30fps)
      const freq = shakeFrequency;

      // Use multiple sine waves for more organic shake
      shakeX =
        shakeIntensity *
        (Math.sin(time * freq * 2 * Math.PI) * 0.5 +
          Math.sin(time * freq * 1.3 * 2 * Math.PI) * 0.3 +
          Math.sin(time * freq * 2.1 * 2 * Math.PI) * 0.2);

      shakeY =
        shakeIntensity *
        (Math.cos(time * freq * 2 * Math.PI) * 0.5 +
          Math.cos(time * freq * 1.7 * 2 * Math.PI) * 0.3 +
          Math.cos(time * freq * 0.9 * 2 * Math.PI) * 0.2);

      if (shakeRotation) {
        shakeRot =
          (shakeIntensity / 5) *
          (Math.sin(time * freq * 1.5 * 2 * Math.PI) * 0.6 +
            Math.sin(time * freq * 2.3 * 2 * Math.PI) * 0.4);
      }
    }

    // Build transform string
    const has3D = rotateX !== 0 || rotateY !== 0;
    const transformParts: string[] = [];

    if (has3D) {
      transformParts.push(`perspective(${perspective}px)`);
    }

    transformParts.push(
      `translate(${currentPanX + shakeX}px, ${currentPanY + shakeY}px)`,
    );
    transformParts.push(`scale(${currentZoom})`);
    transformParts.push(`rotate(${currentRotate + shakeRot}deg)`);

    if (rotateX !== 0) {
      transformParts.push(`rotateX(${rotateX}deg)`);
    }
    if (rotateY !== 0) {
      transformParts.push(`rotateY(${rotateY}deg)`);
    }

    const transform = transformParts.join(" ");

    const wrapperStyle: CSSProperties = {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      // CSS variables for external styling
      "--camera-zoom": currentZoom,
      "--camera-pan-x": `${currentPanX}px`,
      "--camera-pan-y": `${currentPanY}px`,
      "--camera-rotate": `${currentRotate}deg`,
      "--camera-shake-x": `${shakeX}px`,
      "--camera-shake-y": `${shakeY}px`,
      ...style,
    } as CSSProperties;

    const innerStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      transform,
      transformOrigin: origin,
      transformStyle: has3D ? "preserve-3d" : undefined,
      ...contentStyle,
    };

    return (
      <div ref={ref} className={className} style={wrapperStyle} {...restProps}>
        <div style={innerStyle}>{children}</div>
      </div>
    );
  },
);

Camera.displayName = "Camera";
