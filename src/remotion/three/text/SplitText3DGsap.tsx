import { useCurrentFrame, useVideoConfig } from "remotion";
import { Text } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useOpenTypeFont, getTextMetrics } from "./SplitText3D";

// ============================================================================
// TYPES
// ============================================================================

export type SplitType = "chars" | "words" | "lines" | "chars,words";

/** Animation state for individual characters */
export interface CharAnimationState {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  opacity: number;
}

/** Animation state for words (applies to all chars in the word) */
export interface WordAnimationState {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  opacity: number;
}

/** Word data with animation state and its characters */
export interface WordData {
  word: string;
  /** Word-level animation state (applies to all chars) */
  state: WordAnimationState;
  /** Character-level animation states */
  chars: CharAnimationState[];
}

export interface SplitText3DGsapProps {
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
  /** Split type: 'chars', 'words', 'lines', or 'chars,words' */
  splitType?: SplitType;
  /** Function to determine color per character */
  charColor?: (char: string, index: number, total: number) => string;
  /** 
   * Function to create the GSAP timeline
   * Similar to GSAP SplitText - animate words and chars independently!
   */
  createTimeline: (params: {
    tl: gsap.core.Timeline;
    /** All character animation states (flat array) */
    chars: CharAnimationState[];
    /** Word animation states (animate these to move entire words) */
    words: WordData[];
    text: string;
  }) => gsap.core.Timeline;
}

// ============================================================================
// ANIMATED CHARACTER COMPONENT
// ============================================================================

