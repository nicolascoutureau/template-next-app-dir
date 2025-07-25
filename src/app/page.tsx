"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React from "react";
import { HelloWorld } from "../remotion/HelloWorld";
import { RenderControls } from "../components/RenderControls";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4">
      <div className="w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
        <Player
          component={HelloWorld}
          inputProps={{}}
          durationInFrames={150}
          fps={30}
          compositionHeight={1080}
          compositionWidth={1920}
          controls
          autoPlay
          loop
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
      <div className="mt-4">
        <RenderControls />
      </div>
    </div>
  );
};

export default Home;
