import type { CSSProperties } from "react";
import { useMemo } from "react";
import { ShaderPlane } from "./ShaderPlane";

/**
 * Tunnel visual style.
 */
export type TunnelStyle = "warp" | "vortex" | "grid" | "neon" | "starfield" | "digital";

/**
 * Props for the `TunnelBackground` component.
 */
export type TunnelBackgroundProps = {
  /** Primary color (hex). Defaults to "#0070f3". */
  color1?: string;
  /** Secondary color (hex). Defaults to "#7928ca". */
  color2?: string;
  /** Background/void color (hex). Defaults to "#000000". */
  backgroundColor?: string;
  /** Tunnel visual style. Defaults to "warp". */
  tunnelStyle?: TunnelStyle;
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number;
  /** Tunnel depth/zoom factor. Defaults to 1. */
  depth?: number;
  /** Number of tunnel segments/rings. Defaults to 20. */
  segments?: number;
  /** Rotation speed (0 = no rotation). Defaults to 0.2. */
  rotation?: number;
  /** Center offset X (-1 to 1). Defaults to 0. */
  centerX?: number;
  /** Center offset Y (-1 to 1). Defaults to 0. */
  centerY?: number;
  /** Glow intensity (0-2). Defaults to 1. */
  glow?: number;
  /** Width in pixels. Defaults to 1920. */
  width?: number;
  /** Height in pixels. Defaults to 1080. */
  height?: number;
  /** Pixel ratio for quality. Defaults to 1. */
  pixelRatio?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Converts hex color to RGB array (0-1 range).
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [0, 0.44, 0.95];
}

/**
 * Generates tunnel effect code based on style.
 */
function getTunnelCode(tunnelStyle: TunnelStyle): string {
  const styles: Record<TunnelStyle, string> = {
    warp: `
      // Classic warp speed / hyperspace
      float rings = fract(d * u_segments - u_time * 2.0 * u_depth);
      float streak = smoothstep(0.0, 0.1, rings) * smoothstep(1.0, 0.3, rings);
      
      // Radial streaks
      float streakAngle = sin(angle * 30.0 + d * 10.0) * 0.5 + 0.5;
      streak *= mix(0.5, 1.0, streakAngle);
      
      // Depth fade
      float depthFade = 1.0 - smoothstep(0.0, 0.8, d);
      intensity = streak * depthFade;
      
      // Color based on depth
      colorMix = d;
    `,
    vortex: `
      // Spiraling vortex
      float spiral = sin(angle * 8.0 - d * 20.0 + u_time * 3.0 * u_rotation);
      float rings = sin(d * u_segments * 3.14159 - u_time * 4.0 * u_depth) * 0.5 + 0.5;
      
      intensity = smoothstep(-0.5, 0.8, spiral) * rings;
      intensity *= 1.0 - smoothstep(0.0, 1.0, d);
      
      // Swirling color
      colorMix = fract(angle / 6.28318 + d + u_time * 0.1);
    `,
    grid: `
      // Perspective grid tunnel
      float rotatedAngle = angle + u_time * u_rotation;
      
      // Grid lines
      float gridU = sin(rotatedAngle * 16.0) * 0.5 + 0.5;
      float gridV = fract(1.0 / (d + 0.01) * 2.0 - u_time * u_depth * 3.0);
      
      float lineU = smoothstep(0.4, 0.5, gridU) * smoothstep(0.6, 0.5, gridU);
      float lineV = smoothstep(0.0, 0.05, gridV) + smoothstep(1.0, 0.95, gridV);
      
      intensity = max(lineU, lineV * 0.5);
      intensity *= 1.0 - smoothstep(0.0, 0.9, d);
      
      colorMix = d;
    `,
    neon: `
      // Neon ring tunnel
      float ring = fract(d * u_segments - u_time * u_depth * 2.0);
      float ringEdge = smoothstep(0.0, 0.02, ring) * smoothstep(0.1, 0.02, ring);
      
      // Neon glow
      float glowRing = exp(-abs(ring - 0.05) * 30.0);
      
      // Rotating segments
      float segmentAngle = sin(angle * 6.0 + u_time * u_rotation * 2.0);
      float segments = smoothstep(0.0, 0.3, segmentAngle);
      
      intensity = (ringEdge + glowRing * 0.5) * segments;
      intensity *= 1.0 - d * 0.8;
      
      colorMix = fract(d + u_time * 0.1);
    `,
    starfield: `
      // Starfield warp
      vec2 starPos = pos;
      float starD = length(starPos);
      
      // Create stars using noise-like pattern
      float starAngle = atan(starPos.y, starPos.x);
      float starRing = fract(starD * 30.0 - u_time * u_depth * 5.0);
      
      // Star brightness based on angle hash
      float hash = fract(sin(floor(starAngle * 50.0) * 12.9898) * 43758.5453);
      float star = smoothstep(0.95, 1.0, hash) * smoothstep(0.1, 0.0, starRing);
      
      // Streak effect
      float streak = star * smoothstep(0.0, 0.3, starRing);
      
      intensity = star + streak * 0.5;
      intensity *= 1.0 - smoothstep(0.0, 0.8, starD);
      
      colorMix = hash;
    `,
    digital: `
      // Digital/matrix style tunnel
      float rotatedAngle = angle + u_time * u_rotation * 0.5;
      
      // Hex-like grid
      float hexAngle = mod(rotatedAngle + 3.14159/6.0, 3.14159/3.0) - 3.14159/6.0;
      float hexD = d / cos(hexAngle);
      
      float ring = fract(hexD * u_segments - u_time * u_depth * 2.0);
      float data = fract(sin(floor(rotatedAngle * 12.0) * 12.9898 + u_time) * 43758.5453);
      
      float line = smoothstep(0.0, 0.02, ring) * smoothstep(0.15, 0.02, ring);
      float dataLine = step(0.7, data) * line;
      
      intensity = line * 0.3 + dataLine;
      intensity *= 1.0 - smoothstep(0.0, 0.9, d);
      
      colorMix = data;
    `,
  };

  return styles[tunnelStyle];
}

