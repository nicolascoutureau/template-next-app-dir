import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from "remotion";

/**
 * Professional transition types - cinematic quality.
 */
export type TransitionType =
  // Simple
  | "none"
  | "cut"
  // Dissolves
  | "crossDissolve"
  | "additiveDissolve"
  | "luminanceDissolve"
  // Blur-based
  | "blurDissolve"
  | "directionalBlur"
  | "zoomBlur"
  | "spinBlur"
  // Movement
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "pushLeft"
  | "pushRight"
  // Zoom
  | "zoomIn"
  | "zoomOut"
  | "zoomThrough"
  // Reveals
  | "circleWipe"
  | "rectWipe"
  | "clockWipe"
  | "starWipe"
  | "hexWipe"
  | "diagonalWipe"
  | "splitHorizontal"
  | "splitVertical"
  // 3D
  | "cube"
  | "flip"
  | "doorway"
  | "swing"
  // Cinematic
  | "whipPan"
  | "lightLeak"
  | "filmBurn"
  | "flashWhite"
  | "flashBlack"
  | "glitch"
  | "rgbSplit";

/**
 * Props for Transition component.
 */
export interface TransitionProps {
  children: ReactNode;
  /** Transition type */
  type?: TransitionType;
  /** Duration in seconds */
  duration?: number;
  /** Delay before starting */
  delay?: number;
  /** Whether this is an exit transition */
  exit?: boolean;
  /** Custom easing */
  ease?: "smooth" | "snappy" | "expo" | "circ" | "linear";
  /** Additional styles */
  style?: CSSProperties;
  className?: string;
}

/**
 * Professional easing curves.
 */
function getEasing(ease: string): (t: number) => number {
  switch (ease) {
    case "smooth":
      return Easing.bezier(0.25, 0.1, 0.25, 1); // Apple-style
    case "snappy":
      return Easing.bezier(0.16, 1, 0.3, 1); // Quick settle
    case "expo":
      return Easing.bezier(0.16, 1, 0.3, 1); // Exponential
    case "circ":
      return Easing.bezier(0.075, 0.82, 0.165, 1); // Circular
    case "linear":
      return (t) => t;
    default:
      return Easing.bezier(0.25, 0.1, 0.25, 1);
  }
}

/**
 * Advanced interpolation with custom curves.
 */
function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

function smootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Generate professional transition styles.
 */
