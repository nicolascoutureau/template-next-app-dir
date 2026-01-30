import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

/**
 * Premium ambiance preset types.
 */
export type AmbiancePreset =
  | "midnight"
  | "aurora"
  | "sunset"
  | "ocean"
  | "lavender"
  | "ember"
  | "forest"
  | "cosmic"
  | "minimal"
  | "warm"
  | "cool"
  // Light/soft presets
  | "softPink"
  | "softLavender"
  | "softCloud"
  | "softPeach"
  | "softMint"
  | "softSky";

/**
 * Props for AmbianceBackground component.
 */
export interface AmbianceBackgroundProps {
  children?: ReactNode;
  /** Preset style */
  preset?: AmbiancePreset;
  /** Custom primary color */
  primaryColor?: string;
  /** Custom secondary color */
  secondaryColor?: string;
  /** Custom accent color */
  accentColor?: string;
  /** Animation speed (0 = static, 1 = normal) */
  speed?: number;
  /** Show grain/noise texture */
  grain?: boolean;
  /** Grain opacity (0-1) */
  grainOpacity?: number;
  /** Show vignette */
  vignette?: boolean;
  /** Vignette intensity (0-1) */
  vignetteIntensity?: number;
  /** Show light rays */
  rays?: boolean;
  /** Overall brightness adjustment */
  brightness?: number;
  /** Seed for consistent randomness */
  seed?: string;
  /** Additional styles */
  style?: CSSProperties;
  className?: string;
}

/**
 * Premium color palettes with proper color theory.
 */
const presets: Record<
  AmbiancePreset,
  {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
    mode: "dark" | "light";
  }
> = {
  midnight: {
    bg: "#030014",
    primary: "#1e1b4b",
    secondary: "#312e81",
    accent: "#6366f1",
    mode: "dark",
  },
  aurora: {
    bg: "#020617",
    primary: "#0f766e",
    secondary: "#6366f1",
    accent: "#22d3ee",
    mode: "dark",
  },
  sunset: {
    bg: "#18181b",
    primary: "#9f1239",
    secondary: "#c2410c",
    accent: "#fbbf24",
    mode: "dark",
  },
  ocean: {
    bg: "#020617",
    primary: "#0c4a6e",
    secondary: "#0891b2",
    accent: "#06b6d4",
    mode: "dark",
  },
  lavender: {
    bg: "#0f0720",
    primary: "#581c87",
    secondary: "#7c3aed",
    accent: "#c4b5fd",
    mode: "dark",
  },
  ember: {
    bg: "#0c0a09",
    primary: "#7c2d12",
    secondary: "#c2410c",
    accent: "#fb923c",
    mode: "dark",
  },
  forest: {
    bg: "#052e16",
    primary: "#14532d",
    secondary: "#166534",
    accent: "#4ade80",
    mode: "dark",
  },
  cosmic: {
    bg: "#09090b",
    primary: "#4c1d95",
    secondary: "#be185d",
    accent: "#f472b6",
    mode: "dark",
  },
  minimal: {
    bg: "#fafafa",
    primary: "#e4e4e7",
    secondary: "#d4d4d8",
    accent: "#a1a1aa",
    mode: "light",
  },
  warm: {
    bg: "#fffbeb",
    primary: "#fef3c7",
    secondary: "#fde68a",
    accent: "#fbbf24",
    mode: "light",
  },
  cool: {
    bg: "#f0f9ff",
    primary: "#e0f2fe",
    secondary: "#bae6fd",
    accent: "#38bdf8",
    mode: "light",
  },
  // Soft/Dreamy light presets
  softPink: {
    bg: "#fefcfd",
    primary: "#fce7f3",
    secondary: "#f5d0fe",
    accent: "#e879f9",
    mode: "light",
  },
  softLavender: {
    bg: "#fdfcff",
    primary: "#f3e8ff",
    secondary: "#e9d5ff",
    accent: "#c4b5fd",
    mode: "light",
  },
  softCloud: {
    bg: "#ffffff",
    primary: "#f1f5f9",
    secondary: "#e2e8f0",
    accent: "#cbd5e1",
    mode: "light",
  },
  softPeach: {
    bg: "#fffcfa",
    primary: "#ffedd5",
    secondary: "#fed7aa",
    accent: "#fdba74",
    mode: "light",
  },
  softMint: {
    bg: "#f9fefc",
    primary: "#d1fae5",
    secondary: "#a7f3d0",
    accent: "#6ee7b7",
    mode: "light",
  },
  softSky: {
    bg: "#f8fcff",
    primary: "#e0f2fe",
    secondary: "#bae6fd",
    accent: "#7dd3fc",
    mode: "light",
  },
};

/**
 * Premium ambient background with sophisticated gradients and effects.
 */
