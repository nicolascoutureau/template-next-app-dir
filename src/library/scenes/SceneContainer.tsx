import React from "react";
import { SceneAnimation, SceneAnimationConfig } from "./SceneAnimation";
import { SceneTransition, SceneTransitionConfig } from "./SceneTransition";

export interface SceneContainerProps {
  children: React.ReactNode;
  /** Current frame relative to scene start */
  localFrame: number;
  /** Total duration of the scene in frames */
  sceneDuration: number;
  /** Animation config (zoom, drift) */
  animationConfig?: SceneAnimationConfig;
  /** Transition config (fade in/out) */
  transitionConfig?: SceneTransitionConfig;
  /** Color of fade overlay (default: "#000000") */
  fadeColor?: string;
  /** Disable animation (zoom/drift) */
  disableAnimation?: boolean;
  /** Disable transition (fade in/out) */
  disableTransition?: boolean;
}

/**
 * Convenience component that combines SceneAnimation and SceneTransition.
 * Use this for the full cinematic effect, or use the individual components
 * for more control.
 *
 * @example
 * ```tsx
 * // Full effect (animation + transition)
 * <SceneContainer localFrame={localFrame} sceneDuration={120}>
 *   {content}
 * </SceneContainer>
 *
 * // Or compose them yourself for more control:
 * <SceneTransition localFrame={localFrame} sceneDuration={120}>
 *   <SceneAnimation localFrame={localFrame} sceneDuration={120}>
 *     {content}
 *   </SceneAnimation>
 * </SceneTransition>
 * ```
 */
export const SceneContainer: React.FC<SceneContainerProps> = ({
  children,
  localFrame,
  sceneDuration,
  animationConfig,
  transitionConfig,
  fadeColor = "#000000",
  disableAnimation = false,
  disableTransition = false,
}) => {
  // Build content with optional wrappers
  let content = <>{children}</>;

  // Wrap with animation if enabled
  if (!disableAnimation) {
    content = (
      <SceneAnimation
        localFrame={localFrame}
        sceneDuration={sceneDuration}
        config={animationConfig}
      >
        {content}
      </SceneAnimation>
    );
  }

  // Wrap with transition if enabled
  if (!disableTransition) {
    content = (
      <SceneTransition
        localFrame={localFrame}
        sceneDuration={sceneDuration}
        config={transitionConfig}
        fadeColor={fadeColor}
      >
        {content}
      </SceneTransition>
    );
  }

  return content;
};
