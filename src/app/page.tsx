"use client";

import type { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { composition } from "../remotion/compositions";

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

const Home: NextPage = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [playerSize, setPlayerSize] = useState<React.CSSProperties>({
    width: "100%",
    height: "100%",
  });

  // Check if we should autoPlay (only if no frame hash is present)
  const initialFrame = getFrameFromHash();
  const shouldAutoPlay = initialFrame === null;

  // Calculate the player size based on composition aspect ratio
  const calculatePlayerSize = () => {
    if (typeof window === "undefined") return { width: "100%", height: "100%" };

    const aspectRatio = composition.width / composition.height;

    // Maximum available space
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.85;

    let playerWidth = maxWidth;
    let playerHeight = playerWidth / aspectRatio;

    // If height exceeds max height, scale down
    if (playerHeight > maxHeight) {
      playerHeight = maxHeight;
      playerWidth = playerHeight * aspectRatio;
    }

    return {
      width: `${playerWidth}px`,
      height: `${playerHeight}px`,
      maxWidth: "100%",
      maxHeight: "100%",
    };
  };

  // Update player size on window resize
  useEffect(() => {
    const updateSize = () => {
      setPlayerSize(calculatePlayerSize());
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Handle URL hash parameter for seeking to a specific frame
  useEffect(() => {
    const seekToHashFrame = () => {
      const targetFrame = getFrameFromHash();
      if (targetFrame !== null && playerRef.current) {
        // Clamp frame to valid range
        const clampedFrame = Math.min(
          targetFrame,
          composition.durationInFrames - 1
        );
        playerRef.current.seekTo(clampedFrame);
        playerRef.current.pause();
      }
    };

    // Seek on initial load
    seekToHashFrame();

    // Listen for hash changes
    window.addEventListener("hashchange", seekToHashFrame);
    return () => window.removeEventListener("hashchange", seekToHashFrame);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-2">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <Player
            ref={playerRef}
            component={composition.component}
            durationInFrames={composition.durationInFrames}
            fps={composition.fps}
            compositionHeight={composition.height}
            compositionWidth={composition.width}
            controls
            autoPlay={shouldAutoPlay}
            loop
            style={playerSize}
            allowFullscreen
            doubleClickToFullscreen
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