function getTransitionStyles(
  type: TransitionType,
  progress: number,
  exit: boolean,
  fps: number,
  frame: number
): { content: CSSProperties; overlay?: CSSProperties } {
  const p = exit ? 1 - progress : progress;
  const rp = 1 - p;
  const sp = smoothStep(p); // Smoother curve
  const srp = 1 - sp;

  switch (type) {
    case "none":
    case "cut":
      return { content: { opacity: p > 0.5 ? 1 : 0 } };

    // === DISSOLVES ===
    case "crossDissolve":
      return {
        content: {
          opacity: smootherStep(p),
        },
      };

    case "additiveDissolve":
      return {
        content: {
          opacity: p,
          mixBlendMode: p < 0.5 ? "screen" : "normal",
          filter: p < 0.5 ? `brightness(${1 + (0.5 - p) * 0.5})` : undefined,
        },
      };

    case "luminanceDissolve":
      // Bright areas appear first
      const lumThreshold = rp * 100;
      return {
        content: {
          opacity: 1,
          filter: `contrast(${1 + rp * 2}) brightness(${0.8 + p * 0.4})`,
          clipPath: p < 1 ? `inset(0)` : undefined,
          maskImage: `linear-gradient(to bottom, black ${lumThreshold}%, transparent ${lumThreshold + 20}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${lumThreshold}%, transparent ${lumThreshold + 20}%)`,
        },
      };

    // === BLUR-BASED ===
    case "blurDissolve":
      const blurAmount = Math.sin(p * Math.PI) * 25; // Peak blur at middle
      return {
        content: {
          opacity: smootherStep(p),
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${1 + blurAmount * 0.002})`, // Slight scale to hide edges
        },
      };

    case "directionalBlur":
      // Simulated motion blur with multiple layers would need actual shader
      // This is a CSS approximation
      const dirBlur = srp * 30;
      return {
        content: {
          opacity: sp,
          filter: `blur(${dirBlur}px)`,
          transform: `translateX(${srp * 50}px) scale(${1 + srp * 0.05})`,
        },
      };

    case "zoomBlur":
      const zBlur = srp * 20;
      const zScale = 1 + srp * 0.3;
      return {
        content: {
          opacity: sp,
          filter: `blur(${zBlur}px)`,
          transform: `scale(${zScale})`,
        },
      };

    case "spinBlur":
      const spinBlur = srp * 15;
      const spinAngle = srp * 5;
      return {
        content: {
          opacity: sp,
          filter: `blur(${spinBlur}px)`,
          transform: `rotate(${spinAngle}deg) scale(${1 + srp * 0.1})`,
        },
      };

    // === MOVEMENT ===
    case "slideLeft":
      return {
        content: {
          transform: `translateX(${srp * 100}%)`,
          opacity: 1,
        },
      };

    case "slideRight":
      return {
        content: {
          transform: `translateX(${-srp * 100}%)`,
          opacity: 1,
        },
      };

    case "slideUp":
      return {
        content: {
          transform: `translateY(${srp * 100}%)`,
          opacity: 1,
        },
      };

    case "slideDown":
      return {
        content: {
          transform: `translateY(${-srp * 100}%)`,
          opacity: 1,
        },
      };

    case "pushLeft":
      return {
        content: {
          transform: `translateX(${srp * 100}%) scale(${0.95 + sp * 0.05})`,
          filter: `brightness(${0.7 + sp * 0.3})`,
        },
      };

    case "pushRight":
      return {
        content: {
          transform: `translateX(${-srp * 100}%) scale(${0.95 + sp * 0.05})`,
          filter: `brightness(${0.7 + sp * 0.3})`,
        },
      };

    // === ZOOM ===
    case "zoomIn":
      return {
        content: {
          transform: `scale(${0.3 + sp * 0.7})`,
          opacity: sp,
          filter: `blur(${srp * 10}px)`,
        },
      };

    case "zoomOut":
      return {
        content: {
          transform: `scale(${1 + srp * 0.5})`,
          opacity: sp,
          filter: `blur(${srp * 10}px)`,
        },
      };

    case "zoomThrough":
      // Zoom past camera effect
      const ztScale = p < 0.5 ? 1 + p * 2 : 3 - p * 2;
      const ztOpacity = p < 0.4 ? p / 0.4 : p > 0.6 ? 1 : 1;
      const ztBlur = Math.abs(p - 0.5) < 0.2 ? (0.2 - Math.abs(p - 0.5)) * 50 : 0;
      return {
        content: {
          transform: `scale(${ztScale})`,
          opacity: ztOpacity,
          filter: `blur(${ztBlur}px)`,
        },
      };

    // === REVEALS ===
    case "circleWipe":
      const circleSize = sp * 150;
      return {
        content: {
          clipPath: `circle(${circleSize}% at 50% 50%)`,
        },
      };

    case "rectWipe":
      const rectInset = srp * 50;
      return {
        content: {
          clipPath: `inset(${rectInset}% ${rectInset}% ${rectInset}% ${rectInset}%)`,
        },
      };

    case "clockWipe":
      const angle = sp * 360;
      // Create a conic gradient mask effect
      return {
        content: {
          clipPath: `polygon(50% 50%, 50% 0%, ${angle > 90 ? '100% 0%, 100% 100%' : `${50 + Math.tan((angle * Math.PI) / 180) * 50}% 0%`}${angle > 180 ? ', 0% 100%' : ''}${angle > 270 ? ', 0% 0%' : ''}, 50% 50%)`,
          opacity: 1,
        },
      };

    case "starWipe":
      const starSize = sp * 200;
      const points = 5;
      const starPath = Array.from({ length: points * 2 }, (_, i) => {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const r = i % 2 === 0 ? starSize : starSize * 0.4;
        return `${50 + r * Math.cos(angle)}% ${50 + r * Math.sin(angle)}%`;
      }).join(", ");
      return {
        content: {
          clipPath: `polygon(${starPath})`,
        },
      };

    case "hexWipe":
      const hexSize = sp * 130;
      const hexPoints = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        return `${50 + hexSize * Math.cos(angle)}% ${50 + hexSize * Math.sin(angle)}%`;
      }).join(", ");
      return {
        content: {
          clipPath: `polygon(${hexPoints})`,
        },
      };

    case "diagonalWipe":
      const diagOffset = sp * 200;
      return {
        content: {
          clipPath: `polygon(${diagOffset - 100}% 0%, ${diagOffset}% 0%, ${diagOffset - 100}% 100%, ${diagOffset - 200}% 100%)`,
        },
      };

    case "splitHorizontal":
      const splitH = srp * 50;
      return {
        content: {
          clipPath: `polygon(0% ${splitH}%, 100% ${splitH}%, 100% ${100 - splitH}%, 0% ${100 - splitH}%)`,
        },
      };

    case "splitVertical":
      const splitV = srp * 50;
      return {
        content: {
          clipPath: `polygon(${splitV}% 0%, ${100 - splitV}% 0%, ${100 - splitV}% 100%, ${splitV}% 100%)`,
        },
      };

    // === 3D ===
    case "cube":
      const cubeRotate = srp * 90;
      const cubeTranslate = srp * 50;
      return {
        content: {
          transform: `perspective(1000px) rotateY(${cubeRotate}deg) translateZ(${cubeTranslate}px)`,
          opacity: sp,
          transformOrigin: "left center",
        },
      };

    case "flip":
      return {
        content: {
          transform: `perspective(1000px) rotateY(${srp * 180}deg)`,
          opacity: p > 0.5 ? 1 : 0,
          backfaceVisibility: "hidden",
        },
      };

    case "doorway":
      const doorAngle = srp * 90;
      return {
        content: {
          transform: `perspective(800px) rotateY(${doorAngle}deg)`,
          transformOrigin: "left center",
          opacity: sp,
          filter: `brightness(${0.5 + sp * 0.5})`,
        },
      };

    case "swing":
      const swingAngle = srp * 60;
      return {
        content: {
          transform: `perspective(800px) rotateX(${swingAngle}deg)`,
          transformOrigin: "top center",
          opacity: sp,
        },
      };

    // === CINEMATIC ===
    case "whipPan":
      const whipBlur = Math.sin(p * Math.PI) * 60;
      const whipOffset = (p < 0.5 ? p * 2 : 2 - p * 2) * 100 - 50;
      return {
        content: {
          transform: `translateX(${whipOffset}%)`,
          filter: `blur(${whipBlur}px)`,
          opacity: p < 0.1 || p > 0.9 ? (p < 0.1 ? p * 10 : (1 - p) * 10) : 1,
        },
      };

    case "lightLeak":
      const leakBrightness = 1 + Math.sin(p * Math.PI) * 1.5;
      const leakSaturation = 1 + Math.sin(p * Math.PI) * 0.5;
      return {
        content: {
          opacity: smootherStep(p),
          filter: `brightness(${leakBrightness}) saturate(${leakSaturation}) contrast(${1 + srp * 0.2})`,
        },
        overlay: {
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${30 + p * 40}% ${20 + p * 30}%, rgba(255,200,100,${Math.sin(p * Math.PI) * 0.4}) 0%, transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        },
      };

    case "filmBurn":
      const burnIntensity = Math.sin(p * Math.PI);
      return {
        content: {
          opacity: smootherStep(p),
          filter: `brightness(${1 + burnIntensity * 0.8}) contrast(${1 + burnIntensity * 0.3}) saturate(${1 + burnIntensity * 0.5})`,
        },
        overlay: {
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.1) * 20}% ${50 + Math.cos(frame * 0.1) * 20}%, rgba(255,150,50,${burnIntensity * 0.3}) 0%, rgba(255,100,0,${burnIntensity * 0.1}) 50%, transparent 80%)`,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        },
      };

    case "flashWhite":
      const flashW = p < 0.15 ? p / 0.15 : p < 0.3 ? 1 : 1 - (p - 0.3) / 0.2;
      return {
        content: {
          opacity: p > 0.3 ? smoothStep((p - 0.3) / 0.7) : 0,
        },
        overlay: p < 0.5
          ? {
              position: "absolute",
              inset: 0,
              backgroundColor: `rgba(255,255,255,${Math.max(0, flashW)})`,
              pointerEvents: "none",
            }
          : undefined,
      };

    case "flashBlack":
      const flashB = p < 0.2 ? p / 0.2 : p < 0.4 ? 1 : 1 - (p - 0.4) / 0.2;
      return {
        content: {
          opacity: p > 0.4 ? smoothStep((p - 0.4) / 0.6) : 0,
        },
        overlay: p < 0.6
          ? {
              position: "absolute",
              inset: 0,
              backgroundColor: `rgba(0,0,0,${Math.max(0, flashB)})`,
              pointerEvents: "none",
            }
          : undefined,
      };

    case "glitch":
      const glitchIntensity = Math.sin(p * Math.PI);
      const glitchOffset = Math.sin(frame * 2) * glitchIntensity * 20;
      const glitchSkew = Math.sin(frame * 3) * glitchIntensity * 5;
      return {
        content: {
          transform: `translateX(${glitchOffset}px) skewX(${glitchSkew}deg)`,
          opacity: p > 0.1 ? 1 : p * 10,
          filter: glitchIntensity > 0.3 ? `hue-rotate(${Math.sin(frame) * glitchIntensity * 30}deg)` : undefined,
        },
      };

    case "rgbSplit":
      const splitAmount = Math.sin(p * Math.PI) * 10;
      return {
        content: {
          opacity: smootherStep(p),
          filter: splitAmount > 1
            ? `drop-shadow(${splitAmount}px 0 0 rgba(255,0,0,0.5)) drop-shadow(${-splitAmount}px 0 0 rgba(0,255,255,0.5))`
            : undefined,
        },
      };

    default:
      return { content: { opacity: smootherStep(p) } };
  }
}