/**
 * Generates the tunnel fragment shader.
 */
function generateTunnelShader(tunnelStyle: TunnelStyle): string {
  return `
    precision highp float;
    
    varying vec2 v_uv;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_bgColor;
    uniform float u_depth;
    uniform float u_segments;
    uniform float u_rotation;
    uniform vec2 u_center;
    uniform float u_glow;
    
    void main() {
      // Centered coordinates with offset
      vec2 pos = (v_uv - 0.5) * 2.0;
      pos.x *= u_resolution.x / u_resolution.y;
      pos -= u_center;
      
      // Polar coordinates
      float d = length(pos);
      float angle = atan(pos.y, pos.x);
      
      // Apply rotation
      angle += u_time * u_rotation;
      
      float intensity = 0.0;
      float colorMix = 0.0;
      
      ${getTunnelCode(tunnelStyle)}
      
      // Apply glow
      intensity = pow(intensity, 1.0 / u_glow);
      
      // Color mixing
      vec3 tunnelColor = mix(u_color1, u_color2, colorMix);
      vec3 color = mix(u_bgColor, tunnelColor, clamp(intensity, 0.0, 1.0));
      
      // Add subtle center glow
      float centerGlow = exp(-d * 3.0) * 0.2 * u_glow;
      color += tunnelColor * centerGlow;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

/**
 * `TunnelBackground` creates warp speed, hyperspace, and tunnel effects using
 * GPU shaders. Perfect for intros, transitions, or sci-fi themed videos.
 *
 * @example
 * ```tsx
 * // Classic hyperspace warp
 * <TunnelBackground
 *   tunnelStyle="warp"
 *   color1="#0070f3"
 *   color2="#00ffff"
 *   speed={1.5}
 * />
 *
 * // Spiraling vortex
 * <TunnelBackground
 *   tunnelStyle="vortex"
 *   color1="#ff0080"
 *   color2="#7928ca"
 *   rotation={0.5}
 * />
 *
 * // Retro grid tunnel
 * <TunnelBackground
 *   tunnelStyle="grid"
 *   color1="#00ff00"
 *   color2="#00ff00"
 *   backgroundColor="#0a0a0a"
 *   segments={30}
 * />
 *
 * // Neon ring tunnel
 * <TunnelBackground
 *   tunnelStyle="neon"
 *   color1="#ff00ff"
 *   color2="#00ffff"
 *   glow={1.5}
 * />
 *
 * // Star warp with offset center
 * <TunnelBackground
 *   tunnelStyle="starfield"
 *   centerX={-0.2}
 *   centerY={0.1}
 *   speed={2}
 * />
 * ```
 */
export const TunnelBackground = ({
  color1 = "#0070f3",
  color2 = "#7928ca",
  backgroundColor = "#000000",
  tunnelStyle = "warp",
  speed = 1,
  depth = 1,
  segments = 20,
  rotation = 0.2,
  centerX = 0,
  centerY = 0,
  glow = 1,
  width = 1920,
  height = 1080,
  pixelRatio = 1,
  className,
  style,
}: TunnelBackgroundProps) => {
  const fragmentShader = useMemo(
    () => generateTunnelShader(tunnelStyle),
    [tunnelStyle]
  );

  const uniforms = useMemo(
    () => ({
      u_color1: hexToRgb(color1),
      u_color2: hexToRgb(color2),
      u_bgColor: hexToRgb(backgroundColor),
      u_depth: depth,
      u_segments: segments,
      u_rotation: rotation,
      u_center: [centerX, centerY] as [number, number],
      u_glow: glow,
    }),
    [color1, color2, backgroundColor, depth, segments, rotation, centerX, centerY, glow]
  );

  return (
    <ShaderPlane
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      width={width}
      height={height}
      pixelRatio={pixelRatio}
      speed={speed}
      className={className}
      style={style}
    />
  );
};