const AnimatedChar: React.FC<{
  char: string;
  xPosition: number;
  basePosition: [number, number, number];
  fontSize: number;
  color: string;
  fontUrl: string;
  charState: CharAnimationState;
  wordState: WordAnimationState;
}> = ({ char, xPosition, basePosition, fontSize, color, fontUrl, charState, wordState }) => {
  // Skip rendering spaces as 3D text
  if (char === " ") {
    return null;
  }

  // Combine word-level and char-level transforms
  const combinedX = charState.x + wordState.x;
  const combinedY = charState.y + wordState.y;
  const combinedZ = charState.z + wordState.z;
  const combinedRotX = charState.rotationX + wordState.rotationX;
  const combinedRotY = charState.rotationY + wordState.rotationY;
  const combinedRotZ = charState.rotationZ + wordState.rotationZ;
  const combinedScale = charState.scale * wordState.scale;
  const combinedOpacity = charState.opacity * wordState.opacity;

  return (
    <Text
      position={[
        basePosition[0] + xPosition + combinedX,
        basePosition[1] + combinedY,
        basePosition[2] + combinedZ,
      ]}
      rotation={[combinedRotX, combinedRotY, combinedRotZ]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={combinedOpacity}
      font={fontUrl}
      scale={combinedScale}
    >
      {char}
    </Text>
  );
};

// ============================================================================
// SPLIT TEXT 3D GSAP COMPONENT
// ============================================================================

/**
 * SplitText3DGsap - Professional 3D text animation with GSAP
 *
 * Uses GSAP timelines for complex, professional animations.
 * Animate words AND chars independently, just like GSAP SplitText!
 *
 * @example
 * ```tsx
 * <SplitText3DGsap
 *   text="Hello World"
 *   fontUrl={staticFile("fonts/Inter-Bold.ttf")}
 *   createTimeline={({ tl, words }) => {
 *     // Animate like GSAP SplitText!
 *     words.forEach((word) => {
 *       // Animate word (affects all chars in word)
 *       tl.from(word.state, {
 *         y: 0.5,
 *         opacity: 0,
 *         duration: 0.4,
 *         ease: "power3.out",
 *       })
 *       // Animate chars within word
 *       .from(word.chars, {
 *         y: 0.3,
 *         opacity: 0,
 *         duration: 0.3,
 *         stagger: 0.03,
 *         ease: "power2.out",
 *       }, "<"); // Start at same time as word
 *     });
 *     return tl;
 *   }}
 * />
 * ```
 */
export const SplitText3DGsap: React.FC<SplitText3DGsapProps> = ({
  text,
  fontUrl,
  position = [0, 0, 0],
  color = "#ffffff",
  fontSize = 1,
  letterSpacing = 0,
  charColor,
  createTimeline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Load font with opentype.js
  const font = useOpenTypeFont(fontUrl);
  
  // Timeline ref
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Force re-render counter
  const [, forceUpdate] = useState(0);

  // Calculate character positions and create animation states
  const { characters, charStates, wordDataList, charToWordIndex } = useMemo(() => {
    if (!font) {
      return { characters: [], charStates: [], wordDataList: [], charToWordIndex: [] };
    }

    const { chars } = getTextMetrics(font, text, fontSize);
    
    // Apply letter spacing
    let processedChars = chars;
    if (letterSpacing !== 0) {
      let offset = 0;
      processedChars = chars.map((c) => {
        const adjustedX = c.xPosition + offset;
        offset += letterSpacing * fontSize;
        return {
          ...c,
          xPosition: adjustedX - (offset - letterSpacing * fontSize) / 2,
        };
      });
    }

    // Create animation states for each character
    const charStates: CharAnimationState[] = processedChars.map(() => ({
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      opacity: 1,
    }));

    // Map each char index to its word index
    const charToWordIndex: number[] = [];

    // Group by words with word-level animation state
    const wordDataList: WordData[] = [];
    
    let currentWordChars: CharAnimationState[] = [];
    let currentWordStr = "";
    let wordIndex = 0;
    
    processedChars.forEach((c, index) => {
      if (c.char === " ") {
        if (currentWordChars.length > 0) {
          wordDataList.push({
            word: currentWordStr,
            state: {
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              opacity: 1,
            },
            chars: [...currentWordChars],
          });
          currentWordChars = [];
          currentWordStr = "";
          wordIndex++;
        }
        charToWordIndex.push(-1); // Space doesn't belong to a word
      } else {
        currentWordChars.push(charStates[index]);
        currentWordStr += c.char;
        charToWordIndex.push(wordIndex);
      }
    });
    
    // Don't forget the last word
    if (currentWordChars.length > 0) {
      wordDataList.push({
        word: currentWordStr,
        state: {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          opacity: 1,
        },
        chars: currentWordChars,
      });
    }

    return {
      characters: processedChars.map((c, index) => ({
        ...c,
        index,
      })),
      charStates,
      wordDataList,
      charToWordIndex,
    };
  }, [font, text, fontSize, letterSpacing]);

  // Memoize timeline factory
  const memoizedCreateTimeline = useCallback(createTimeline, []);

  // Create GSAP timeline
  useEffect(() => {
    if (!font || charStates.length === 0) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline({ paused: true });
    
    timelineRef.current = memoizedCreateTimeline({
      tl,
      chars: charStates,
      words: wordDataList,
      text,
    });

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [font, charStates, wordDataList, text, memoizedCreateTimeline]);

  // Seek timeline on each frame
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.seek(frame / fps);
      // Force re-render to apply animation values
      forceUpdate((n) => n + 1);
    }
  }, [frame, fps]);

  // Don't render until font is loaded
  if (!font || characters.length === 0) {
    return null;
  }

  // Default word state for spaces
  const defaultWordState: WordAnimationState = {
    x: 0, y: 0, z: 0,
    rotationX: 0, rotationY: 0, rotationZ: 0,
    scale: 1, opacity: 1,
  };

  return (
    <group>
      {characters.map(({ char, index, xPosition }) => {
        const wordIdx = charToWordIndex[index];
        const wordState = wordIdx >= 0 ? wordDataList[wordIdx].state : defaultWordState;
        
        return (
          <AnimatedChar
            key={`${index}-${char}`}
            char={char}
            xPosition={xPosition}
            basePosition={position}
            fontSize={fontSize}
            fontUrl={fontUrl}
            color={charColor ? charColor(char, index, characters.length) : color}
            charState={charStates[index]}
            wordState={wordState}
          />
        );
      })}
    </group>
  );
};