/**
 * Professional cinematic transition component.
 */
export const Transition: React.FC<TransitionProps> = ({
  children,
  type = "crossDissolve",
  duration = 0.6,
  delay = 0,
  exit = false,
  ease = "smooth",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const durationFrames = Math.round(duration * fps);
  const easing = getEasing(ease);

  const progress = useMemo(() => {
    const effectiveFrame = frame - delayFrames;
    if (effectiveFrame <= 0) return 0;
    if (effectiveFrame >= durationFrames) return 1;

    return interpolate(effectiveFrame, [0, durationFrames], [0, 1], {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }, [frame, delayFrames, durationFrames, easing]);

  const { content: contentStyles, overlay: overlayStyles } = useMemo(
    () => getTransitionStyles(type, progress, exit, fps, frame),
    [type, progress, exit, fps, frame]
  );

  // Don't render if not started (enter) or fully exited
  if (progress === 0 && !exit) return null;
  if (progress === 1 && exit) return null;

  return (
    <>
      <AbsoluteFill
        className={className}
        style={{
          ...style,
          ...contentStyles,
          willChange: "transform, opacity, filter, clip-path",
        }}
      >
        {children}
      </AbsoluteFill>
      {overlayStyles && <div style={overlayStyles as CSSProperties} />}
    </>
  );
};

export default Transition;
