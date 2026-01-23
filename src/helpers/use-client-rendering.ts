"use client";

import { useCallback, useMemo, useState } from "react";
import { composition } from "../remotion/compositions";

export type ClientRenderState =
  | {
      status: "init";
    }
  | {
      status: "rendering";
      progress: number;
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      status: "done";
      url: string;
      size: number;
    };

export const useClientRendering = (inputProps: Record<string, unknown>) => {
  const [state, setState] = useState<ClientRenderState>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({ status: "rendering", progress: 0 });

    try {
      // Dynamically import to avoid SSR issues
      const { renderMediaOnWeb } = await import("@remotion/web-renderer");

      const totalFrames = composition.durationInFrames;

      const result = await renderMediaOnWeb({
        composition: {
          component: composition.component,
          durationInFrames: composition.durationInFrames,
          fps: composition.fps,
          width: composition.width,
          height: composition.height,
          calculateMetadata: null,
          id: composition.id,
        },
        inputProps,
        onProgress: ({ encodedFrames }) => {
          // Calculate progress based on encoded frames
          const progress = totalFrames > 0 ? encodedFrames / totalFrames : 0;
          setState({ status: "rendering", progress: Math.min(progress, 0.99) });
        },
      });

      const blob = await result.getBlob();
      const url = URL.createObjectURL(blob);

      setState({
        status: "done",
        url,
        size: blob.size,
      });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }, [inputProps]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(
    () => ({
      renderMedia,
      state,
      undo,
    }),
    [renderMedia, state, undo]
  );
};
