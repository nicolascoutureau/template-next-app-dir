"use client";

import React, { useMemo, useEffect } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill } from "remotion";

// Store for passing children to composition (workaround for serialization)
// This MUST be module-level to persist across renders
const childrenStore = new Map<string, React.ReactNode>();
let idCounter = 0;

interface CompositionProps {
  storeId: string;
  [key: string]: unknown;
}

/**
 * The actual composition component that runs inside the Remotion Player.
 */
const SimpleComposition: React.FC<CompositionProps> = ({ storeId }) => {
  const children = childrenStore.get(storeId);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f23" }}>
      {children}
    </AbsoluteFill>
  );
};

export interface RemotionPreviewProps {
  children: React.ReactNode;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

/**
 * RemotionPreview - A wrapper for previewing Remotion compositions in Storybook.
 * Based on StorybookCanvas pattern but without ThreeCanvas wrapper.
 */
export const RemotionPreview: React.FC<RemotionPreviewProps> = ({
  children,
  fps = 30,
  durationInFrames = 90,
  width = 800,
  height = 450,
  autoPlay = true,
  loop = true,
}) => {
  // Generate a unique ID for this instance - stable across renders
  const storeIdRef = React.useRef<string | null>(null);
  if (!storeIdRef.current) {
    storeIdRef.current = `remotion-preview-${++idCounter}`;
  }
  const storeId = storeIdRef.current;

  // Store children synchronously BEFORE rendering (not in useEffect)
  // This ensures children are available when SimpleComposition first renders
  childrenStore.set(storeId, children);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      childrenStore.delete(storeId);
    };
  }, [storeId]);

  const inputProps: CompositionProps = useMemo(() => ({ storeId }), [storeId]);

  return (
    <div style={{ width: "100%" }}>
      <Player
        key={`player-${storeId}`}
        component={SimpleComposition}
        inputProps={inputProps}
        compositionWidth={width}
        compositionHeight={height}
        durationInFrames={durationInFrames}
        fps={fps}
        autoPlay={autoPlay}
        loop={loop}
        controls
        style={{
          width: "100%",
          aspectRatio: `${width} / ${height}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        renderLoading={() => (
          <div style={{ padding: 20, color: "#666" }}>Loading...</div>
        )}
      />
    </div>
  );
};

export default RemotionPreview;
