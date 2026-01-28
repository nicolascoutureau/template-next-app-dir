import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { Text } from "@react-three/drei";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import opentype from "opentype.js";
import { calculateRichTextLayout } from "./textLayout";
import type { CharAnimationState, WordAnimationState, WordData } from "./SplitText3DGsap";

// Re-export the layout utilities for testing
export { calculateRichTextLayout, verifyLayoutCentered, verifyNoOverlap } from "./textLayout";

// ============================================================================
// TYPES
// ============================================================================

/** Segment-level animation state */
export interface SegmentAnimationState {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  opacity: number;
}

/** A single text segment with its own styling */
export interface TextSegment {
  /** The text content */
  text: string;
  /** Font URL (use getFontUrl from fonts.ts) */
  fontUrl: string;
  /** Font size in 3D units (default: inherits from parent) */
  fontSize?: number;
  /** Text color */
  color?: string;
  /** Per-character color function */
  charColor?: (char: string, charIndex: number, totalChars: number) => string;
}

/** Extended word data including segment info */
export interface RichWordData extends WordData {
  /** Index of the segment this word belongs to */
  segmentIndex: number;
  /** The segment this word belongs to */
  segment: TextSegment;
}

/** Segment data with animation state and its words */
export interface SegmentData {
  /** The original segment */
  segment: TextSegment;
  /** Segment-level animation state (applies to all words/chars) */
  state: SegmentAnimationState;
  /** Words in this segment */
  words: RichWordData[];
  /** All characters in this segment (flat) */
  chars: CharAnimationState[];
  /** Start X position of this segment */
  startX: number;
  /** Width of this segment */
  width: number;
}

export interface RichText3DGsapProps {
  /** Array of text segments with different styles */
  segments: TextSegment[];
  /** Position in 3D space */
  position?: [number, number, number];
  /** Default font size (can be overridden per segment) */
  fontSize?: number;
  /** Default color (can be overridden per segment) */
  color?: string;
  /** Space between segments (multiplied by fontSize) */
  segmentSpacing?: number;
  /** 
   * Function to create the GSAP timeline
   * Animate segments, words, and chars independently!
   */
  createTimeline: (params: {
    tl: gsap.core.Timeline;
    /** All character animation states (flat array across all segments) */
    chars: CharAnimationState[];
    /** All word data (flat array across all segments) */
    words: RichWordData[];
    /** Segment data with their own animation states */
    segments: SegmentData[];
    /** The original text (all segments joined) */
    text: string;
  }) => gsap.core.Timeline;
}

// ============================================================================
// FONT CACHE AND LOADING
// ============================================================================

const fontCache = new Map<string, opentype.Font>();

/**
 * Hook to load multiple fonts at once (avoids hooks-in-loop issue)
 */
function useMultipleFonts(fontUrls: string[]): (opentype.Font | null)[] {
  const [fonts, setFonts] = useState<(opentype.Font | null)[]>(() => 
    fontUrls.map(url => fontCache.get(url) || null)
  );
  
  const handleRef = useRef<number | null>(null);
  const urlsKey = fontUrls.join("|");

  useEffect(() => {
    // Check if all fonts are already cached
    const cachedFonts = fontUrls.map(url => fontCache.get(url) || null);
    const allCached = cachedFonts.every(f => f !== null);
    
    if (allCached) {
      setFonts(cachedFonts);
      return;
    }

    // Need to load some fonts
    const handle = delayRender(`Loading ${fontUrls.length} fonts`);
    handleRef.current = handle;

    const loadPromises = fontUrls.map((url) => {
      if (fontCache.has(url)) {
        return Promise.resolve(fontCache.get(url)!);
      }
      
      return new Promise<opentype.Font>((resolve, reject) => {
        opentype.load(url, (err, loadedFont) => {
          if (err || !loadedFont) {
            reject(new Error(`Failed to load font: ${url}`));
            return;
          }
          fontCache.set(url, loadedFont);
          resolve(loadedFont);
        });
      });
    });

    Promise.all(loadPromises)
      .then(loadedFonts => {
        setFonts(loadedFonts);
        continueRender(handle);
      })
      .catch(err => {
        console.error("Font loading error:", err);
        continueRender(handle);
      });

    return () => {
      // Cleanup handled by Promise completion
    };
  }, [urlsKey]);

  return fonts;
}

// ============================================================================
// HELPER: Create initial animation state
// ============================================================================

// Initialize with opacity 0 to prevent flash before timeline applies initial state
const createCharState = (): CharAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 0, // Start hidden - timeline will control visibility
});

const createWordState = (): WordAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 1, // Words default to visible, chars control visibility
});

const createSegmentState = (): SegmentAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 1, // Segments default to visible, chars control visibility
});

// ============================================================================
// ANIMATED CHARACTER COMPONENT
// ============================================================================