// ============================================================================
// PRESET TIMELINE FACTORIES
// ============================================================================

/** Preset: Characters fade up with stagger */
export const gsapPresetFadeUp = (
  stagger = 0.05,
  duration = 0.8
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { y: -1, opacity: 0, rotationX: Math.PI / 6 },
      { y: 0, opacity: 1, rotationX: 0, duration, stagger, ease: "back.out(1.7)" }
    );
    return tl;
  };
};

/** Preset: Characters scale up elastically */
export const gsapPresetElastic = (
  stagger = 0.04,
  duration = 1
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { scale: 0, opacity: 0, rotationZ: Math.PI / 4 },
      { scale: 1, opacity: 1, rotationZ: 0, duration, stagger, ease: "elastic.out(1, 0.5)" }
    );
    return tl;
  };
};

/** 
 * Preset: Word-by-word animation with chars (like GSAP SplitText)
 * Animates words first, then chars within each word
 */
export const gsapPresetWordByWord = (
  wordDuration = 0.4,
  charDuration = 0.3,
  charStagger = 0.03
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, words }) => {
    words.forEach((word) => {
      // Animate word (affects all chars)
      tl.fromTo(
        word.state,
        { y: 0.5, opacity: 0 },
        { y: 0, opacity: 1, duration: wordDuration, ease: "power3.out" }
      )
      // Animate chars within word (starts at same time with "<")
      .fromTo(
        word.chars,
        { y: 0.3, opacity: 0 },
        { y: 0, opacity: 1, duration: charDuration, stagger: charStagger, ease: "power2.out" },
        "<"
      );
    });
    return tl;
  };
};

/** Preset: Cascade from top */
export const gsapPresetCascade = (
  stagger = 0.06,
  duration = 1
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { y: 2, z: -2, opacity: 0, rotationX: -Math.PI / 3 },
      { y: 0, z: 0, opacity: 1, rotationX: 0, duration, stagger, ease: "power2.out" }
    );
    return tl;
  };
};

/** Preset: Typewriter effect */
export const gsapPresetTypewriter = (
  stagger = 0.05,
  duration = 0.1
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { opacity: 0, scale: 1.3 },
      { opacity: 1, scale: 1, duration, stagger, ease: "power4.out" }
    );
    return tl;
  };
};

/** Preset: 3D rotation reveal */
export const gsapPreset3DReveal = (
  stagger = 0.04,
  duration = 0.8
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { opacity: 0, rotationY: Math.PI / 2, rotationZ: Math.PI / 8, scale: 0.5, z: -1 },
      { opacity: 1, rotationY: 0, rotationZ: 0, scale: 1, z: 0, duration, stagger, ease: "power3.out" }
    );
    return tl;
  };
};

/** Preset: Wave animation */
export const gsapPresetWave = (
  stagger = 0.03,
  duration = 0.6,
  waveHeight = 0.3
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    tl.fromTo(
      chars,
      { y: -waveHeight, opacity: 0 },
      { y: 0, opacity: 1, duration, stagger, ease: "power2.out" }
    );
    return tl;
  };
};

/** Preset: Glitch effect */
export const gsapPresetGlitch = (
  stagger = 0.02
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    // Quick glitch in using fromTo for each step
    chars.forEach((char, i) => {
      const delay = i * stagger;
      tl.fromTo(char, { opacity: 0, x: 0.5 }, { opacity: 1, x: -0.2, duration: 0.05 }, delay);
      tl.to(char, { x: 0.1, duration: 0.05 }, delay + 0.05);
      tl.to(char, { x: 0, duration: 0.1, ease: "power2.out" }, delay + 0.1);
    });
    return tl;
  };
};
