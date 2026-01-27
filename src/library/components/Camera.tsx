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
 * Note: "none" is preferred over "linear" for intentional linear interpolation.
 */
export type EasingPreset =
  | "none"
  | "linear" // alias for "none", kept for compatibility
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "spring"
  | "bounce";

/**
 * A single keyframe in a camera path.
 */
export type CameraKeyframe = {
  /** Frame number for this keyframe. */
  frame: number;
  /** Zoom level at this keyframe (1 = 100%). */
  zoom?: number;
  /** Horizontal pan at this keyframe. */
  panX?: number;
  /** Vertical pan at this keyframe. */
  panY?: number;
  /** Rotation angle at this keyframe (degrees). */
  rotate?: number;
  /** Easing to use when transitioning TO this keyframe. */
  easing?: EasingPreset | EasingFunction;
};

/**
 * Base props shared between keyframe and legacy modes.
 */
type CameraBaseProps = {
  /** Content to apply camera effects to. */
  children: ReactNode;

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

/**
 * Props for keyframe-based camera animation (recommended for multi-step moves).
 */
type CameraKeyframeProps = CameraBaseProps & {
  /** Array of keyframes defining the camera path. */
  keyframes: CameraKeyframe[];
  /** Default easing between keyframes (can be overridden per-keyframe). */
  easing?: EasingPreset | EasingFunction;
  // Explicitly disallow legacy props when using keyframes
  zoom?: never;
  panX?: never;
  panY?: never;
  rotate?: never;
  zoomTo?: never;
  panXTo?: never;
  panYTo?: never;
  rotateTo?: never;
  animationStartFrame?: never;
  animationDuration?: never;
};

/**
 * Props for legacy single-segment animation (backward compatible).
 */
type CameraLegacyProps = CameraBaseProps & {
  // Transform controls
  /** Zoom level (1 = 100%, 2 = 200%, 0.5 = 50%). */
  zoom?: number;
  /** Horizontal pan in pixels (positive = right). */
  panX?: number;
  /** Vertical pan in pixels (positive = down). */
  panY?: number;
  /** Rotation angle in degrees. */
  rotate?: number;

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
  // Disallow keyframes in legacy mode
  keyframes?: never;
};

/**
 * Props for `Camera`.
 */
export type CameraProps = CameraKeyframeProps | CameraLegacyProps;

export type CameraRef = ComponentPropsWithRef<"div">["ref"];

const easingPresets: Record<EasingPreset, EasingFunction> = {
  none: (t) => t,
  linear: (t) => t, // alias for "none"
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
 * Interpolates between two keyframes based on current frame.
 */
function interpolateKeyframes(
  frame: number,
  keyframes: CameraKeyframe[],
  defaultEasing: EasingPreset | EasingFunction
): { zoom: number; panX: number; panY: number; rotate: number } {
  // Sort keyframes by frame number
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  
  // Find current segment
  let prevKeyframe = sorted[0];
  let nextKeyframe = sorted[0];
  
  for (let i = 0; i < sorted.length; i++) {
    if (frame >= sorted[i].frame) {
      prevKeyframe = sorted[i];
      nextKeyframe = sorted[i + 1] ?? sorted[i];
    }
  }

  // If before first keyframe, use first keyframe values
  if (frame < sorted[0].frame) {
    return {
      zoom: sorted[0].zoom ?? 1,
      panX: sorted[0].panX ?? 0,
      panY: sorted[0].panY ?? 0,
      rotate: sorted[0].rotate ?? 0,
    };
  }

  // If at or past last keyframe, use last keyframe values
  if (prevKeyframe === nextKeyframe || frame >= nextKeyframe.frame) {
    return {
      zoom: prevKeyframe.zoom ?? 1,
      panX: prevKeyframe.panX ?? 0,
      panY: prevKeyframe.panY ?? 0,
      rotate: prevKeyframe.rotate ?? 0,
    };
  }

  // Interpolate between keyframes
  const segmentDuration = nextKeyframe.frame - prevKeyframe.frame;
  const rawProgress = (frame - prevKeyframe.frame) / segmentDuration;
  
  // Use the next keyframe's easing (easing INTO the keyframe)
  const easing = nextKeyframe.easing ?? defaultEasing;
  const easingFn = typeof easing === "function" ? easing : easingPresets[easing];
  const progress = easingFn(rawProgress);

  // Get values with proper defaults (carry forward previous values)
  const prevZoom = prevKeyframe.zoom ?? 1;
  const prevPanX = prevKeyframe.panX ?? 0;
  const prevPanY = prevKeyframe.panY ?? 0;
  const prevRotate = prevKeyframe.rotate ?? 0;

  const nextZoom = nextKeyframe.zoom ?? prevZoom;
  const nextPanX = nextKeyframe.panX ?? prevPanX;
  const nextPanY = nextKeyframe.panY ?? prevPanY;
  const nextRotate = nextKeyframe.rotate ?? prevRotate;

  return {
    zoom: prevZoom + (nextZoom - prevZoom) * progress,
    panX: prevPanX + (nextPanX - prevPanX) * progress,
    panY: prevPanY + (nextPanY - prevPanY) * progress,
    rotate: prevRotate + (nextRotate - prevRotate) * progress,
  };
}

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
 * // Animated zoom (legacy single-segment)
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
 * // Keyframe-based camera path (recommended for multi-step moves)
 * <Camera
 *   keyframes={[
 *     { frame: 0, zoom: 1, panX: 0, panY: 0 },
 *     { frame: 30, zoom: 1.5, panX: -100 },
 *     { frame: 60, zoom: 1.5, panY: -50 },    // hold zoom, pan down
 *     { frame: 90, zoom: 1, panX: 0, panY: 0 }, // pull back out
 *   ]}
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
  (props, ref) => {
    const {
      children,
      rotateX = 0,
      rotateY = 0,
      shakeIntensity = 0,
      shakeFrequency = 10,
      shakeRotation = false,
      perspective = 1000,
      origin = "center",
      className,
      style,
      contentStyle,
      frame: frameProp,
      ...restProps
    } = props;

    const frameFromHook = useCurrentFrame();
    const frame = frameProp ?? frameFromHook;

    // Determine if using keyframe mode or legacy mode
    const isKeyframeMode = "keyframes" in props && props.keyframes !== undefined;

    let currentZoom: number;
    let currentPanX: number;
    let currentPanY: number;
    let currentRotate: number;

    if (isKeyframeMode) {
      // Keyframe mode
      const keyframeProps = props as CameraKeyframeProps;
      const defaultEasing = keyframeProps.easing ?? "easeOut";
      const interpolated = interpolateKeyframes(frame, keyframeProps.keyframes, defaultEasing);
      currentZoom = interpolated.zoom;
      currentPanX = interpolated.panX;
      currentPanY = interpolated.panY;
      currentRotate = interpolated.rotate;
    } else {
      // Legacy mode
      const legacyProps = props as CameraLegacyProps;
      const zoom = legacyProps.zoom ?? 1;
      const panX = legacyProps.panX ?? 0;
      const panY = legacyProps.panY ?? 0;
      const rotate = legacyProps.rotate ?? 0;
      const zoomTo = legacyProps.zoomTo;
      const panXTo = legacyProps.panXTo;
      const panYTo = legacyProps.panYTo;
      const rotateTo = legacyProps.rotateTo;
      const animationStartFrame = legacyProps.animationStartFrame ?? 0;
      const animationDuration = legacyProps.animationDuration ?? 30;
      const easing = legacyProps.easing ?? "easeOut";

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
      currentZoom =
        zoomTo !== undefined ? zoom + (zoomTo - zoom) * progress : zoom;
      currentPanX =
        panXTo !== undefined ? panX + (panXTo - panX) * progress : panX;
      currentPanY =
        panYTo !== undefined ? panY + (panYTo - panY) * progress : panY;
      currentRotate =
        rotateTo !== undefined ? rotate + (rotateTo - rotate) * progress : rotate;
    }

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
