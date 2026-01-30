import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  type TransitionPresentation,
  type TransitionTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

// Re-export TransitionSeries and timing functions for direct use
export { TransitionSeries, linearTiming, springTiming };

/**
 * Transition types available.
 * Some use built-in @remotion/transitions presentations,
 * others use custom presentations.
 */
export type TransitionType =
  // Built-in presentations
  | "fade"
  | "wipe"
  | "slide"
  | "flip"
  | "clockWipe"
  // Slide directions
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  // Wipe directions
  | "wipeLeft"
  | "wipeRight"
  | "wipeUp"
  | "wipeDown"
  // Custom presentations
  | "crossDissolve"
  | "blurDissolve"
  | "zoomIn"
  | "zoomOut"
  | "circleWipe"
  | "pushLeft"
  | "pushRight"
  | "cube"
  | "doorway"
  | "swing"
  // Cinematic
  | "whipPan"
  | "flashWhite"
  | "flashBlack"
  | "glitch";

/**
 * Timing types for transitions.
 */
export type TimingType = "linear" | "spring" | "smooth" | "snappy" | "expo";

/**
 * Create a TransitionTiming based on type and duration.
 */
export function createTiming(
  type: TimingType,
  durationInFrames: number
): TransitionTiming {
  switch (type) {
    case "spring":
      return springTiming({ config: { damping: 200 } });
    case "smooth":
      return springTiming({ config: { damping: 20, stiffness: 80 } });
    case "snappy":
      return springTiming({ config: { damping: 30, stiffness: 300 } });
    case "expo":
      return springTiming({ config: { damping: 15, stiffness: 100 } });
    case "linear":
    default:
      return linearTiming({ durationInFrames });
  }
}

// ============================================================================
// CUSTOM PRESENTATIONS
// ============================================================================

// Custom presentation props type
type CustomProps = Record<string, never>;

// Component props interface
interface PresentationComponentProps {
  children: React.ReactNode;
  presentationDirection: "entering" | "exiting";
  presentationProgress: number;
  passedProps: CustomProps;
}

/**
 * Cross dissolve with smoother opacity curve.
 */