interface AnimatedCharProps {
  char: string;
  charState: CharAnimationState;
  wordState: WordAnimationState;
  segmentState: SegmentAnimationState;
  baseX: number;
  baseY: number;
  /** Baseline offset for vertical alignment across different fonts */
  baselineOffset: number;
  fontSize: number;
  color: string;
  fontUrl: string;
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({
  char,
  charState,
  wordState,
  segmentState,
  baseX,
  baseY,
  baselineOffset,
  fontSize,
  color,
  fontUrl,
}) => {
  // Skip spaces
  if (char === " ") return null;

  // Combine all animation states: segment -> word -> char
  const combinedX = segmentState.x + wordState.x + charState.x + baseX;
  // Apply baseline offset to align all fonts on the same baseline
  const combinedY = segmentState.y + wordState.y + charState.y + baseY + baselineOffset;
  const combinedZ = segmentState.z + wordState.z + charState.z;
  const combinedRotX = segmentState.rotationX + wordState.rotationX + charState.rotationX;
  const combinedRotY = segmentState.rotationY + wordState.rotationY + charState.rotationY;
  const combinedRotZ = segmentState.rotationZ + wordState.rotationZ + charState.rotationZ;
  const combinedScale = segmentState.scale * wordState.scale * charState.scale;
  const combinedOpacity = segmentState.opacity * wordState.opacity * charState.opacity;

  return (
    <Text
      position={[combinedX, combinedY, combinedZ]}
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
// RICH TEXT 3D GSAP COMPONENT
// ============================================================================

/**
 * RichText3DGsap - Professional 3D rich text animation component
 * 
 * Supports multiple text segments with different fonts, sizes, and colors.
 * Full GSAP timeline control for animating segments, words, and characters.
 *
 * @example
 * ```tsx
 * <RichText3DGsap
 *   segments={[
 *     { text: "Hello ", fontUrl: getFontUrl("Poppins", 400), color: "#ffffff" },
 *     { text: "World", fontUrl: getFontUrl("Playfair Display", 700), color: "#60a5fa" },
 *   ]}
 *   position={[0, 0, 0]}
 *   createTimeline={({ tl, segments, words, chars }) => {
 *     // Animate each segment with different timing
 *     segments.forEach((seg, i) => {
 *       tl.fromTo(seg.state, { opacity: 0 }, { opacity: 1, duration: 0.5 }, i * 0.3);
 *       tl.fromTo(seg.chars, { y: 0.5 }, { y: 0, stagger: 0.02 }, i * 0.3);
 *     });
 *     return tl;
 *   }}
 * />
 * ```
 */
export const RichText3DGsap: React.FC<RichText3DGsapProps> = ({
  segments,
  position = [0, 0, 0],
  fontSize: defaultFontSize = 1,
  color: defaultColor = "#ffffff",
  segmentSpacing = 0,
  createTimeline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Load all fonts at once (proper hooks usage)
  const fontUrls = segments.map(seg => seg.fontUrl);
  const fonts = useMultipleFonts(fontUrls);
  const allFontsLoaded = fonts.every(f => f !== null);

  // Store animation states
  const [segmentDataList, setSegmentDataList] = useState<SegmentData[]>([]);
  const [allChars, setAllChars] = useState<CharAnimationState[]>([]);
  const [allWords, setAllWords] = useState<RichWordData[]>([]);
  const [, forceUpdate] = useState(0);

  // Timeline ref
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Store createTimeline in ref to avoid dependency issues
  const createTimelineRef = useRef(createTimeline);
  createTimelineRef.current = createTimeline;

  // Calculate all character positions and create animation states
  useEffect(() => {
    if (!allFontsLoaded) return;

    // Use the tested layout calculation utility
    const layoutInput = segments.map((seg, i) => ({
      text: seg.text,
      font: fonts[i]!,
      fontSize: seg.fontSize ?? defaultFontSize,
    }));
    
    const layout = calculateRichTextLayout(layoutInput, segmentSpacing * defaultFontSize);

    const newSegmentDataList: SegmentData[] = [];
    const newAllChars: CharAnimationState[] = [];
    const newAllWords: RichWordData[] = [];

    // Create segment data from layout
    segments.forEach((segment, segIndex) => {
      const segFontSize = segment.fontSize ?? defaultFontSize;
      const segColor = segment.color ?? defaultColor;
      const segLayout = layout.segments[segIndex];
      
      // Create segment state
      const segmentState = createSegmentState();
      
      // Split text into words
      const wordTexts = segment.text.split(/(\s+)/);
      const segmentWords: RichWordData[] = [];
      const segmentChars: CharAnimationState[] = [];
      
      let charIndex = 0;
      
      wordTexts.forEach((wordText) => {
        if (wordText.trim() === "") {
          // Handle spaces - still need to advance charIndex
          for (let i = 0; i < wordText.length; i++) {
            if (charIndex < segLayout.chars.length) {
              const charState = createCharState();
              const metric = segLayout.chars[charIndex];
              (charState as any).baseX = metric.xPosition;
              (charState as any).baselineOffset = metric.baselineOffset;
              (charState as any).char = metric.char;
              (charState as any).fontSize = segFontSize;
              (charState as any).color = segColor;
              (charState as any).fontUrl = segment.fontUrl;
              segmentChars.push(charState);
              newAllChars.push(charState);
              charIndex++;
            }
          }
          return;
        }
        
        // Create word state
        const wordState = createWordState();
        const wordChars: CharAnimationState[] = [];
        
        for (let i = 0; i < wordText.length; i++) {
          if (charIndex < segLayout.chars.length) {
            const charState = createCharState();
            const metric = segLayout.chars[charIndex];
            const charColor = segment.charColor 
              ? segment.charColor(metric.char, newAllChars.length, -1) // -1 placeholder, updated later
              : segColor;
            
            (charState as any).baseX = metric.xPosition;
            (charState as any).baselineOffset = metric.baselineOffset;
            (charState as any).char = metric.char;
            (charState as any).fontSize = segFontSize;
            (charState as any).color = charColor;
            (charState as any).fontUrl = segment.fontUrl;
            
            wordChars.push(charState);
            segmentChars.push(charState);
            newAllChars.push(charState);
            charIndex++;
          }
        }
        
        const richWord: RichWordData = {
          word: wordText,
          state: wordState,
          chars: wordChars,
          segmentIndex: segIndex,
          segment,
        };
        
        segmentWords.push(richWord);
        newAllWords.push(richWord);
      });

      newSegmentDataList.push({
        segment,
        state: segmentState,
        words: segmentWords,
        chars: segmentChars,
        startX: segLayout.startX,
        width: segLayout.width,
      });
    });

    // Update charColor totals now that we know total char count
    const totalChars = newAllChars.length;
    newAllChars.forEach((charState, idx) => {
      const segData = newSegmentDataList.find(sd => sd.chars.includes(charState));
      if (segData?.segment.charColor) {
        (charState as any).color = segData.segment.charColor(
          (charState as any).char,
          idx,
          totalChars
        );
      }
    });

    setSegmentDataList(newSegmentDataList);
    setAllChars(newAllChars);
    setAllWords(newAllWords);
  }, [allFontsLoaded, segments, fonts, defaultFontSize, defaultColor, segmentSpacing]);

  // Track timeline version for initial seek
  const [timelineVersion, setTimelineVersion] = useState(0);

  // Create and manage GSAP timeline
  useEffect(() => {
    if (segmentDataList.length === 0 || allChars.length === 0) return;

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline({ paused: true });
    
    // Let user build the timeline
    const fullText = segments.map(s => s.text).join("");
    createTimelineRef.current({
      tl,
      chars: allChars,
      words: allWords,
      segments: segmentDataList,
      text: fullText,
    });

    timelineRef.current = tl;
    
    // Trigger a seek by incrementing version
    setTimelineVersion(v => v + 1);
  }, [segmentDataList, allChars, allWords, segments]);

  // Seek timeline on each frame or when timeline is created
  useEffect(() => {
    if (timelineRef.current) {
      const timeInSeconds = frame / fps;
      timelineRef.current.seek(timeInSeconds);
      forceUpdate(n => n + 1);
    }
  }, [frame, fps, timelineVersion]);

  // Don't render until all fonts loaded, layout calculated, and timeline ready
  if (!allFontsLoaded || segmentDataList.length === 0 || timelineVersion === 0) {
    return null;
  }

  return (
    <group position={position}>
      {segmentDataList.map((segData, segIdx) => (
        <group key={segIdx}>
          {segData.words.map((word, wordIdx) => (
            <group key={`${segIdx}-${wordIdx}`}>
              {word.chars.map((charState, charIdx) => {
                const charData = charState as any;
                if (charData.char === " ") return null;
                
                return (
                  <AnimatedChar
                    key={`${segIdx}-${wordIdx}-${charIdx}`}
                    char={charData.char}
                    charState={charState}
                    wordState={word.state}
                    segmentState={segData.state}
                    baseX={charData.baseX}
                    baseY={0}
                    baselineOffset={charData.baselineOffset || 0}
                    fontSize={charData.fontSize}
                    color={charData.color}
                    fontUrl={charData.fontUrl}
                  />
                );
              })}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

// ============================================================================
// PRESET TIMELINE FACTORIES
// ============================================================================

/**
 * Preset: Animate segments one by one with stagger
 */
export const richTextPresetSegmentStagger = ({
  tl,
  segments,
}: {
  tl: gsap.core.Timeline;
  segments: SegmentData[];
}) => {
  segments.forEach((seg, i) => {
    tl.fromTo(
      seg.state,
      { opacity: 0, y: 0.3 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      i * 0.4
    );
    tl.fromTo(
      seg.chars,
      { y: 0.2, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.02, ease: "power2.out" },
      i * 0.4
    );
  });
  return tl;
};

/**
 * Preset: Wave animation across all characters
 */
export const richTextPresetWave = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.fromTo(
    chars,
    { y: 0.5, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.03, ease: "back.out(1.7)" }
  );
  return tl;
};

/**
 * Preset: Typewriter effect
 */
export const richTextPresetTypewriter = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.fromTo(
    chars,
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 0.1, stagger: 0.05, ease: "none" }
  );
  return tl;
};
