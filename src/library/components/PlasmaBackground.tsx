import type { CSSProperties } from "react";
import { useMemo } from "react";
import { ShaderPlane } from "./ShaderPlane";

/**
 * Plasma animation style presets.
 */
export type PlasmaStyle = "classic" | "liquid" | "electric" | "organic" | "crystal";

/**
 * Props for the `PlasmaBackground` component.
 */
export type PlasmaBackgroundProps = {
  /** Primary color (hex or rgb). Defaults to "#ff0080". */
  color1?: string;
  /** Secondary color (hex or rgb). Defaults to "#7928ca". */
  color2?: string;
  /** Tertiary color (hex or rgb). Defaults to "#0070f3". */
  color3?: string;
  /** Background color (hex or rgb). Defaults to "#000000". */
  backgroundColor?: string;
  /** Plasma complexity (1-10). Higher = more detail. Defaults to 5. */
  complexity?: number;
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number;
  /** Scale of the plasma pattern. Defaults to 1. */
  scale?: number;
  /** Plasma style preset. Defaults to "classic". */
  plasmaStyle?: PlasmaStyle;
  /** Color intensity/saturation (0-2). Defaults to 1. */
  intensity?: number;
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
  return [1, 0, 0.5]; // Fallback magenta
}

/**
 * Generates fragment shader based on plasma style.
 */
function generatePlasmaShader(plasmaStyle: PlasmaStyle): string {
  const styleVariations: Record<PlasmaStyle, string> = {
    classic: `
      float plasma = sin(pos.x * u_complexity + u_time * 2.0)
                   + sin(pos.y * u_complexity + u_time * 1.5)
                   + sin((pos.x + pos.y) * u_complexity * 0.5 + u_time)
                   + sin(sqrt(pos.x * pos.x + pos.y * pos.y) * u_complexity + u_time * 1.2);
      plasma = plasma * 0.25 + 0.5;
    `,
    liquid: `
      float d = length(pos);
      float plasma = sin(pos.x * u_complexity * 0.5 + sin(pos.y * 0.5 + u_time) * 2.0)
                   + sin(pos.y * u_complexity * 0.5 + sin(pos.x * 0.5 + u_time * 0.8) * 2.0)
                   + sin(d * u_complexity * 0.3 - u_time * 1.5);
      plasma = smoothstep(-1.5, 1.5, plasma);
    `,
    electric: `
      float angle = atan(pos.y, pos.x);
      float d = length(pos);
      float plasma = sin(angle * 8.0 + d * u_complexity - u_time * 3.0)
                   + sin(d * u_complexity * 2.0 + u_time * 2.0) * 0.5
                   + sin(pos.x * u_complexity + sin(u_time * 4.0) * pos.y) * 0.3;
      plasma = abs(plasma) * 0.6;
    `,
    organic: `
      float n1 = sin(pos.x * u_complexity * 0.7 + u_time) * cos(pos.y * u_complexity * 0.5 + u_time * 0.7);
      float n2 = sin(pos.y * u_complexity * 0.8 - u_time * 0.9) * cos(pos.x * u_complexity * 0.6 + u_time * 0.5);
      float n3 = sin(length(pos) * u_complexity * 0.4 + u_time * 0.6);
      float plasma = (n1 + n2 + n3) * 0.33 + 0.5;
      plasma = plasma * plasma; // Softer falloff
    `,
    crystal: `
      vec2 cell = floor(pos * u_complexity * 0.5);
      vec2 local = fract(pos * u_complexity * 0.5);
      float pattern = sin(cell.x * 12.9898 + cell.y * 78.233 + u_time) * 0.5 + 0.5;
      float edge = smoothstep(0.0, 0.1, min(local.x, local.y)) * 
                   smoothstep(0.0, 0.1, min(1.0 - local.x, 1.0 - local.y));
      float wave = sin(pos.x * u_complexity + pos.y * u_complexity + u_time * 2.0) * 0.5 + 0.5;
      float plasma = mix(pattern, wave, 0.5) * edge + (1.0 - edge) * 0.2;
    `,
  };

  return `
    precision highp float;
    
    varying vec2 v_uv;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform vec3 u_bgColor;
    uniform float u_complexity;
    uniform float u_scale;
    uniform float u_intensity;
    
    void main() {
      // Centered and scaled UV coordinates
      vec2 pos = (v_uv - 0.5) * 2.0 * u_scale;
      pos.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction
      
      // Plasma calculation based on style
      ${styleVariations[plasmaStyle]}
      
      // Clamp plasma to valid range
      plasma = clamp(plasma, 0.0, 1.0);
      
      // Color mixing using smoothstep for smoother transitions
      vec3 color = u_bgColor;
      color = mix(color, u_color1, smoothstep(0.0, 0.33, plasma));
      color = mix(color, u_color2, smoothstep(0.33, 0.66, plasma));
      color = mix(color, u_color3, smoothstep(0.66, 1.0, plasma));
      
      // Apply intensity
      color = mix(u_bgColor, color, u_intensity);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

/**
 * `PlasmaBackground` creates classic plasma effect backgrounds using GPU shaders.
 * The organic, flowing patterns are perfect for creative, music, or abstract videos.
 *
 * @example
 * ```tsx
 * // Classic neon plasma
 * <PlasmaBackground
 *   color1="#ff0080"
 *   color2="#7928ca"
 *   color3="#0070f3"
 *   complexity={5}
 * />
 *
 * // Liquid style with custom colors
 * <PlasmaBackground
 *   plasmaStyle="liquid"
 *   color1="#00ff88"
 *   color2="#0088ff"
 *   color3="#8800ff"
 *   speed={0.5}
 * />
 *
 * // Electric fast-moving plasma
 * <PlasmaBackground
 *   plasmaStyle="electric"
 *   color1="#ffff00"
 *   color2="#ff8800"
 *   color3="#ff0000"
 *   speed={2}
 *   complexity={8}
 * />
 * ```
 */
export const PlasmaBackground = ({
  color1 = "#ff0080",
  color2 = "#7928ca",
  color3 = "#0070f3",
  backgroundColor = "#000000",
  complexity = 5,
  speed = 1,
  scale = 1,
  plasmaStyle = "classic",
  intensity = 1,
  width = 1920,
  height = 1080,
  pixelRatio = 1,
  className,
  style,
}: PlasmaBackgroundProps) => {
  const fragmentShader = useMemo(
    () => generatePlasmaShader(plasmaStyle),
    [plasmaStyle]
  );

  const uniforms = useMemo(
    () => ({
      u_color1: hexToRgb(color1),
      u_color2: hexToRgb(color2),
      u_color3: hexToRgb(color3),
      u_bgColor: hexToRgb(backgroundColor),
      u_complexity: complexity,
      u_scale: scale,
      u_intensity: intensity,
    }),
    [color1, color2, color3, backgroundColor, complexity, scale, intensity]
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