function crossDissolve(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      return (
        <AbsoluteFill
          style={{
            opacity: isEntering ? smoothProgress : 1 - smoothProgress,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Blur dissolve transition - content fades with blur.
 */
function blurDissolve(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      // Peak blur at middle of transition
      const blurAmount = Math.sin(progress * Math.PI) * 20;
      const opacity = isEntering ? smoothProgress : 1 - smoothProgress;
      
      return (
        <AbsoluteFill
          style={{
            opacity,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${1 + blurAmount * 0.002})`,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Zoom in transition.
 */
function zoomIn(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      if (isEntering) {
        const scale = 0.3 + smoothProgress * 0.7;
        const blur = (1 - smoothProgress) * 10;
        return (
          <AbsoluteFill
            style={{
              opacity: smoothProgress,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      return (
        <AbsoluteFill style={{ opacity: 1 - smoothProgress }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Zoom out transition.
 */
function zoomOut(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      if (isEntering) {
        const scale = 1.5 - smoothProgress * 0.5;
        const blur = (1 - smoothProgress) * 10;
        return (
          <AbsoluteFill
            style={{
              opacity: smoothProgress,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      return (
        <AbsoluteFill style={{ opacity: 1 - smoothProgress }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Circle wipe transition.
 */
function circleWipePresentation(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      if (isEntering) {
        const circleSize = progress * 150;
        return (
          <AbsoluteFill
            style={{
              clipPath: `circle(${circleSize}% at 50% 50%)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      return (
        <AbsoluteFill>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Push transition - pushes the previous scene while entering.
 */
function push(direction: "left" | "right"): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      const multiplier = direction === "left" ? 1 : -1;
      
      if (isEntering) {
        const translateX = (1 - smoothProgress) * 100 * multiplier;
        return (
          <AbsoluteFill
            style={{
              transform: `translateX(${translateX}%) scale(${0.95 + smoothProgress * 0.05})`,
              filter: `brightness(${0.7 + smoothProgress * 0.3})`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      const translateX = smoothProgress * -100 * multiplier;
      return (
        <AbsoluteFill
          style={{
            transform: `translateX(${translateX}%) scale(${1 - smoothProgress * 0.05})`,
            filter: `brightness(${1 - smoothProgress * 0.3})`,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * 3D Cube rotation transition.
 */
function cube(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      if (isEntering) {
        const rotateY = (1 - smoothProgress) * -90;
        return (
          <AbsoluteFill
            style={{
              transform: `perspective(1000px) rotateY(${rotateY}deg)`,
              transformOrigin: "right center",
              opacity: smoothProgress,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      const rotateY = smoothProgress * 90;
      return (
        <AbsoluteFill
          style={{
            transform: `perspective(1000px) rotateY(${rotateY}deg)`,
            transformOrigin: "left center",
            opacity: 1 - smoothProgress,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Doorway opening transition.
 */
function doorway(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      if (isEntering) {
        const rotateY = (1 - smoothProgress) * 90;
        return (
          <AbsoluteFill
            style={{
              transform: `perspective(800px) rotateY(${rotateY}deg)`,
              transformOrigin: "left center",
              opacity: smoothProgress,
              filter: `brightness(${0.5 + smoothProgress * 0.5})`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      return (
        <AbsoluteFill style={{ opacity: 1 - smoothProgress }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Swing down transition.
 */
function swing(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      if (isEntering) {
        const rotateX = (1 - smoothProgress) * 60;
        return (
          <AbsoluteFill
            style={{
              transform: `perspective(800px) rotateX(${rotateX}deg)`,
              transformOrigin: "top center",
              opacity: smoothProgress,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      return (
        <AbsoluteFill style={{ opacity: 1 - smoothProgress }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Whip pan cinematic transition.
 */
function whipPan(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      const blur = Math.sin(progress * Math.PI) * 60;
      
      if (isEntering) {
        const offset = (1 - progress) * -100;
        const opacity = progress < 0.1 ? progress * 10 : 1;
        return (
          <AbsoluteFill
            style={{
              transform: `translateX(${offset}%)`,
              filter: `blur(${blur}px)`,
              opacity,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      const offset = progress * 100;
      const opacity = progress > 0.9 ? (1 - progress) * 10 : 1;
      return (
        <AbsoluteFill
          style={{
            transform: `translateX(${offset}%)`,
            filter: `blur(${blur}px)`,
            opacity,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Flash to white transition.
 */
function flashWhite(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      // Flash intensity peaks at the middle
      const flashIntensity = progress < 0.3 
        ? progress / 0.3 
        : progress < 0.5 
          ? 1 
          : Math.max(0, 1 - (progress - 0.5) / 0.2);
      
      if (isEntering) {
        const opacity = progress > 0.3 ? (progress - 0.3) / 0.7 : 0;
        return (
          <>
            <AbsoluteFill style={{ opacity }}>
              {children}
            </AbsoluteFill>
            {flashIntensity > 0 && (
              <AbsoluteFill
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${flashIntensity})`,
                  pointerEvents: "none",
                }}
              />
            )}
          </>
        );
      }
      
      const opacity = progress < 0.3 ? 1 - progress / 0.3 : 0;
      return (
        <AbsoluteFill style={{ opacity }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Flash to black transition.
 */
function flashBlack(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      const flashIntensity = progress < 0.3 
        ? progress / 0.3 
        : progress < 0.5 
          ? 1 
          : Math.max(0, 1 - (progress - 0.5) / 0.2);
      
      if (isEntering) {
        const opacity = progress > 0.4 ? (progress - 0.4) / 0.6 : 0;
        return (
          <>
            <AbsoluteFill style={{ opacity }}>
              {children}
            </AbsoluteFill>
            {flashIntensity > 0 && (
              <AbsoluteFill
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${flashIntensity})`,
                  pointerEvents: "none",
                }}
              />
            )}
          </>
        );
      }
      
      const opacity = progress < 0.4 ? 1 - progress / 0.4 : 0;
      return (
        <AbsoluteFill style={{ opacity }}>
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

/**
 * Glitch effect transition.
 */
function glitchTransition(): TransitionPresentation<CustomProps> {
  return {
    component: ({ children, presentationDirection, presentationProgress }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      const glitchIntensity = Math.sin(progress * Math.PI);
      // Using progress as a pseudo-random seed for glitch effect
      const glitchOffset = Math.sin(progress * 50) * glitchIntensity * 20;
      const glitchSkew = Math.sin(progress * 70) * glitchIntensity * 5;
      const hueShift = Math.sin(progress * 30) * glitchIntensity * 30;
      
      if (isEntering) {
        const opacity = progress > 0.1 ? 1 : progress * 10;
        return (
          <AbsoluteFill
            style={{
              transform: `translateX(${glitchOffset}px) skewX(${glitchSkew}deg)`,
              opacity,
              filter: glitchIntensity > 0.3 ? `hue-rotate(${hueShift}deg)` : undefined,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }
      
      const opacity = progress < 0.9 ? 1 : (1 - progress) * 10;
      return (
        <AbsoluteFill
          style={{
            transform: `translateX(${-glitchOffset}px) skewX(${-glitchSkew}deg)`,
            opacity,
            filter: glitchIntensity > 0.3 ? `hue-rotate(${-hueShift}deg)` : undefined,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}

// ============================================================================
// PRESENTATION FACTORY
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPresentation = TransitionPresentation<any>;

/**
 * Get a TransitionPresentation based on transition type.
 */
export function getPresentation(type: TransitionType): AnyPresentation {
  switch (type) {
    // Built-in presentations
    case "fade":
      return fade();
    case "wipe":
    case "wipeRight":
      return wipe({ direction: "from-left" });
    case "wipeLeft":
      return wipe({ direction: "from-right" });
    case "wipeUp":
      return wipe({ direction: "from-bottom" });
    case "wipeDown":
      return wipe({ direction: "from-top" });
    case "slide":
    case "slideLeft":
      return slide({ direction: "from-right" });
    case "slideRight":
      return slide({ direction: "from-left" });
    case "slideUp":
      return slide({ direction: "from-bottom" });
    case "slideDown":
      return slide({ direction: "from-top" });
    case "flip":
      return flip();
    case "clockWipe":
      return clockWipe({ width: 1920, height: 1080 });
    
    // Custom presentations
    case "crossDissolve":
      return crossDissolve();
    case "blurDissolve":
      return blurDissolve();
    case "zoomIn":
      return zoomIn();
    case "zoomOut":
      return zoomOut();
    case "circleWipe":
      return circleWipePresentation();
    case "pushLeft":
      return push("left");
    case "pushRight":
      return push("right");
    case "cube":
      return cube();
    case "doorway":
      return doorway();
    case "swing":
      return swing();
    case "whipPan":
      return whipPan();
    case "flashWhite":
      return flashWhite();
    case "flashBlack":
      return flashBlack();
    case "glitch":
      return glitchTransition();
    
    default:
      return fade();
  }
}

// ============================================================================
// TRANSITION COMPONENT (Simplified wrapper)
// ============================================================================

export interface TransitionProps {
  /** The scenes to transition between */
  children: ReactNode[];
  /** Duration of each scene in frames */
  durationInFrames: number;
  /** Transition type to use between scenes */
  type?: TransitionType;
  /** Duration of the transition in frames */
  transitionDurationInFrames?: number;
  /** Timing type for the transition */
  timing?: TimingType;
  /** Additional styles for the container */
  style?: CSSProperties;
  /** CSS class name */
  className?: string;
}

/**
 * Simplified Transition component that wraps TransitionSeries.
 * Pass an array of children as scenes to transition between.
 * 
 * @example
 * ```tsx
 * <Transition
 *   durationInFrames={60}
 *   type="fade"
 *   transitionDurationInFrames={30}
 * >
 *   <SceneA />
 *   <SceneB />
 *   <SceneC />
 * </Transition>
 * ```
 */
export const Transition: React.FC<TransitionProps> = ({
  children,
  durationInFrames,
  type = "fade",
  transitionDurationInFrames = 30,
  timing = "linear",
  style,
  className,
}) => {
  const scenes = React.Children.toArray(children);
  const presentation = useMemo(() => getPresentation(type), [type]);
  const transitionTiming = useMemo(
    () => createTiming(timing, transitionDurationInFrames),
    [timing, transitionDurationInFrames]
  );
  
  if (scenes.length === 0) {
    return null;
  }
  
  if (scenes.length === 1) {
    return (
      <AbsoluteFill style={style} className={className}>
        {scenes[0]}
      </AbsoluteFill>
    );
  }
  
  return (
    <TransitionSeries style={style} className={className}>
      {scenes.map((scene, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={durationInFrames}>
            {scene}
          </TransitionSeries.Sequence>
          {index < scenes.length - 1 && (
            <TransitionSeries.Transition
              presentation={presentation}
              timing={transitionTiming}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

// ============================================================================
// SCENE TRANSITION HELPER
// ============================================================================

export interface SceneProps {
  /** Content of the scene */
  children: ReactNode;
  /** Duration of this scene in frames */
  durationInFrames: number;
}

/**
 * Scene component for use within TransitionSeries.
 * This is an alias for TransitionSeries.Sequence with a cleaner name.
 */
export const Scene: React.FC<SceneProps> = ({ children, durationInFrames }) => {
  return (
    <TransitionSeries.Sequence durationInFrames={durationInFrames}>
      {children}
    </TransitionSeries.Sequence>
  );
};

// ============================================================================
// UTILITY TYPES AND EXPORTS
// ============================================================================

/**
 * All available transition types.
 */
export const TRANSITION_TYPES: TransitionType[] = [
  "fade",
  "wipe",
  "slide",
  "flip",
  "clockWipe",
  "slideLeft",
  "slideRight",
  "slideUp",
  "slideDown",
  "wipeLeft",
  "wipeRight",
  "wipeUp",
  "wipeDown",
  "crossDissolve",
  "blurDissolve",
  "zoomIn",
  "zoomOut",
  "circleWipe",
  "pushLeft",
  "pushRight",
  "cube",
  "doorway",
  "swing",
  "whipPan",
  "flashWhite",
  "flashBlack",
  "glitch",
];

/**
 * All available timing types.
 */
export const TIMING_TYPES: TimingType[] = [
  "linear",
  "spring",
  "smooth",
  "snappy",
  "expo",
];

export default Transition;
