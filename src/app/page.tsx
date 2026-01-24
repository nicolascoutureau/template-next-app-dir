"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { composition } from "../remotion/compositions";

const Home: NextPage = () => {
  const [playerSize, setPlayerSize] = useState<React.CSSProperties>({
    width: "100%",
    height: "100%",
  });

  // Calculate the player size based on composition aspect ratio
  const calculatePlayerSize = () => {
    if (typeof window === "undefined") return { width: "100%", height: "100%" };

    const aspectRatio = composition.width / composition.height;

    // Maximum available space
    const maxWidth = 1200;
    const maxHeight = window.innerHeight * 0.6;

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

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4">
      <div className="w-full h-full max-w-6xl max-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <Player
            component={composition.component}
            durationInFrames={composition.durationInFrames}
            fps={composition.fps}
            compositionHeight={composition.height}
            compositionWidth={composition.width}
            controls
            autoPlay
            loop
            style={playerSize}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
