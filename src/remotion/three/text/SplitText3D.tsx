import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  delayRender,
  continueRender,
} from "remotion";
import { Text } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef } from "react";
import opentype from "opentype.js";

// ============================================================================
// FONT LOADING WITH OPENTYPE.JS + GOOGLE FONTS SUPPORT
// ============================================================================

// Global font cache to avoid reloading
const fontCache: Map<string, opentype.Font> = new Map();

// Cache for resolved Google Font URLs
const googleFontUrlCache: Map<string, string> = new Map();

/**
 * Google Font weight mapping
 */
export type GoogleFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Google Font configuration
 */
export interface GoogleFontConfig {
  family: string;
  weight?: GoogleFontWeight;
  italic?: boolean;
}

/**
 * Fetches the TTF URL for a Google Font
 * Google Fonts serves TTF when requested with an older user-agent
 * 
 * @example
 * const url = await getGoogleFontTTFUrl({ family: "Inter", weight: 700 });
 * // Returns: "https://fonts.gstatic.com/s/inter/v13/..."
 */
export const getGoogleFontTTFUrl = async (
  config: GoogleFontConfig
): Promise<string> => {
  const { family, weight = 400, italic = false } = config;
  const cacheKey = `${family}:${weight}:${italic}`;
  
  // Check cache first
  if (googleFontUrlCache.has(cacheKey)) {
    return googleFontUrlCache.get(cacheKey)!;
  }
  
  // Build the Google Fonts CSS API URL
  // Format: family=Inter:wght@700 or family=Inter:ital,wght@1,700 for italic
  const weightSpec = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const apiUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${weightSpec}&display=swap`;
  
  // Fetch with a user-agent that triggers TTF response
  // Using an older Safari user-agent that doesn't support WOFF2
  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent": "Safari/537.36",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Font CSS: ${response.statusText}`);
  }
  
  const css = await response.text();
  
  // Extract the font URL from the CSS
  // The CSS contains: src: url(...) format('truetype')
  const ttfMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);
  
  if (ttfMatch && ttfMatch[1]) {
    const url = ttfMatch[1];
    googleFontUrlCache.set(cacheKey, url);
    return url;
  }
  
  // Fallback: try to find any font URL (might be woff2, which won't work with opentype.js)
  const anyUrlMatch = css.match(/src:\s*url\(([^)]+)\)/);
  if (anyUrlMatch && anyUrlMatch[1]) {
    console.warn(
      `Google Font "${family}" TTF not available, got different format. ` +
      `Consider using a local TTF file for accurate metrics.`
    );
    const url = anyUrlMatch[1];
    googleFontUrlCache.set(cacheKey, url);
    return url;
  }
  
  throw new Error(`Could not extract font URL from Google Fonts CSS for "${family}"`);
};

/**
 * Hook to load a Google Font with opentype.js
 * Automatically fetches the TTF version for accurate metrics
 * 
 * @example
 * const font = useGoogleFont({ family: "Inter", weight: 700 });
 */
export const useGoogleFont = (config: GoogleFontConfig): {
  font: opentype.Font | null;
  fontUrl: string | null;
  loading: boolean;
  error: string | null;
} => {
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const configKey = `${config.family}:${config.weight || 400}:${config.italic || false}`;
  const handleRef = useRef<number | null>(null);
  const currentConfigRef = useRef<string>(configKey);

  useEffect(() => {
    currentConfigRef.current = configKey;
    setLoading(true);
    setError(null);
    
    const handle = delayRender(`Loading Google Font: ${config.family}`);
    handleRef.current = handle;
    
    const loadFont = async () => {
      try {
        // Get TTF URL from Google Fonts
        const url = await getGoogleFontTTFUrl(config);
        
        // Check if config changed while fetching
        if (currentConfigRef.current !== configKey) {
          continueRender(handle);
          return;
        }
        
        setFontUrl(url);
        
        // Check if already in cache
        if (fontCache.has(url)) {
          setFont(fontCache.get(url)!);
          setLoading(false);
          continueRender(handle);
          return;
        }
        
        // Load with opentype.js
        opentype.load(url, (err, loadedFont) => {
          if (currentConfigRef.current !== configKey) {
            continueRender(handle);
            return;
          }
          
          if (err || !loadedFont) {
            setError(`Failed to parse font: ${err?.message || "Unknown error"}`);
            setLoading(false);
            continueRender(handle);
            return;
          }
          
          fontCache.set(url, loadedFont);
          setFont(loadedFont);
          setLoading(false);
          continueRender(handle);
        });
      } catch (err) {
        if (currentConfigRef.current !== configKey) {
          continueRender(handle);
          return;
        }
        
        setError(err instanceof Error ? err.message : "Failed to load font");
        setLoading(false);
        continueRender(handle);
      }
    };
    
    loadFont();
    
    return () => {
      if (handleRef.current === handle) {
        continueRender(handle);
      }
    };
  }, [configKey, config.family, config.weight, config.italic]);
  
  return { font, fontUrl, loading, error };
};

