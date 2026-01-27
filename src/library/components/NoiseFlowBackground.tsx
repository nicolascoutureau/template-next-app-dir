import type { CSSProperties } from "react";
import { useMemo } from "react";
import { ShaderPlane } from "./ShaderPlane";

/**
 * Noise pattern type.
 */
export type NoisePattern = "flow" | "turbulence" | "ridged" | "billowy" | "warp" | "cells";

/**
 * Props for the `NoiseFlowBackground` component.
 */
export type NoiseFlowBackgroundProps = {
  /** Primary color (hex). Defaults to "#0070f3". */
  color1?: string;
  /** Secondary color (hex). Defaults to "#7928ca". */
  color2?: string;
  /** Background color (hex). Defaults to "#000000". */
  backgroundColor?: string;
  /** Noise pattern type. Defaults to "flow". */
  pattern?: NoisePattern;
  /** Scale of the noise (higher = more zoomed in). Defaults to 3. */
  scale?: number;
  /** Number of noise octaves (1-8). More = more detail. Defaults to 4. */
  octaves?: number;
  /** How much detail decreases per octave (0-1). Defaults to 0.5. */
  persistence?: number;
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number;
  /** Flow direction angle in degrees. Defaults to 45. */
  flowAngle?: number;
  /** Color contrast (0-2). Defaults to 1. */
  contrast?: number;
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
  return [0, 0.44, 0.95]; // Fallback blue
}

/**
 * Generates noise pattern calculation GLSL code.
 */
function getPatternCode(pattern: NoisePattern): string {
  const patterns: Record<NoisePattern, string> = {
    flow: `
      vec2 flowDir = vec2(cos(u_flowAngle), sin(u_flowAngle));
      vec2 animPos = pos + flowDir * u_time * 0.5;
      n = fbm(animPos);
      n = smoothstep(0.2, 0.8, n);
    `,
    turbulence: `
      vec2 animPos = pos;
      animPos.x += sin(pos.y * 2.0 + u_time) * 0.3;
      animPos.y += cos(pos.x * 2.0 + u_time * 0.7) * 0.3;
      n = fbm(animPos);
      n = abs(n * 2.0 - 1.0);
    `,
    ridged: `
      vec2 animPos = pos + vec2(u_time * 0.2, u_time * 0.15);
      n = 1.0 - abs(fbm(animPos) * 2.0 - 1.0);
      n = pow(n, 2.0);
    `,
    billowy: `
      vec2 animPos = pos + vec2(sin(u_time * 0.3) * 0.5, u_time * 0.2);
      n = fbm(animPos);
      n = n * n;
      n = smoothstep(0.1, 0.9, n);
    `,
    warp: `
      vec2 q = vec2(fbm(pos + vec2(0.0, 0.0) + u_time * 0.1),
                    fbm(pos + vec2(5.2, 1.3) + u_time * 0.12));
      vec2 r = vec2(fbm(pos + 4.0 * q + vec2(1.7, 9.2) + u_time * 0.08),
                    fbm(pos + 4.0 * q + vec2(8.3, 2.8) + u_time * 0.1));
      n = fbm(pos + 4.0 * r);
      n = smoothstep(0.0, 1.0, n);
    `,
    cells: `
      vec2 animPos = pos + u_time * 0.15;
      float n2 = fbm(animPos * 2.0 + vec2(100.0));
      n = fbm(animPos * 2.0);
      n = length(vec2(n, n2) - 0.5) * 2.0;
      n = 1.0 - smoothstep(0.0, 0.7, n);
    `,
  };

  return patterns[pattern];
}

/**
 * Generates the fragment shader with simplex noise.
 */
function generateNoiseShader(pattern: NoisePattern, octaves: number): string {
  // Unroll the FBM loop at compile time for WebGL 1.0 compatibility
  const fbmOctaves = Math.min(Math.max(Math.floor(octaves), 1), 8);
  let fbmLoop = "";
  for (let i = 0; i < fbmOctaves; i++) {
    fbmLoop += `
      value += amplitude * noise(p * frequency);
      amplitude *= u_persistence;
      frequency *= 2.0;`;
  }

  return `
    precision highp float;
    
    varying vec2 v_uv;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_bgColor;
    uniform float u_scale;
    uniform float u_persistence;
    uniform float u_flowAngle;
    uniform float u_contrast;
    
    // Hash function for pseudo-random values
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    
    // Smooth value noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      
      // Quintic interpolation for smoother results
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      
      // Sample four corners
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      // Bilinear interpolation
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    
    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      ${fbmLoop}
      return value;
    }
    
    void main() {
      // Centered and scaled coordinates
      vec2 pos = (v_uv - 0.5) * u_scale;
      pos.x *= u_resolution.x / u_resolution.y;
      
      float n;
      ${getPatternCode(pattern)}
      
      // Apply contrast
      n = pow(n, 1.0 / u_contrast);
      
      // Color gradient based on noise value
      vec3 color = mix(u_bgColor, u_color1, n);
      color = mix(color, u_color2, smoothstep(0.4, 0.9, n));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

/**
 * `NoiseFlowBackground` creates flowing, organic noise patterns using GPU-accelerated
 * simplex noise with fractal brownian motion. Perfect for abstract, cinematic,
 * or atmospheric backgrounds.
 *
 * @example
 * ```tsx
 * // Smooth flowing noise
 * <NoiseFlowBackground
 *   color1="#0070f3"
 *   color2="#7928ca"
 *   pattern="flow"
 *   scale={3}
 * />
 *
 * // Turbulent storm-like effect
 * <NoiseFlowBackground
 *   pattern="turbulence"
 *   color1="#1a1a2e"
 *   color2="#4a00e0"
 *   octaves={6}
 *   speed={1.5}
 * />
 *
 * // Domain-warped abstract
 * <NoiseFlowBackground
 *   pattern="warp"
 *   color1="#ff6b6b"
 *   color2="#feca57"
 *   backgroundColor="#1a1a2e"
 *   speed={0.5}
 * />
 *
 * // Ridged mountainous texture
 * <NoiseFlowBackground
 *   pattern="ridged"
 *   color1="#2d3436"
 *   color2="#74b9ff"
 *   contrast={1.5}
 * />
 * ```
 */
export const NoiseFlowBackground = ({
  color1 = "#0070f3",
  color2 = "#7928ca",
  backgroundColor = "#000000",
  pattern = "flow",
  scale = 3,
  octaves = 4,
  persistence = 0.5,
  speed = 1,
  flowAngle = 45,
  contrast = 1,
  width = 1920,
  height = 1080,
  pixelRatio = 1,
  className,
  style,
}: NoiseFlowBackgroundProps) => {
  // Shader is regenerated when pattern or octaves change (octaves affects loop unrolling)
  const fragmentShader = useMemo(
    () => generateNoiseShader(pattern, octaves),
    [pattern, octaves]
  );

  const uniforms = useMemo(
    () => ({
      u_color1: hexToRgb(color1),
      u_color2: hexToRgb(color2),
      u_bgColor: hexToRgb(backgroundColor),
      u_scale: scale,
      u_persistence: persistence,
      u_flowAngle: (flowAngle * Math.PI) / 180,
      u_contrast: contrast,
    }),
    [color1, color2, backgroundColor, scale, persistence, flowAngle, contrast]
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
