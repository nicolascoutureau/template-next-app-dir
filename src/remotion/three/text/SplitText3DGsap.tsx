import { useCurrentFrame, useVideoConfig } from "remotion";
import { Text } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useOpenTypeFont, getTextMetrics } from "./SplitText3D";

// ============================================================================
// TYPES
// ============================================================================

export type SplitType = "chars" | "words" | "lines" | "chars,words";

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
   * Receives refs to character animation states and word groups
   */
  createTimeline: (params: {
    tl: gsap.core.Timeline;
    chars: CharAnimationState[];
    words: CharAnimationState[][];
    charsByWord: { word: string; chars: CharAnimationState[] }[];
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
  animState: CharAnimationState;
}> = ({ char, xPosition, basePosition, fontSize, color, fontUrl, animState }) => {
  // Skip rendering spaces as 3D text
  if (char === " ") {
    return null;
  }

  return (
    <Text
      position={[
        basePosition[0] + xPosition + animState.x,
        basePosition[1] + animState.y,
        basePosition[2] + animState.z,
      ]}
      rotation={[animState.rotationX, animState.rotationY, animState.rotationZ]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={animState.opacity}
      font={fontUrl}
      scale={animState.scale}
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
 * Supports splitting by chars, words, or both.
 *
 * @example
 * ```tsx
 * <SplitText3DGsap
 *   text="Hello World"
 *   fontUrl={staticFile("fonts/Inter-Bold.ttf")}
 *   splitType="chars,words"
 *   createTimeline={({ tl, chars, words }) => {
 *     // Set initial state
 *     gsap.set(chars, { y: -1, opacity: 0, rotationX: Math.PI / 4 });
 *     
 *     // Animate chars with stagger
 *     tl.to(chars, {
 *       y: 0,
 *       opacity: 1,
 *       rotationX: 0,
 *       duration: 0.8,
 *       stagger: 0.05,
 *       ease: "back.out(1.7)",
 *     });
 *     
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
  splitType = "chars",
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
  const { characters, charStates, wordGroups, charsByWord } = useMemo(() => {
    if (!font) {
      return { characters: [], charStates: [], wordGroups: [], charsByWord: [] };
    }

    const { chars } = getTextMetrics(font, text, fontSize);
    
    // Apply letter spacing
    let processedChars = chars;
    if (letterSpacing !== 0) {
      let offset = 0;
      processedChars = chars.map((c, index) => {
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

    // Group by words
    const wordGroups: CharAnimationState[][] = [];
    const charsByWord: { word: string; chars: CharAnimationState[] }[] = [];
    
    let currentWord: CharAnimationState[] = [];
    let currentWordStr = "";
    
    processedChars.forEach((c, index) => {
      if (c.char === " ") {
        if (currentWord.length > 0) {
          wordGroups.push([...currentWord]);
          charsByWord.push({ word: currentWordStr, chars: [...currentWord] });
          currentWord = [];
          currentWordStr = "";
        }
      } else {
        currentWord.push(charStates[index]);
        currentWordStr += c.char;
      }
    });
    
    // Don't forget the last word
    if (currentWord.length > 0) {
      wordGroups.push(currentWord);
      charsByWord.push({ word: currentWordStr, chars: currentWord });
    }

    return {
      characters: processedChars.map((c, index) => ({
        ...c,
        index,
      })),
      charStates,
      wordGroups,
      charsByWord,
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
      words: wordGroups,
      charsByWord,
      text,
    });

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [font, charStates, wordGroups, charsByWord, text, memoizedCreateTimeline]);

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

  return (
    <group>
      {characters.map(({ char, index, xPosition }) => (
        <AnimatedChar
          key={`${index}-${char}`}
          char={char}
          xPosition={xPosition}
          basePosition={position}
          fontSize={fontSize}
          fontUrl={fontUrl}
          color={charColor ? charColor(char, index, characters.length) : color}
          animState={charStates[index]}
        />
      ))}
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
    gsap.set(chars, { y: -1, opacity: 0, rotationX: Math.PI / 6 });
    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration,
      stagger,
      ease: "back.out(1.7)",
    });
    return tl;
  };
};

/** Preset: Characters scale up elastically */
export const gsapPresetElastic = (
  stagger = 0.04,
  duration = 1
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    gsap.set(chars, { scale: 0, opacity: 0, rotationZ: Math.PI / 4 });
    tl.to(chars, {
      scale: 1,
      opacity: 1,
      rotationZ: 0,
      duration,
      stagger,
      ease: "elastic.out(1, 0.5)",
    });
    return tl;
  };
};

/** Preset: Words animate in sequence */
export const gsapPresetWordByWord = (
  wordDelay = 0.3,
  charStagger = 0.02,
  duration = 0.6
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, charsByWord }) => {
    charsByWord.forEach((wordData, wordIndex) => {
      gsap.set(wordData.chars, { y: -0.5, opacity: 0, scale: 0.8 });
      tl.to(
        wordData.chars,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration,
          stagger: charStagger,
          ease: "power3.out",
        },
        wordIndex * wordDelay
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
    gsap.set(chars, { y: 2, z: -2, opacity: 0, rotationX: -Math.PI / 3 });
    tl.to(chars, {
      y: 0,
      z: 0,
      opacity: 1,
      rotationX: 0,
      duration,
      stagger,
      ease: "power2.out",
    });
    return tl;
  };
};

/** Preset: Typewriter effect */
export const gsapPresetTypewriter = (
  stagger = 0.05,
  duration = 0.1
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    gsap.set(chars, { opacity: 0, scale: 1.3 });
    tl.to(chars, {
      opacity: 1,
      scale: 1,
      duration,
      stagger,
      ease: "power4.out",
    });
    return tl;
  };
};

/** Preset: 3D rotation reveal */
export const gsapPreset3DReveal = (
  stagger = 0.04,
  duration = 0.8
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    gsap.set(chars, { 
      opacity: 0, 
      rotationY: Math.PI / 2,
      rotationZ: Math.PI / 8,
      scale: 0.5,
      z: -1,
    });
    tl.to(chars, {
      opacity: 1,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      z: 0,
      duration,
      stagger,
      ease: "power3.out",
    });
    return tl;
  };
};

/** Preset: Wave animation (continuous) */
export const gsapPresetWave = (
  stagger = 0.03,
  duration = 0.6,
  waveHeight = 0.3
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    gsap.set(chars, { y: -waveHeight, opacity: 0 });
    
    // Entrance animation
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: "power2.out",
    });
    
    // Continuous wave
    tl.to(chars, {
      y: waveHeight * 0.5,
      duration: 0.4,
      stagger: {
        each: 0.05,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
    }, ">");
    
    return tl;
  };
};

/** Preset: Glitch effect */
export const gsapPresetGlitch = (
  stagger = 0.02,
  duration = 0.3
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, chars }) => {
    gsap.set(chars, { opacity: 0, x: 0.5 });
    
    // Quick glitch in
    chars.forEach((char, i) => {
      const delay = i * stagger;
      tl.to(char, { opacity: 1, x: -0.2, duration: 0.05 }, delay);
      tl.to(char, { x: 0.1, duration: 0.05 }, delay + 0.05);
      tl.to(char, { x: 0, duration: 0.1, ease: "power2.out" }, delay + 0.1);
    });
    
    return tl;
  };
};
