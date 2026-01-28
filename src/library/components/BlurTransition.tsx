import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Blur transition type.
 */
export type BlurType = "focus" | "defocus" | "rack" | "motion";

/**
 * Props for the `BlurTransition` component.
 */
export type BlurTransitionProps = {
  /** Content to apply blur transition to. */
  children: ReactNode;
  /** Type of blur effect. */
  type?: BlurType;
  /** Frame at which transition starts. */
  startFrame?: number;
  /** Duration of the transition in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Maximum blur amount in pixels. */
  maxBlur?: number;
  /** Whether to fade opacity alongside blur. */
  fade?: boolean;
  /** Whether to scale slightly during blur (simulates depth). */
  breathe?: boolean;
  /** Direction for motion blur: angle in degrees. */
  motionAngle?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * `BlurTransition` creates cinematic blur effects.
 * Simulates camera focus pulls, depth of field, and motion blur.
 *
 * @example
 * ```tsx
 * // Focus in (blur to sharp)
 * <BlurTransition type="focus" durationInFrames={30}>
 *   <Content />
 * </BlurTransition>
 *
 * // Defocus out (sharp to blur)
 * <BlurTransition type="defocus" startFrame={60}>
 *   <Content />
 * </BlurTransition>
 *
 * // Rack focus (blur → sharp → blur)
 * <BlurTransition type="rack" durationInFrames={60}>
 *   <Content />
 * </BlurTransition>
 *
 * // With depth breathing effect
 * <BlurTransition type="focus" breathe maxBlur={20}>
 *   <Content />
 * </BlurTransition>
 * ```
 */
export const BlurTransition = ({
  children,
  type = "focus",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  maxBlur = 15,
  fade = true,
  breathe = false,
  motionAngle = 0,
  className,
  style,
}: BlurTransitionProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);

  // Calculate blur based on type
  let blur: number;
  let opacity: number = 1;
  let scale: number = 1;

  switch (type) {
    case "focus":
      // Blur to sharp
      blur = maxBlur * (1 - easedProgress);
      opacity = fade ? 0.3 + 0.7 * easedProgress : 1;
      scale = breathe ? 1.05 - 0.05 * easedProgress : 1;
      break;
    case "defocus":
      // Sharp to blur
      blur = maxBlur * easedProgress;
      opacity = fade ? 1 - 0.7 * easedProgress : 1;
      scale = breathe ? 1 + 0.05 * easedProgress : 1;
      break;
    case "rack":
      // Blur → Sharp → Blur (rack focus)
      const rackProgress = easedProgress < 0.5
        ? easedProgress * 2
        : 2 - easedProgress * 2;
      blur = maxBlur * (1 - rackProgress);
      opacity = fade ? 0.5 + 0.5 * rackProgress : 1;
      scale = breathe ? 1.03 - 0.03 * rackProgress : 1;
      break;
    case "motion":
      // Directional motion blur simulation
      blur = maxBlur * (1 - easedProgress);
      opacity = fade ? 0.5 + 0.5 * easedProgress : 1;
      scale = 1;
      break;
    default:
      blur = 0;
  }

  // For motion blur, we use multiple layers with offset
  if (type === "motion" && blur > 0) {
    const layers = 5;
    const angleRad = (motionAngle * Math.PI) / 180;
    
    return (
      <div className={className} style={{ position: "relative", ...style }}>
        {Array.from({ length: layers }).map((_, i) => {
          const layerProgress = i / (layers - 1);
          const offset = (layerProgress - 0.5) * blur * 2;
          const x = Math.cos(angleRad) * offset;
          const y = Math.sin(angleRad) * offset;
          const layerOpacity = (1 - Math.abs(layerProgress - 0.5) * 1.5) * (opacity / layers);
          
          return (
            <div
              key={i}
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                transform: `translate(${x}px, ${y}px)`,
                opacity: i === Math.floor(layers / 2) ? opacity : layerOpacity,
                filter: `blur(${blur * 0.3}px)`,
              }}
            >
              {children}
            </div>
          );
        })}
      </div>
    );
  }

  const blurStyle: CSSProperties = {
    filter: `blur(${blur}px)`,
    opacity,
    transform: `scale(${scale})`,
    ...style,
  };

  return (
    <div className={className} style={blurStyle}>
      {children}
    </div>
  );
};