/**
 * Hook to load a font with opentype.js for accurate text metrics
 * Supports both local TTF files and URLs
 * Uses Remotion's delayRender/continueRender to wait for font loading
 * 
 * @example
 * // Local file
 * const font = useOpenTypeFont(staticFile("fonts/Inter-Bold.ttf"));
 * 
 * // Remote URL (must be TTF/OTF - WOFF2 not supported by opentype.js)
 * const font = useOpenTypeFont("https://example.com/font.ttf");
 */
export const useOpenTypeFont = (fontUrl: string): opentype.Font | null => {
  const [font, setFont] = useState<opentype.Font | null>(
    () => fontCache.get(fontUrl) || null
  );
  
  // Track if we've already continued render for this font URL
  const continuedRef = useRef<string | null>(null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    // If already have this font loaded, no need to delay
    if (fontCache.has(fontUrl)) {
      setFont(fontCache.get(fontUrl)!);
      return;
    }

    // Create a new delay handle for this font URL
    const handle = delayRender(`Loading font: ${fontUrl}`);
    handleRef.current = handle;
    continuedRef.current = null;

    // Load the font
    opentype.load(fontUrl, (err, loadedFont) => {
      // Check if this is still the current request (fontUrl might have changed)
      if (handleRef.current !== handle) {
        // A newer request superseded this one, just continue the old handle
        continueRender(handle);
        return;
      }

      if (err || !loadedFont) {
        console.error("Failed to load font:", err);
        continueRender(handle);
        continuedRef.current = fontUrl;
        return;
      }

      fontCache.set(fontUrl, loadedFont);
      setFont(loadedFont);
      continueRender(handle);
      continuedRef.current = fontUrl;
    });

    // Cleanup: if effect re-runs before load completes, continue the old handle
    return () => {
      if (handleRef.current === handle && continuedRef.current !== fontUrl) {
        continueRender(handle);
      }
    };
  }, [fontUrl]);

  return font;
};

/**
 * Calculate text metrics using opentype.js
 * Returns character positions with proper kerning
 */
export const getTextMetrics = (
  font: opentype.Font,
  text: string,
  fontSize: number
): {
  chars: { char: string; width: number; xPosition: number }[];
  totalWidth: number;
} => {
  const scale = fontSize / font.unitsPerEm;
  const chars: { char: string; width: number; xPosition: number }[] = [];

  let currentX = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const glyph = font.charToGlyph(char);
    const advanceWidth = (glyph.advanceWidth || 0) * scale;

    chars.push({
      char,
      width: advanceWidth,
      xPosition: currentX + advanceWidth / 2, // Center of character
    });

    currentX += advanceWidth;

    // Apply kerning if available
    if (i < text.length - 1) {
      const nextGlyph = font.charToGlyph(text[i + 1]);
      const kerning = font.getKerningValue(glyph, nextGlyph) * scale;
      currentX += kerning;
    }
  }

  const totalWidth = currentX;

  // Center all characters
  const offsetX = -totalWidth / 2;
  chars.forEach((c) => {
    c.xPosition += offsetX;
  });

  return { chars, totalWidth };
};

// ============================================================================
// ANIMATION PRESETS - Professional text animation configurations
// ============================================================================

export type AnimationPreset =
  | "fadeUp"
  | "fadeDown"
  | "scaleUp"
  | "rotateIn"
  | "wave"
  | "typewriter"
  | "elastic"
  | "cascade"
  | "spiral"
  | "glitch";

export interface AnimationConfig {
  // Position offsets
  yOffset?: { from: number; to: number };
  xOffset?: { from: number; to: number };
  zOffset?: { from: number; to: number };
  // Rotation (in radians)
  rotationX?: { from: number; to: number };
  rotationY?: { from: number; to: number };
  rotationZ?: { from: number; to: number };
  // Scale
  scale?: { from: number; to: number };
  // Opacity
  opacity?: { from: number; to: number };
  // Spring config
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  // Stagger delay per character (in frames)
  staggerDelay?: number;
}

