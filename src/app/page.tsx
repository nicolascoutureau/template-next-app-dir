"use client";

import type { NextPage } from "next";
import React, { useState } from "react";
import { DynamicPlayer } from "../components/DynamicPlayer";
import { RenderControls } from "../components/RenderControls";
import { CompositionControls } from "../components/CompositionControls";
import { getCompositionIds } from "../remotion/compositions";

const Home: NextPage = () => {
  const [selectedComposition, setSelectedComposition] = useState("HelloWorld");
  const [customProps, setCustomProps] = useState<Record<string, unknown>>({});
  const compositionIds = getCompositionIds();

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
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
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
