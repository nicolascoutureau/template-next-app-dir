import React, { Children, useMemo, isValidElement } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  Sequence3DProps,
  SceneProps,
  SceneData,
  AnimationWrapper,
} from "./types";
import { Scene } from "./Scene";

/**
 * Default exit animation - slides down
 */
const DefaultExit: AnimationWrapper = ({ children, progress }) => (
  <group position={[0, -progress * 14, 2]}>
    {children}
  </group>
);

/**
 * Default entry animation - subtle zoom in
 */
const DefaultEntry: AnimationWrapper = ({ children, progress }) => {
  const scale = 0.97 + progress * 0.03;
  return (
    <group scale={[scale, scale, 1]}>
      {children}
    </group>
  );
};

/**
 * Sequence3D - Orchestrates multiple scenes with entry/exit animations.
 * 
 * Scenes are wrapped in animation components during transitions, allowing
 * for any effects: transforms, blur, glow, shaders, etc.
 *
 * @example
 * ```tsx
 * // Custom animations
 * const BlurExit: AnimationWrapper = ({ children, progress }) => (
 *   <group position={[0, -progress * 10, 0]}>
 *     <EffectComposer>
 *       <Blur strength={progress * 5} />
 *     </EffectComposer>
 *     {children}
 *   </group>
 * );
 * 
 * <Sequence3D transitionDuration={25} defaultExit={BlurExit}>
 *   <Scene duration={100}>
 *     <Scene1Content />
 *   </Scene>
 *   <Scene duration={120} exit={CustomExit} enter={CustomEntry}>
 *     <Scene2Content />
 *   </Scene>
 * </Sequence3D>
 * ```
 */
export const Sequence3D: React.FC<Sequence3DProps> = ({
  children,
  transitionDuration = 25,
  defaultExit = DefaultExit,
  defaultEnter = DefaultEntry,
}) => {
  const frame = useCurrentFrame();

  // Parse children to extract scene data
  const scenes = useMemo<SceneData[]>(() => {
    const sceneList: SceneData[] = [];
    let currentFrame = 0;

    Children.forEach(children, (child, index) => {
      if (!isValidElement(child)) return;

      // Check if it's a Scene component
      const isSceneComponent =
        (child.type as any)?.displayName === "Scene" ||
        child.type === Scene;

      if (!isSceneComponent) {
        console.warn("Sequence3D: Only Scene components are allowed as children");
        return;
      }

      const props = child.props as SceneProps;
      const { duration, exit, enter, children: content } = props;

      sceneList.push({
        id: index,
        duration,
        startFrame: currentFrame,
        endFrame: currentFrame + duration,
        exit,
        enter,
        content,
      });

      currentFrame += duration;
    });

    return sceneList;
  }, [children]);

  // Determine what to render based on current frame
  const renderState = useMemo(() => {
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const nextScene = scenes[i + 1];

      // Check if we're in a transition period (exit of current, entry of next)
      if (nextScene) {
        const transitionStart = scene.endFrame - transitionDuration;
        const transitionEnd = scene.endFrame + transitionDuration;

        if (frame >= transitionStart && frame < transitionEnd) {
          const progress = interpolate(
            frame,
            [transitionStart, transitionEnd],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return {
            type: "transition" as const,
            exitScene: scene,
            enterScene: nextScene,
            progress,
          };
        }
      }

      // Check if we're in standalone scene period
      const sceneEnd = nextScene ? scene.endFrame - transitionDuration : scene.endFrame;

      if (frame >= scene.startFrame && frame < sceneEnd) {
        return {
          type: "scene" as const,
          scene,
        };
      }
    }

    return { type: "none" as const };
  }, [frame, scenes, transitionDuration]);

  // Render based on state
  if (renderState.type === "none") {
    return null;
  }

  if (renderState.type === "scene") {
    // Standalone scene - render directly
    return <>{renderState.scene.content}</>;
  }

  if (renderState.type === "transition") {
    const { exitScene, enterScene, progress } = renderState;
    
    // Get animation wrappers (use defaults if not specified)
    const ExitWrapper = exitScene.exit ?? defaultExit;
    const EnterWrapper = enterScene.enter ?? defaultEnter;

    return (
      <>
        {/* Enter scene (behind) - wrapped in entry animation */}
        <EnterWrapper progress={progress}>
          {enterScene.content}
        </EnterWrapper>

        {/* Exit scene (front) - wrapped in exit animation */}
        <ExitWrapper progress={progress}>
          {exitScene.content}
        </ExitWrapper>
      </>
    );
  }

  return null;
};
