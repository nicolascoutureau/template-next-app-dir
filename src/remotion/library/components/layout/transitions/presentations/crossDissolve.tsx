import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function crossDissolve(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);

      return (
        <AbsoluteFill
          style={{
            opacity: isEntering ? smoothProgress : 1 - smoothProgress,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