export const ANIMATION_PRESETS: Record<AnimationPreset, AnimationConfig> = {
  fadeUp: {
    yOffset: { from: -1, to: 0 },
    opacity: { from: 0, to: 1 },
    rotationX: { from: Math.PI / 6, to: 0 },
    springConfig: { damping: 80, stiffness: 150, mass: 0.8 },
    staggerDelay: 2,
  },
  fadeDown: {
    yOffset: { from: 1, to: 0 },
    opacity: { from: 0, to: 1 },
    rotationX: { from: -Math.PI / 6, to: 0 },
    springConfig: { damping: 80, stiffness: 150, mass: 0.8 },
    staggerDelay: 2,
  },
  scaleUp: {
    scale: { from: 0, to: 1 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 60, stiffness: 200, mass: 0.5 },
    staggerDelay: 1.5,
  },
  rotateIn: {
    rotationY: { from: Math.PI / 2, to: 0 },
    rotationZ: { from: Math.PI / 8, to: 0 },
    opacity: { from: 0, to: 1 },
    scale: { from: 0.5, to: 1 },
    springConfig: { damping: 70, stiffness: 120, mass: 1 },
    staggerDelay: 2.5,
  },
  wave: {
    yOffset: { from: -0.5, to: 0 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 40, stiffness: 300, mass: 0.3 },
    staggerDelay: 1,
  },
  typewriter: {
    opacity: { from: 0, to: 1 },
    scale: { from: 1.2, to: 1 },
    springConfig: { damping: 100, stiffness: 400, mass: 0.2 },
    staggerDelay: 1.5,
  },
  elastic: {
    scale: { from: 0, to: 1 },
    rotationZ: { from: Math.PI / 4, to: 0 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 15, stiffness: 150, mass: 0.8 },
    staggerDelay: 2,
  },
  cascade: {
    yOffset: { from: 2, to: 0 },
    zOffset: { from: -2, to: 0 },
    rotationX: { from: -Math.PI / 3, to: 0 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 50, stiffness: 100, mass: 1.2 },
    staggerDelay: 3,
  },
  spiral: {
    rotationZ: { from: Math.PI * 2, to: 0 },
    scale: { from: 0, to: 1 },
    zOffset: { from: -3, to: 0 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 60, stiffness: 80, mass: 1 },
    staggerDelay: 2,
  },
  glitch: {
    xOffset: { from: 0.3, to: 0 },
    opacity: { from: 0, to: 1 },
    springConfig: { damping: 100, stiffness: 500, mass: 0.1 },
    staggerDelay: 0.5,
  },
};

// ============================================================================
// SPLIT TEXT 3D COMPONENT
// ============================================================================

export interface SplitText3DProps {
  /** The text to animate */
  text: string;
  /** Font URL (use staticFile for local fonts) */
  fontUrl: string;
  /** Position in 3D space */
  position?: [number, number, number];
  /** Text color */
  color?: string;
  /** Font size in 3D units */
  fontSize?: number;
  /** Additional letter spacing (multiplied by fontSize) */
  letterSpacing?: number;
  /** Delay before animation starts (in frames) */
  delay?: number;
  /** Animation preset name */
  preset?: AnimationPreset;
  /** Custom animation config (overrides preset values) */
  customAnimation?: Partial<AnimationConfig>;
  /** Function to determine color per character */
  charColor?: (char: string, index: number, total: number) => string;
  /** Continuous animation after entrance */
  continuousAnimation?: {
    wave?: { amplitude: number; frequency: number };
    float?: { amplitude: number; frequency: number };
    pulse?: { min: number; max: number; frequency: number };
  };
}

