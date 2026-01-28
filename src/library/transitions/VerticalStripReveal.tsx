import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export interface VerticalStripRevealProps {
  children: ReactNode;
  strips?: number;
  startFrame?: number;
  durationInFrames?: number;
  staggerDelay?: number;
  direction?: "left-to-right" | "right-to-left" | "center-out" | "edges-in";
  revealMode?: "slide" | "fade" | "scale";
  className?: string;
  style?: CSSProperties;
}

export const VerticalStripReveal = ({
  children,
  strips = 5,
  startFrame = 0,
  durationInFrames = 30,
  staggerDelay = 4,
  direction = "center-out",
  revealMode = "slide",
  className,
  style,
}: VerticalStripRevealProps) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const stripOrder = getStripOrder(strips, direction);
  const stripWidth = 100 / strips;

  if (localFrame < 0) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      {stripOrder.map((orderIndex, i) => {
        const stripDelay = orderIndex * staggerDelay;
        const stripLocalFrame = localFrame - stripDelay;

        const progress = interpolate(
          stripLocalFrame,
          [0, durationInFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        const stripStyle = getStripStyle(
          revealMode,
          progress,
          i,
          stripWidth
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${i * stripWidth}%`,
              width: `${stripWidth}%`,
              height: "100%",
              overflow: "hidden",
              ...stripStyle,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${-i * stripWidth}%`,
                width: `${strips * 100}%`,
                height: "100%",
                transform: `translateX(${(i * 100) / strips}%)`,
              }}
            >
              <div
                style={{
                  width: `${100 / strips}%`,
                  height: "100%",
                }}
              >
                {children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function getStripOrder(
  strips: number,
  direction: "left-to-right" | "right-to-left" | "center-out" | "edges-in"
): number[] {
  const indices = Array.from({ length: strips }, (_, i) => i);

  switch (direction) {
    case "left-to-right":
      return indices;
    case "right-to-left":
      return indices.reverse();
    case "center-out": {
      const result: number[] = [];
      const center = Math.floor(strips / 2);
      for (let i = 0; i <= center; i++) {
        if (center - i >= 0) result[center - i] = i;
        if (center + i < strips) result[center + i] = i;
      }
      return result;
    }
    case "edges-in": {
      const result: number[] = [];
      for (let i = 0; i < strips; i++) {
        const distanceFromEdge = Math.min(i, strips - 1 - i);
        result[i] = distanceFromEdge;
      }
      return result;
    }
    default:
      return indices;
  }
}

function getStripStyle(
  revealMode: "slide" | "fade" | "scale",
  progress: number,
  _stripIndex: number,
  _stripWidth: number
): CSSProperties {
  switch (revealMode) {
    case "slide":
      return {
        transform: `translateY(${(1 - progress) * 100}%)`,
      };
    case "fade":
      return {
        opacity: progress,
      };
    case "scale":
      return {
        transform: `scaleY(${progress})`,
        transformOrigin: "top",
      };
    default:
      return {};
  }
}
