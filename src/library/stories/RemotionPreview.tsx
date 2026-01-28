"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type ReactNode, useEffect, useRef } from "react";
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
 * Parses the URL hash for a frame parameter.
 * Supports formats: #frame=30 or #f=30
 */
const getFrameFromHash = (): number | null => {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.slice(1); // Remove the #
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const frameValue = params.get("frame") ?? params.get("f");

  if (frameValue) {
    const frame = parseInt(frameValue, 10);
    if (!isNaN(frame) && frame >= 0) {
      return frame;
    }
  }

  return null;
};

/**
 * Wrapper component for previewing Remotion components in Storybook.
 *
 * Supports URL hash parameters for seeking to a specific frame:
 * - #frame=30 or #f=30 will seek to frame 30 and pause
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
  const playerRef = useRef<PlayerRef>(null);

  const Composition: ComponentType = () => (
    <PreviewShell>{children}</PreviewShell>
  );

  // Handle URL hash parameter for seeking to a specific frame
  useEffect(() => {
    const targetFrame = getFrameFromHash();

    if (targetFrame !== null && playerRef.current) {
      // Clamp frame to valid range
      const clampedFrame = Math.min(targetFrame, durationInFrames - 1);

      // Seek to the frame and pause
      playerRef.current.seekTo(clampedFrame);
      playerRef.current.pause();
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newFrame = getFrameFromHash();
      if (newFrame !== null && playerRef.current) {
        const clampedFrame = Math.min(newFrame, durationInFrames - 1);
        playerRef.current.seekTo(clampedFrame);
        playerRef.current.pause();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [durationInFrames]);

  return (
    <div style={{ width, height }}>
      <Player
        ref={playerRef}
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