// Individual character component
const AnimatedChar: React.FC<{
  char: string;
  index: number;
  totalChars: number;
  xPosition: number;
  basePosition: [number, number, number];
  fontSize: number;
  color: string;
  fontUrl: string;
  delay: number;
  animation: AnimationConfig;
  continuousAnimation?: SplitText3DProps["continuousAnimation"];
}> = ({
  char,
  index,
  totalChars,
  xPosition,
  basePosition,
  fontSize,
  color,
  fontUrl,
  delay,
  animation,
  continuousAnimation,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate stagger delay for this character
  const charDelay = delay + index * (animation.staggerDelay || 2);

  // Spring animation progress
  const progress = spring({
    fps,
    frame,
    config: animation.springConfig || { damping: 80, stiffness: 150, mass: 0.8 },
    delay: charDelay,
  });

  // Calculate animated values
  const yOffset = animation.yOffset
    ? interpolate(progress, [0, 1], [animation.yOffset.from, animation.yOffset.to])
    : 0;

  const xOffset = animation.xOffset
    ? interpolate(progress, [0, 1], [animation.xOffset.from, animation.xOffset.to])
    : 0;

  const zOffset = animation.zOffset
    ? interpolate(progress, [0, 1], [animation.zOffset.from, animation.zOffset.to])
    : 0;

  const rotationX = animation.rotationX
    ? interpolate(
        progress,
        [0, 1],
        [animation.rotationX.from, animation.rotationX.to]
      )
    : 0;

  const rotationY = animation.rotationY
    ? interpolate(
        progress,
        [0, 1],
        [animation.rotationY.from, animation.rotationY.to]
      )
    : 0;

  const rotationZ = animation.rotationZ
    ? interpolate(
        progress,
        [0, 1],
        [animation.rotationZ.from, animation.rotationZ.to]
      )
    : 0;

  const scale = animation.scale
    ? interpolate(progress, [0, 1], [animation.scale.from, animation.scale.to])
    : 1;

  const opacity = animation.opacity
    ? interpolate(progress, [0, 1], [animation.opacity.from, animation.opacity.to])
    : 1;

  // Continuous animations (after entrance)
  let continuousY = 0;
  let continuousScale = 1;

  if (continuousAnimation && progress > 0.9) {
    const time = frame / fps;

    if (continuousAnimation.wave) {
      const { amplitude, frequency } = continuousAnimation.wave;
      continuousY = Math.sin(time * frequency + index * 0.5) * amplitude;
    }

    if (continuousAnimation.float) {
      const { amplitude, frequency } = continuousAnimation.float;
      continuousY += Math.sin(time * frequency) * amplitude;
    }

    if (continuousAnimation.pulse) {
      const { min, max, frequency } = continuousAnimation.pulse;
      const pulseProgress = (Math.sin(time * frequency + index * 0.3) + 1) / 2;
      continuousScale = interpolate(pulseProgress, [0, 1], [min, max]);
    }
  }

  // Skip rendering spaces as 3D text (but keep spacing)
  if (char === " ") {
    return null;
  }

  return (
    <Text
      position={[
        basePosition[0] + xPosition + xOffset,
        basePosition[1] + yOffset + continuousY,
        basePosition[2] + zOffset,
      ]}
      rotation={[rotationX, rotationY, rotationZ]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={opacity}
      font={fontUrl}
      scale={scale * continuousScale}
    >
      {char}
    </Text>
  );
};

/**
 * SplitText3D - Professional 3D text animation component
 *
 * Uses opentype.js for accurate character positioning with kerning.
 * Supports multiple animation presets and continuous animations.
 *
 * @example
 * ```tsx
 * <SplitText3D
 *   text="Hello World"
 *   fontUrl={staticFile("fonts/Inter-Bold.ttf")}
 *   preset="elastic"
 *   charColor={(char, i, total) => `hsl(${(i / total) * 360}, 80%, 65%)`}
 * />
 * ```
 */
export const SplitText3D: React.FC<SplitText3DProps> = ({
  text,
  fontUrl,
  position = [0, 0, 0],
  color = "#ffffff",
  fontSize = 1,
  letterSpacing = 0,
  delay = 0,
  preset = "fadeUp",
  customAnimation,
  charColor,
  continuousAnimation,
}) => {
  // Load font with opentype.js for accurate metrics
  const font = useOpenTypeFont(fontUrl);

  // Get animation config (preset + custom overrides)
  const animation: AnimationConfig = {
    ...ANIMATION_PRESETS[preset],
    ...customAnimation,
  };

  // Calculate character positions using opentype metrics
  const characters = useMemo(() => {
    if (!font) return [];

    const { chars } = getTextMetrics(font, text, fontSize);

    // Apply additional letter spacing if specified
    if (letterSpacing !== 0) {
      let offset = 0;
      return chars.map((c, index) => {
        const adjustedX = c.xPosition + offset;
        offset += letterSpacing * fontSize;
        return {
          char: c.char,
          index,
          xPosition: adjustedX - (offset - letterSpacing * fontSize) / 2, // Re-center
        };
      });
    }

    return chars.map((c, index) => ({
      char: c.char,
      index,
      xPosition: c.xPosition,
    }));
  }, [font, text, fontSize, letterSpacing]);

  // Don't render until font is loaded
  if (!font) {
    return null;
  }

  return (
    <group>
      {characters.map(({ char, index, xPosition }) => (
        <AnimatedChar
          key={`${index}-${char}`}
          char={char}
          index={index}
          totalChars={characters.length}
          xPosition={xPosition}
          basePosition={position}
          fontSize={fontSize}
          fontUrl={fontUrl}
          color={charColor ? charColor(char, index, characters.length) : color}
          delay={delay}
          animation={animation}
          continuousAnimation={continuousAnimation}
        />
      ))}
    </group>
  );
};
