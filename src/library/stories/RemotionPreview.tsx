"use client";

import { Player } from "@remotion/player";
import type { ComponentType, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

type RemotionPreviewProps = {
  children: ReactNode;
  width?: number;
  height?: number;
  durationInFrames?: number;
  fps?: number;
  loop?: boolean;
  autoPlay?: boolean;
};

const PreviewShell = ({ children }: { children: ReactNode }) => {
  const { fontFamily } = loadFont();
  return (
    <AbsoluteFill
      className="items-center justify-center bg-slate-950 text-white"
      style={{ fontFamily }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Wrapper component for previewing Remotion components in Storybook.
 */
export const RemotionPreview = ({
  children,
  width = 800,
  height = 450,
  durationInFrames = 90,
  fps = 30,
  loop = true,
  autoPlay = true,
}: RemotionPreviewProps) => {
  const Composition: ComponentType = () => (
    <PreviewShell>{children}</PreviewShell>
  );

  return (
    <div style={{ width, height }}>
      <Player
        component={Composition}
        compositionWidth={width}
        compositionHeight={height}
        durationInFrames={durationInFrames}
        fps={fps}
        loop={loop}
        autoPlay={autoPlay}
        controls
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
