import { Player } from "@remotion/player";
import React from "react";
import { getCompositionById } from "../remotion/compositions";

interface DynamicPlayerProps {
  compositionId: string;
  inputProps?: Record<string, unknown>;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export const DynamicPlayer: React.FC<DynamicPlayerProps> = ({
  compositionId,
  inputProps = {},
  style,
  autoPlay = true,
  loop = true,
  controls = true,
}) => {
  const composition = getCompositionById(compositionId);

  if (!composition) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Composition "{compositionId}" not found
      </div>
    );
  }

  // Merge defaultProps with inputProps, with inputProps taking precedence
  const mergedProps = {
    ...composition.defaultProps,
    ...inputProps,
  };

  return (
    <Player
      component={composition.component}
      inputProps={mergedProps}
      durationInFrames={composition.durationInFrames}
      fps={composition.fps}
      compositionHeight={composition.height}
      compositionWidth={composition.width}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
    />
  );
};
