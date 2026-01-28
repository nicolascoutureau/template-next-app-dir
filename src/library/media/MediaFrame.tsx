import type { CSSProperties } from "react";
import { useCurrentFrame, interpolate, Easing, Img, Video } from "remotion";

export interface MediaFrameProps {
  src: string;
  type: "image" | "video";
  width: number;
  height: number;
  borderRadius?: number;
  strokeWidth?: number;
  strokeColor?: string;
  strokeAnimationDelay?: number;
  strokeDuration?: number;
  contentDelay?: number;
  contentFadeDuration?: number;
  className?: string;
  style?: CSSProperties;
}

export const MediaFrame = ({
  src,
  type,
  width,
  height,
  borderRadius = 16,
  strokeWidth = 4,
  strokeColor = "#FFFFFF",
  strokeAnimationDelay = 0,
  strokeDuration = 30,
  contentDelay,
  contentFadeDuration = 15,
  className,
  style,
}: MediaFrameProps) => {
  const frame = useCurrentFrame();

  const effectiveContentDelay = contentDelay ?? strokeAnimationDelay + strokeDuration;

  const perimeter = calculateRoundedRectPerimeter(
    width,
    height,
    borderRadius
  );

  const strokeLocalFrame = frame - strokeAnimationDelay;
  const strokeProgress = interpolate(
    strokeLocalFrame,
    [0, strokeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const contentLocalFrame = frame - effectiveContentDelay;
  const contentOpacity = interpolate(
    contentLocalFrame,
    [0, contentFadeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const dashOffset = perimeter * (1 - strokeProgress);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={width - strokeWidth}
          height={height - strokeWidth}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={perimeter}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: strokeWidth,
          left: strokeWidth,
          width: width - strokeWidth * 2,
          height: height - strokeWidth * 2,
          borderRadius: borderRadius - strokeWidth / 2,
          overflow: "hidden",
          opacity: contentOpacity,
        }}
      >
        {type === "image" ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Video
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
    </div>
  );
};

function calculateRoundedRectPerimeter(
  width: number,
  height: number,
  radius: number
): number {
  const effectiveRadius = Math.min(radius, width / 2, height / 2);
  const straightWidth = width - 2 * effectiveRadius;
  const straightHeight = height - 2 * effectiveRadius;
  const cornerCircumference = 2 * Math.PI * effectiveRadius;
  return 2 * straightWidth + 2 * straightHeight + cornerCircumference;
}