export const AmbianceBackground: React.FC<AmbianceBackgroundProps> = ({
  children,
  preset = "midnight",
  primaryColor,
  secondaryColor,
  accentColor,
  speed = 0.3,
  grain = true,
  grainOpacity = 0.03,
  vignette = true,
  vignetteIntensity = 0.4,
  rays = false,
  brightness = 1,
  seed = "ambiance",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = (frame / fps) * speed;
  const palette = presets[preset];

  const colors = {
    bg: palette.bg,
    primary: primaryColor ?? palette.primary,
    secondary: secondaryColor ?? palette.secondary,
    accent: accentColor ?? palette.accent,
  };

  // Smooth animation functions
  const smoothSin = (t: number, phase: number = 0) =>
    Math.sin(t + phase) * 0.5 + 0.5;

  const smoothCos = (t: number, phase: number = 0) =>
    Math.cos(t + phase) * 0.5 + 0.5;

  // Animated gradient positions
  const gradientPositions = useMemo(
    () => ({
      // Primary blob - slow, large movement
      primary: {
        x: 20 + smoothSin(time * 0.5, 0) * 30,
        y: 20 + smoothCos(time * 0.4, 1) * 30,
        scale: 0.9 + smoothSin(time * 0.3, 2) * 0.2,
      },
      // Secondary blob - medium movement
      secondary: {
        x: 60 + smoothSin(time * 0.6, 3) * 25,
        y: 50 + smoothCos(time * 0.5, 4) * 25,
        scale: 0.85 + smoothCos(time * 0.4, 5) * 0.3,
      },
      // Accent blob - faster, smaller movement
      accent: {
        x: 75 + smoothSin(time * 0.8, 6) * 20,
        y: 70 + smoothCos(time * 0.7, 7) * 20,
        scale: 0.7 + smoothSin(time * 0.5, 8) * 0.3,
      },
      // Extra atmospheric blobs
      extra1: {
        x: 40 + smoothCos(time * 0.3, 9) * 35,
        y: 80 + smoothSin(time * 0.35, 10) * 15,
        scale: 0.6 + smoothCos(time * 0.25, 11) * 0.2,
      },
      extra2: {
        x: 85 + smoothSin(time * 0.45, 12) * 15,
        y: 25 + smoothCos(time * 0.4, 13) * 20,
        scale: 0.5 + smoothSin(time * 0.35, 14) * 0.2,
      },
    }),
    [time],
  );

  // Light ray animation
  const rayAngle = time * 20;

  return (
    <AbsoluteFill
      className={className}
      style={{
        background: colors.bg,
        filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
        ...style,
      }}
    >
      {/* Base gradient layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${colors.primary}40 0%, transparent 70%)`,
        }}
      />

      {/* Primary gradient blob */}
      <div
        style={{
          position: "absolute",
          left: `${gradientPositions.primary.x}%`,
          top: `${gradientPositions.primary.y}%`,
          width: "70%",
          height: "70%",
          background: `radial-gradient(ellipse at center, ${colors.primary} 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${gradientPositions.primary.scale})`,
          opacity: 0.6,
          filter: "blur(80px)",
        }}
      />

      {/* Secondary gradient blob */}
      <div
        style={{
          position: "absolute",
          left: `${gradientPositions.secondary.x}%`,
          top: `${gradientPositions.secondary.y}%`,
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse at center, ${colors.secondary} 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${gradientPositions.secondary.scale})`,
          opacity: 0.5,
          filter: "blur(60px)",
          mixBlendMode: palette.mode === "dark" ? "screen" : "multiply",
        }}
      />

      {/* Accent gradient blob */}
      <div
        style={{
          position: "absolute",
          left: `${gradientPositions.accent.x}%`,
          top: `${gradientPositions.accent.y}%`,
          width: "45%",
          height: "45%",
          background: `radial-gradient(ellipse at center, ${colors.accent} 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${gradientPositions.accent.scale})`,
          opacity: 0.4,
          filter: "blur(50px)",
          mixBlendMode: palette.mode === "dark" ? "screen" : "multiply",
        }}
      />

      {/* Extra atmospheric layers */}
      <div
        style={{
          position: "absolute",
          left: `${gradientPositions.extra1.x}%`,
          top: `${gradientPositions.extra1.y}%`,
          width: "50%",
          height: "40%",
          background: `radial-gradient(ellipse at center, ${colors.primary}80 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${gradientPositions.extra1.scale})`,
          opacity: 0.3,
          filter: "blur(70px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: `${gradientPositions.extra2.x}%`,
          top: `${gradientPositions.extra2.y}%`,
          width: "35%",
          height: "35%",
          background: `radial-gradient(ellipse at center, ${colors.accent}60 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${gradientPositions.extra2.scale})`,
          opacity: 0.25,
          filter: "blur(40px)",
        }}
      />

      {/* Light rays */}
      {rays && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `conic-gradient(from ${rayAngle}deg at 50% 0%, transparent 0deg, ${colors.accent}10 10deg, transparent 20deg, transparent 40deg, ${colors.accent}08 50deg, transparent 60deg, transparent 80deg, ${colors.accent}05 90deg, transparent 100deg, transparent 340deg, ${colors.accent}10 350deg, transparent 360deg)`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Vignette */}
      {vignette && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 40%, ${colors.bg} 100%)`,
            opacity: vignetteIntensity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Film grain texture */}
      {grain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: grainOpacity,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Content */}
      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * Props for GradientOrbs - simpler animated orbs.
 */
export interface GradientOrbsProps {
  children?: ReactNode;
  colors?: string[];
  background?: string;
  count?: number;
  blur?: number;
  speed?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * Simple floating gradient orbs.
 */
export const GradientOrbs: React.FC<GradientOrbsProps> = ({
  children,
  colors = ["#667eea", "#764ba2", "#ec4899"],
  background = "#030014",
  count = 3,
  blur = 80,
  speed = 0.3,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = (frame / fps) * speed;

  const orbs = useMemo(() => {
    return colors.slice(0, count).map((color, i) => {
      const baseAngle = (i / count) * Math.PI * 2;
      const radius = 20 + i * 5;
      const x = 50 + Math.cos(time + baseAngle) * radius;
      const y = 50 + Math.sin(time * 0.8 + baseAngle) * radius;
      const size = 40 + i * 10;
      const opacity = 0.6 - i * 0.1;

      return { color, x, y, size, opacity };
    });
  }, [colors, count, time]);

  return (
    <AbsoluteFill className={className} style={{ background, ...style }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}%`,
            height: `${orb.size}%`,
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: `blur(${blur}px)`,
            opacity: orb.opacity,
            mixBlendMode: "screen",
          }}
        />
      ))}

      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </AbsoluteFill>
  );
};

export default AmbianceBackground;
