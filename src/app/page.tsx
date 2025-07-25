"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { DynamicPlayer } from "../components/DynamicPlayer";
import { RenderControls } from "../components/RenderControls";
import {
  getCompositionIds,
  getCompositionById,
} from "../remotion/compositions";

const Home: NextPage = () => {
  const [selectedComposition, setSelectedComposition] = useState("HelloWorld");
  const [customProps, setCustomProps] = useState<Record<string, unknown>>({});
  const [playerSize, setPlayerSize] = useState<React.CSSProperties>({
    width: "100%",
    height: "100%",
  });
  const compositionIds = getCompositionIds();

  // Get the current composition to calculate dimensions
  const currentComposition = getCompositionById(selectedComposition);

  // Calculate the player size based on composition aspect ratio
  const calculatePlayerSize = () => {
    if (!currentComposition || typeof window === "undefined")
      return { width: "100%", height: "100%" };

    const { width: compWidth, height: compHeight } = currentComposition;
    const aspectRatio = compWidth / compHeight;

    // Maximum available space
    const maxWidth = 1200; // max-w-6xl equivalent
    const maxHeight = window.innerHeight * 0.6; // 60% of viewport height

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

  // Update player size when composition changes or window resizes
  useEffect(() => {
    const updateSize = () => {
      setPlayerSize(calculatePlayerSize());
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [selectedComposition]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4">
      <div className="w-full h-full max-w-6xl max-h-[80vh] flex flex-col items-center justify-center">
        {/* Composition Selector */}
        <div className="mb-4">
          <select
            value={selectedComposition}
            onChange={(e) => {
              setSelectedComposition(e.target.value);
              setCustomProps({}); // Reset custom props when changing composition
            }}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
          >
            {compositionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {/* Player */}
        <div className="w-full h-full flex items-center justify-center">
          <DynamicPlayer
            compositionId={selectedComposition}
            inputProps={customProps}
            style={playerSize}
          />
        </div>
      </div>

      <div className="mt-4">
        <RenderControls compositionId={selectedComposition} />
      </div>
    </div>
  );
};

export default Home;
