import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type KineticType = "path" | "marquee" | "cylinder";

export interface KineticTextProps {
  children: string;
  type?: KineticType;
  /** Path data for 'path' type */
  path?: string;
  /** SVG viewBox for the path mode */
  pathViewBox?: string;
  /** Font size */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Text color */
  color?: string;
  /** Speed of movement (1 = 100px/sec) */
  speed?: number;
  /** Reverse direction */
  reverse?: boolean;
  /** Repeat text to fill space */
  repeat?: number;
  /** Gap between repeats (px) */
  gap?: number;
  /** Cylinder radius for 'cylinder' type */
  radius?: number;
  /** Perspective distance for 'cylinder' type */
  perspective?: number;
  /** Skew X for marquee */
  skew?: number;
  /** Additional styles */
  style?: React.CSSProperties;
  className?: string;
}

const getGapSpaces = (gap: number, fontSize: number) => {
  const spaceWidth = Math.max(4, fontSize * 0.35);
  return Math.max(1, Math.round(gap / spaceWidth));
};

/**
 * Advanced kinetic typography component.
 * Supports text along a path, infinite marquee, and 3D cylinder rotation.
 *
 * @example
 * // Text along a wave path
 * <KineticText
 *   type="path"
 *   path="M0,50 Q200,0 400,50 T800,50"
 *   repeat={3}
 * >
 *   WAVY TEXT
 * </KineticText>
 *
 * @example
 * // Infinite scrolling marquee
 * <KineticText type="marquee" speed={1.2} repeat={6}>
 *   SCROLLING NEWS
 * </KineticText>
 *
 * @example
 * // Rotating cylinder
 * <KineticText type="cylinder" radius={140} repeat={8}>
 *   ROTATING 3D
 * </KineticText>
 */
export const KineticText: React.FC<KineticTextProps> = ({
  children,
  type = "marquee",
  path,
  pathViewBox,
  fontSize = 40,
  fontFamily = "sans-serif",
  color = "currentColor",
  speed = 1,
  reverse = false,
  repeat = 1,
  gap = 20,
  radius = 100,
  perspective = 1000,
  skew = 0,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const direction = reverse ? 1 : -1;
  const id = useId().replace(/:/g, "-");
  const pathId = `kinetic-path-${id}`;
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const textStyle = useMemo(
    () => ({
      fontSize,
      fontFamily,
      color,
      whiteSpace: "nowrap" as const,
    }),
    [fontSize, fontFamily, color],
  );

  useEffect(() => {
    if (type === "path" && pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [path, type]);

  useEffect(() => {
    if (!measureRef.current) return;
    const width = measureRef.current.getBoundingClientRect().width;
    if (width > 0 && Math.abs(width - textWidth) > 0.5) {
      setTextWidth(width);
    }
  }, [children, fontSize, fontFamily, textWidth]);

  // Path Text Implementation
  if (type === "path" && path) {

    const spacer = "\u00A0".repeat(getGapSpaces(gap, fontSize));
    const textContent = useMemo(() => {
      const count = Math.max(1, repeat);
      return Array.from({ length: count })
        .map(() => children)
        .join(spacer);
    }, [children, repeat, spacer]);

    const loopLength = pathLength > 0 ? pathLength : Math.max(width, height) * 4;
    const rawOffset = ((time * speed * 100) % loopLength + loopLength) % loopLength;
    const offset = reverse ? loopLength - rawOffset : rawOffset;

    return (
      <div className={className} style={{ width: "100%", height: "100%", ...style }}>
        <svg
          width="100%"
          height="100%"
          viewBox={pathViewBox ?? `0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
        >
          <path ref={pathRef} id={pathId} d={path} fill="none" stroke="none" />
          <text style={textStyle} dominantBaseline="middle">
            <textPath href={`#${pathId}`} startOffset={`${offset}px`} spacing="auto">
              {textContent}
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  // Cylinder / 3D Implementation
  if (type === "cylinder") {
    const itemCount = Math.max(3, repeat);
    const rotation = time * speed * 30 * (reverse ? -1 : 1);
    const angleStep = 360 / itemCount;

    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          perspective: `${perspective}px`,
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {Array.from({ length: itemCount }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                ...textStyle,
              }}
            >
              {children}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Infinite Marquee Implementation
  const estimatedWidth = Math.max(1, children.length) * fontSize * 0.6;
  const baseWidth = (textWidth || estimatedWidth) + gap;
  const minRepeats =
    baseWidth > 0 ? Math.ceil((width + baseWidth) / baseWidth) + 1 : 2;
  const repeatCount = Math.max(repeat, minRepeats);
  const travel = baseWidth * repeatCount;
  const offset = ((time * speed * 100) % travel) * direction;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        transform: `skewX(${skew}deg)`,
        ...style,
      }}
    >
      <span
        ref={measureRef}
        style={{
          ...textStyle,
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>
      <div
        style={{
          display: "flex",
          gap,
          transform: `translateX(${offset}px)`,
          willChange: "transform",
        }}
      >
        {Array.from({ length: repeatCount }).map((_, i) => (
          <span key={i} style={textStyle}>
            {children}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KineticText;
