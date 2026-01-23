"use client";

import { useState } from "react";
import { useRendering } from "../helpers/use-rendering";
import { useClientRendering } from "../helpers/use-client-rendering";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button/Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";

type RenderMode = "lambda" | "client";

export const RenderControls: React.FC = () => {
  const [renderMode, setRenderMode] = useState<RenderMode>("lambda");

  const lambdaRendering = useRendering({});
  const clientRendering = useClientRendering({});

  const { renderMedia, state, undo } =
    renderMode === "lambda" ? lambdaRendering : clientRendering;

  const handleModeChange = (mode: RenderMode) => {
    // Reset both states when switching modes
    lambdaRendering.undo();
    clientRendering.undo();
    setRenderMode(mode);
  };

  return (
    <InputContainer>
      {/* Render Mode Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Render with:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            onClick={() => handleModeChange("lambda")}
            className={`px-3 py-1 text-sm transition-colors ${
              renderMode === "lambda"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Lambda (Server)
          </button>
          <button
            onClick={() => handleModeChange("client")}
            className={`px-3 py-1 text-sm transition-colors ${
              renderMode === "client"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Browser (Client)
          </button>
        </div>
        {renderMode === "client" && (
          <span className="text-xs text-amber-600 font-medium">
            ⚠️ Experimental
          </span>
        )}
      </div>

      {/* Render Controls */}
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
