import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { SceneTransitionRenderer } from "./SceneTransitionRenderer";
import type { TransitionSpec, SceneSpec, Segment } from "./types";

export interface SceneStackProps {
  /** Array of scenes to render sequentially */
  scenes: SceneSpec[];
  /** 
   * Array of transitions between scenes.
   * Length should be scenes.length - 1.
   * transitions[i] is the transition from scenes[i] to scenes[i+1]
   */
  transitions?: TransitionSpec[];
  /** Default transition used when transitions array is shorter than scenes.length - 1 */
  defaultTransition?: TransitionSpec;
}

/**
 * SceneStack - LLM-friendly scene orchestrator with GPU-based transitions.
 * 
 * The LLM only needs to provide two arrays:
 * - scenes: list of scene definitions with id, duration, and element
 * - transitions: list of transition specs (fade/wipe/dissolve)
 * 
 * All FBO, portal, layer, and frame math complexity is hidden.
 * 
 * @example
 * ```tsx
 * <ThreeCanvas width={width} height={height} camera={{fov: 50, position: [0, 0, 6]}}>
 *   <SceneStack
 *     scenes={[
 *       {id: "intro", durationInFrames: 120, element: <IntroScene />},
 *       {id: "product", durationInFrames: 180, element: <ProductScene />},
 *       {id: "outro", durationInFrames: 120, element: <OutroScene />},
 *     ]}
 *     transitions={[
 *       {type: "dissolve", durationInFrames: 20, seed: 4, softness: 0.08},
 *       {type: "wipe", durationInFrames: 25, direction: "left"},
 *     ]}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const SceneStack: React.FC<SceneStackProps> = ({
  scenes,
  transitions = [],
  defaultTransition = { type: "fade", durationInFrames: 15 },
}) => {
  const frame = useCurrentFrame();

  // Build timeline segments (scenes and transitions)
  const segments = useMemo<Segment[]>(() => {
    if (scenes.length === 0) return [];

    const segs: Segment[] = [];
    let t = 0;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const sceneStart = t;
      const sceneEnd = t + Math.max(1, scene.durationInFrames);

      // Add scene segment
      segs.push({
        kind: "scene",
        start: sceneStart,
        end: sceneEnd,
        sceneIndex: i,
      });
      t = sceneEnd;

      // Add transition segment if not the last scene
      if (i < scenes.length - 1) {
        // Use provided transition or default
        const tr = transitions[i] ?? defaultTransition;
        const trDur = Math.max(1, tr.durationInFrames);
        
        segs.push({
          kind: "transition",
          start: t,
          end: t + trDur,
          from: i,
          to: i + 1,
          spec: tr,
        });
        t += trDur;
      }
    }

    return segs;
  }, [scenes, transitions, defaultTransition]);

  // Find active segment for current frame
  const active = useMemo(() => {
    if (segments.length === 0) return null;
    
    // Clamp frame to timeline bounds
    const clampedFrame = Math.max(0, Math.min(frame, segments[segments.length - 1].end - 1));
    
    // Find segment containing current frame
    return segments.find((s) => clampedFrame >= s.start && clampedFrame < s.end) ?? segments[segments.length - 1];
  }, [frame, segments]);

  if (!active) return null;

  // Render single scene (no transition) - just render directly
  if (active.kind === "scene") {
    return <>{scenes[active.sceneIndex]?.element ?? null}</>;
  }

  // Render transition between two scenes using FBO blending
  const fromElement = scenes[active.from]?.element ?? null;
  const toElement = scenes[active.to]?.element ?? null;
  const progress = (frame - active.start) / (active.end - active.start);

  return (
    <SceneTransitionRenderer
      from={fromElement}
      to={toElement}
      progress={Math.min(1, Math.max(0, progress))}
      mode={active.spec}
    />
  );
};

SceneStack.displayName = "SceneStack";
