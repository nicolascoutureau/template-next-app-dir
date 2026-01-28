import { useCurrentFrame, useVideoConfig } from "remotion";
import { Text } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useOpenTypeFont, getTextMetrics } from "./SplitText3D";

// ============================================================================
// TYPES
// ============================================================================

export type SplitType = "chars" | "words" | "lines" | "chars,words" | "chars,words,lines";

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

/** Animation state for lines (applies to all words/chars in the line) */
export interface LineAnimationState {
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

/** Line data with animation state and its words */
export interface LineData {
  /** The line text */
  text: string;
  /** Line index */
  index: number;
  /** Line-level animation state (applies to all words/chars) */
  state: LineAnimationState;
  /** Words in this line */
  words: WordData[];
  /** All character animation states in this line (flat) */
  chars: CharAnimationState[];
}

export interface SplitText3DGsapProps {
  /** The text to animate (use \n for line breaks) */
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
  /** Line height multiplier (default: 1.2) */
  lineHeight?: number;
  /** Split type: 'chars', 'words', 'lines', or combinations */
  splitType?: SplitType;
  /** Function to determine color per character */
  charColor?: (char: string, index: number, total: number) => string;
  /** 
   * Function to create the GSAP timeline
   * Similar to GSAP SplitText - animate lines, words, and chars independently!
   */
  createTimeline: (params: {
    tl: gsap.core.Timeline;
    /** All character animation states (flat array) */
    chars: CharAnimationState[];
    /** Word animation states (animate these to move entire words) */
    words: WordData[];
    /** Line animation states (animate these to move entire lines) */
    lines: LineData[];
    text: string;
  }) => gsap.core.Timeline;
}

// ============================================================================
// HELPER: Create default animation states
// ============================================================================

const createDefaultLineState = (): LineAnimationState => ({
  x: 0, y: 0, z: 0,
  rotationX: 0, rotationY: 0, rotationZ: 0,
  scale: 1, opacity: 1,
});

const createDefaultWordState = (): WordAnimationState => ({
  x: 0, y: 0, z: 0,
  rotationX: 0, rotationY: 0, rotationZ: 0,
  scale: 1, opacity: 1,
});

const createDefaultCharState = (): CharAnimationState => ({
  x: 0, y: 0, z: 0,
  rotationX: 0, rotationY: 0, rotationZ: 0,
  scale: 1, opacity: 1,
});

// ============================================================================
// ANIMATED CHARACTER COMPONENT
// ============================================================================

const AnimatedChar: React.FC<{
  char: string;
  xPosition: number;
  yPosition: number;
  basePosition: [number, number, number];
  fontSize: number;
  color: string;
  fontUrl: string;
  charState: CharAnimationState;
  wordState: WordAnimationState;
  lineState: LineAnimationState;
}> = ({ char, xPosition, yPosition, basePosition, fontSize, color, fontUrl, charState, wordState, lineState }) => {
  // Skip rendering spaces as 3D text
  if (char === " ") {
    return null;
  }

  // Combine line-level, word-level, and char-level transforms
  const combinedX = charState.x + wordState.x + lineState.x;
  const combinedY = charState.y + wordState.y + lineState.y;
  const combinedZ = charState.z + wordState.z + lineState.z;
  const combinedRotX = charState.rotationX + wordState.rotationX + lineState.rotationX;
  const combinedRotY = charState.rotationY + wordState.rotationY + lineState.rotationY;
  const combinedRotZ = charState.rotationZ + wordState.rotationZ + lineState.rotationZ;
  const combinedScale = charState.scale * wordState.scale * lineState.scale;
  const combinedOpacity = charState.opacity * wordState.opacity * lineState.opacity;

  return (
    <Text
      position={[
        basePosition[0] + xPosition + combinedX,
        basePosition[1] + yPosition + combinedY,
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
  lineHeight = 1.2,
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
  const { characters, charStates, wordDataList, lineDataList, charToWordIndex } = useMemo(() => {
    if (!font) {
      return { characters: [], charStates: [], wordDataList: [], lineDataList: [], charToWordIndex: [] };
    }

    // Split text into lines
    const lineTexts = text.split('\n');
    const numLines = lineTexts.length;
    
    // Calculate vertical offset for each line (centered around origin)
    const totalHeight = (numLines - 1) * fontSize * lineHeight;
    const startY = totalHeight / 2;
    
    // Process each line
    const allCharacters: Array<{ char: string; xPosition: number; yPosition: number; index: number; lineIndex: number }> = [];
    const allCharStates: CharAnimationState[] = [];
    const allWordDataList: WordData[] = [];
    const lineDataList: LineData[] = [];
    const charToWordIndex: number[] = [];
    
    let globalCharIndex = 0;
    let globalWordIndex = 0;
    
    lineTexts.forEach((lineText, lineIndex) => {
      const lineY = startY - lineIndex * fontSize * lineHeight;
      const lineState = createDefaultLineState();
      const lineWords: WordData[] = [];
      const lineChars: CharAnimationState[] = [];
      
      // Get metrics for this line
      const { chars: lineCharMetrics } = getTextMetrics(font, lineText, fontSize);
      
      // Apply letter spacing
      let processedChars = lineCharMetrics;
      if (letterSpacing !== 0) {
        let offset = 0;
        processedChars = lineCharMetrics.map((c) => {
          const adjustedX = c.xPosition + offset;
          offset += letterSpacing * fontSize;
          return {
            ...c,
            xPosition: adjustedX - (offset - letterSpacing * fontSize) / 2,
          };
        });
      }
      
      // Create char states for this line
      const lineCharStates: CharAnimationState[] = processedChars.map(() => createDefaultCharState());
      
      // Group chars into words
      let currentWordChars: CharAnimationState[] = [];
      let currentWordStr = "";
      
      processedChars.forEach((c, localIndex) => {
        const charState = lineCharStates[localIndex];
        
        allCharacters.push({
          char: c.char,
          xPosition: c.xPosition,
          yPosition: lineY,
          index: globalCharIndex,
          lineIndex,
        });
        allCharStates.push(charState);
        lineChars.push(charState);
        
        if (c.char === " " || c.char === "\n") {
          if (currentWordChars.length > 0) {
            const wordData: WordData = {
              word: currentWordStr,
              state: createDefaultWordState(),
              chars: [...currentWordChars],
            };
            allWordDataList.push(wordData);
            lineWords.push(wordData);
            currentWordChars = [];
            currentWordStr = "";
            globalWordIndex++;
          }
          charToWordIndex.push(-1); // Space doesn't belong to a word
        } else {
          currentWordChars.push(charState);
          currentWordStr += c.char;
          charToWordIndex.push(globalWordIndex);
        }
        
        globalCharIndex++;
      });
      
      // Don't forget the last word in the line
      if (currentWordChars.length > 0) {
        const wordData: WordData = {
          word: currentWordStr,
          state: createDefaultWordState(),
          chars: currentWordChars,
        };
        allWordDataList.push(wordData);
        lineWords.push(wordData);
        globalWordIndex++;
      }
      
      lineDataList.push({
        text: lineText,
        index: lineIndex,
        state: lineState,
        words: lineWords,
        chars: lineChars,
      });
    });

    return {
      characters: allCharacters,
      charStates: allCharStates,
      wordDataList: allWordDataList,
      lineDataList,
      charToWordIndex,
    };
  }, [font, text, fontSize, letterSpacing, lineHeight]);

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
      lines: lineDataList,
      text,
    });

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [font, charStates, wordDataList, lineDataList, text, memoizedCreateTimeline]);

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

  // Default states for spaces
  const defaultWordState: WordAnimationState = createDefaultWordState();
  const defaultLineState: LineAnimationState = createDefaultLineState();

  return (
    <group>
      {characters.map(({ char, index, xPosition, yPosition, lineIndex }) => {
        const wordIdx = charToWordIndex[index];
        const wordState = wordIdx >= 0 ? wordDataList[wordIdx].state : defaultWordState;
        const lineState = lineIndex >= 0 ? lineDataList[lineIndex].state : defaultLineState;
        
        return (
          <AnimatedChar
            key={`${index}-${char}`}
            char={char}
            xPosition={xPosition}
            yPosition={yPosition}
            basePosition={position}
            fontSize={fontSize}
            fontUrl={fontUrl}
            color={charColor ? charColor(char, index, characters.length) : color}
            charState={charStates[index]}
            wordState={wordState}
            lineState={lineState}
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

/** 
 * Preset: Line-by-line animation
 * Each line slides in and fades, then chars animate within
 */
export const gsapPresetLineByLine = (
  lineDuration = 0.5,
  lineStagger = 0.3,
  charStagger = 0.02
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, lines }) => {
    lines.forEach((line, i) => {
      const lineDelay = i * lineStagger;
      
      // Set initial state at time 0
      tl.set(line.state, { opacity: 0, y: 0.5 }, 0);
      tl.set(line.chars, { opacity: 0, y: 0.2 }, 0);
      
      // Animate line entrance
      tl.to(
        line.state,
        { opacity: 1, y: 0, duration: lineDuration, ease: "power3.out" },
        lineDelay
      );
      
      // Animate chars within line
      tl.to(
        line.chars,
        { opacity: 1, y: 0, duration: 0.4, stagger: charStagger, ease: "power2.out" },
        lineDelay
      );
    });
    return tl;
  };
};

/**
 * Preset: Lines reveal from bottom
 * Lines slide up from below with stagger
 */
export const gsapPresetLinesReveal = (
  duration = 0.6,
  stagger = 0.2
): SplitText3DGsapProps["createTimeline"] => {
  return ({ tl, lines }) => {
    // Set initial hidden state
    lines.forEach(line => {
      tl.set(line.state, { opacity: 0, y: -1 }, 0);
    });
    
    // Animate lines
    const lineStates = lines.map(l => l.state);
    tl.to(
      lineStates,
      { opacity: 1, y: 0, duration, stagger, ease: "power3.out" },
      0.1
    );
    return tl;
  };
};
