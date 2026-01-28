import type { CSSProperties } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export interface ColorBarHeaderProps {
  color?: string;
  width?: number | string;
  height?: number;
  position?: "above" | "below" | "left" | "right";
  animateWidth?: boolean;
  startFrame?: number;
  durationInFrames?: number;
  className?: string;
  style?: CSSProperties;
}

export const ColorBarHeader = ({
  color = "#D4AF37",
  width = "100%",
  height = 4,
  position = "above",
  animateWidth = true,
  startFrame = 0,
  durationInFrames = 20,
  className,
  style,
}: ColorBarHeaderProps) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const scale = animateWidth
    ? interpolate(localFrame, [0, durationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 1;

  if (localFrame < 0) {
    return null;
  }

  const isVertical = position === "left" || position === "right";

  const barStyle: CSSProperties = {
    backgroundColor: color,
    width: isVertical ? height : width,
    height: isVertical ? width : height,
    transform: isVertical ? `scaleY(${scale})` : `scaleX(${scale})`,
    transformOrigin: getTransformOrigin(position),
    borderRadius: height / 2,
    ...style,
  };

  return <div className={className} style={barStyle} />;
};

function getTransformOrigin(
  position: "above" | "below" | "left" | "right"
): string {
  switch (position) {
    case "above":
    case "below":
      return "left center";
    case "left":
      return "center top";
    case "right":
      return "center bottom";
    default:
      return "left center";
  }
}
