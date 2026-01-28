import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import opentype from "opentype.js";
import * as THREE from "three";
import type { CharAnimationState, WordAnimationState, WordData, LineAnimationState, LineData } from "./SplitText3DGsap";

// Re-export types for convenience
export type { CharAnimationState, WordAnimationState, WordData, LineAnimationState, LineData };

// ============================================================================
// TYPES
// ============================================================================

export interface ExtrudedText3DGsapProps {
  /** Text to render */
  text: string;
  /** Font URL (TTF file) */
  fontUrl: string;
  /** Position in 3D space */
  position?: [number, number, number];
  /** Font size in 3D units */
  fontSize?: number;
  /** Extrusion depth */
  depth?: number;
  /** Bevel enabled */
  bevelEnabled?: boolean;
  /** Bevel thickness */
  bevelThickness?: number;
  /** Bevel size */
  bevelSize?: number;
  /** Bevel segments */
  bevelSegments?: number;
  /** Curve segments for smoother letters */
  curveSegments?: number;
  /** Default color */
  color?: string;
  /** Per-character color function */
  charColor?: (char: string, index: number, total: number) => string;
  /** Metalness (0-1) */
  metalness?: number;
  /** Roughness (0-1) */
  roughness?: number;
  /** Line height multiplier for multi-line text */
  lineHeight?: number;
  /** 
   * Function to create the GSAP timeline
   * Full control over chars, words, and lines!
   */
  createTimeline: (params: {
    tl: gsap.core.Timeline;
    /** All character animation states */
    chars: CharAnimationState[];
    /** Word data with their animation states */
    words: WordData[];
    /** Line data with their animation states */
    lines: LineData[];
    /** The original text */
    text: string;
  }) => gsap.core.Timeline;
}

// ============================================================================
// FONT CACHE
// ============================================================================

const fontCache = new Map<string, opentype.Font>();

function useOpenTypeFont(fontUrl: string): opentype.Font | null {
  const [font, setFont] = useState<opentype.Font | null>(() => fontCache.get(fontUrl) || null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    if (fontCache.has(fontUrl)) {
      setFont(fontCache.get(fontUrl)!);
      return;
    }

    const handle = delayRender(`Loading font: ${fontUrl}`);
    handleRef.current = handle;

    opentype.load(fontUrl, (err, loadedFont) => {
      if (err || !loadedFont) {
        console.error("Font loading error:", err);
        continueRender(handle);
        return;
      }
      fontCache.set(fontUrl, loadedFont);
      setFont(loadedFont);
      continueRender(handle);
    });

    return () => {
      // Cleanup handled by continueRender
    };
  }, [fontUrl]);

  return font;
}

// ============================================================================
// HELPER: Convert opentype path to Three.js Shapes with proper hole detection
// Uses THREE.ShapePath which has built-in hole detection (same as THREE.FontLoader)
// Note: OpenType uses Y-up, we flip Y for Three.js convention
// ============================================================================

function pathToShapes(path: opentype.Path): THREE.Shape[] {
  if (path.commands.length === 0) {
    return [];
  }
  
  // Use THREE.ShapePath which handles hole detection automatically
  // This is the same approach Three.js uses internally for font rendering
  const shapePath = new THREE.ShapePath();
  
  for (const cmd of path.commands) {
    switch (cmd.type) {
      case "M":
        shapePath.moveTo(cmd.x, -cmd.y);
        break;
      case "L":
        shapePath.lineTo(cmd.x, -cmd.y);
        break;
      case "C":
        shapePath.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, -cmd.y);
        break;
      case "Q":
        shapePath.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, -cmd.y);
        break;
      case "Z":
        // Close the current subpath
        if (shapePath.currentPath) {
          shapePath.currentPath.closePath();
        }
        break;
    }
  }
  
  // toShapes(isCCW) - since we flip Y coordinates, the winding direction is reversed
  // We pass false because originally CCW outer paths are now CW after Y-flip
  const shapes = shapePath.toShapes(false);
  
  return shapes;
}

// ============================================================================
// HELPER: Create initial animation states
// ============================================================================

const createCharState = (): CharAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 0, // Start hidden
});

const createWordState = (): WordAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 1,
});

const createLineState = (): LineAnimationState => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  opacity: 1,
});

// ============================================================================
// ANIMATED EXTRUDED CHARACTER COMPONENT
// ============================================================================

interface AnimatedExtrudedCharProps {
  geometry: THREE.BufferGeometry;
  charState: CharAnimationState;
  wordState: WordAnimationState;
  lineState: LineAnimationState;
  baseX: number;
  baseY: number;
  color: string;
  metalness: number;
  roughness: number;
}

const AnimatedExtrudedChar: React.FC<AnimatedExtrudedCharProps> = ({
  geometry,
  charState,
  wordState,
  lineState,
  baseX,
  baseY,
  color,
  metalness,
  roughness,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Combine all animation states: line -> word -> char
  const combinedX = lineState.x + wordState.x + charState.x + baseX;
  const combinedY = lineState.y + wordState.y + charState.y + baseY;
  const combinedZ = lineState.z + wordState.z + charState.z;
  const combinedRotX = lineState.rotationX + wordState.rotationX + charState.rotationX;
  const combinedRotY = lineState.rotationY + wordState.rotationY + charState.rotationY;
  const combinedRotZ = lineState.rotationZ + wordState.rotationZ + charState.rotationZ;
  const combinedScale = lineState.scale * wordState.scale * charState.scale;
  const combinedOpacity = lineState.opacity * wordState.opacity * charState.opacity;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[combinedX, combinedY, combinedZ]}
      rotation={[combinedRotX, combinedRotY, combinedRotZ]}
      scale={combinedScale}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={combinedOpacity}
      />
    </mesh>
  );
};

// ============================================================================
// EXTRUDED TEXT 3D GSAP COMPONENT
// ============================================================================

interface CharacterData {
  char: string;
  geometry: THREE.BufferGeometry;
  state: CharAnimationState;
  baseX: number;
  baseY: number;
  color: string;
  wordIndex: number;
  lineIndex: number;
}

export const ExtrudedText3DGsap: React.FC<ExtrudedText3DGsapProps> = ({
  text,
  fontUrl,
  position = [0, 0, 0],
  fontSize = 1,
  depth = 0.2,
  bevelEnabled = true,
  bevelThickness = 0.03,
  bevelSize = 0.02,
  bevelSegments = 3,
  curveSegments = 12,
  color: defaultColor = "#ffffff",
  charColor,
  metalness = 0.3,
  roughness = 0.4,
  lineHeight = 1.2,
  createTimeline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const font = useOpenTypeFont(fontUrl);

  // Refs to access current values without causing effect re-runs
  const frameRef = useRef(frame);
  const fpsRef = useRef(fps);
  frameRef.current = frame;
  fpsRef.current = fps;

  // Store animation data
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [allCharStates, setAllCharStates] = useState<CharAnimationState[]>([]);
  const [wordDataList, setWordDataList] = useState<WordData[]>([]);
  const [lineDataList, setLineDataList] = useState<LineData[]>([]);
  const [, forceUpdate] = useState(0);

  // Timeline management
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [timelineVersion, setTimelineVersion] = useState(0);
  const createTimelineRef = useRef(createTimeline);
  createTimelineRef.current = createTimeline;

  // Calculate geometries and layout
  const layoutData = useMemo(() => {
    if (!font) return null;

    const scale = fontSize / font.unitsPerEm;
    const lineTexts = text.split("\n");
    const totalLines = lineTexts.length;
    const lineHeightUnits = font.unitsPerEm * lineHeight * scale;

    // Calculate total height for centering
    const totalHeight = (totalLines - 1) * lineHeightUnits;

    const newCharacters: CharacterData[] = [];
    const newCharStates: CharAnimationState[] = [];
    const newWordDataList: WordData[] = [];
    const newLineDataList: LineData[] = [];

    let globalCharIndex = 0;

    lineTexts.forEach((lineText, lineIndex) => {
      const lineY = (totalHeight / 2) - (lineIndex * lineHeightUnits);
      const lineState = createLineState();
      
      // Calculate line width for centering
      const lineWidth = font.getAdvanceWidth(lineText, fontSize);
      let xOffset = -lineWidth / 2;

      const lineChars: CharAnimationState[] = [];
      const lineWords: WordData[] = [];
      
      // Split into words
      const wordTexts = lineText.split(/(\s+)/);
      
      wordTexts.forEach((wordText) => {
        if (wordText.trim() === "") {
          // Handle spaces
          const spaceWidth = font.getAdvanceWidth(wordText, fontSize);
          xOffset += spaceWidth;
          return;
        }

        const wordState = createWordState();
        const wordChars: CharAnimationState[] = [];

        for (let i = 0; i < wordText.length; i++) {
          const char = wordText[i];
          const glyph = font.charToGlyph(char);
          
          if (!glyph || glyph.index === 0) {
            const charWidth = font.getAdvanceWidth(char, fontSize);
            xOffset += charWidth;
            continue;
          }

          // Get character width for positioning
          const charAdvance = font.getAdvanceWidth(char, fontSize);
          
          // Get glyph path and convert to shapes (handles holes)
          const path = glyph.getPath(0, 0, fontSize);
          const shapes = pathToShapes(path);
          
          let geometry: THREE.BufferGeometry;
          let charWidth: number;
          let charHeight: number;
          
          if (shapes.length === 0 || path.commands.length === 0) {
            // Fallback: use a box for characters without valid paths
            console.warn(`[ExtrudedText3D] Using box fallback for char "${char}"`);
            charWidth = charAdvance * 0.8;
            charHeight = fontSize * 0.8;
            geometry = new THREE.BoxGeometry(charWidth, charHeight, depth);
          } else {
            try {
              // Create extruded geometry from all shapes
              geometry = new THREE.ExtrudeGeometry(shapes, {
                depth: depth,
                bevelEnabled: bevelEnabled,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelSegments: bevelSegments,
                curveSegments: curveSegments,
              });

              // Compute bounding box for positioning
              geometry.computeBoundingBox();
              const bbox = geometry.boundingBox!;
              charWidth = bbox.max.x - bbox.min.x;
              charHeight = bbox.max.y - bbox.min.y;
              
              // Check for invalid geometry
              if (charWidth === 0 || charHeight === 0 || !isFinite(charWidth) || !isFinite(charHeight)) {
                console.warn(`[ExtrudedText3D] Invalid geometry for char "${char}", using box fallback`);
                geometry.dispose();
                charWidth = charAdvance * 0.8;
                charHeight = fontSize * 0.8;
                geometry = new THREE.BoxGeometry(charWidth, charHeight, depth);
              } else {
                // IMPORTANT: Only center horizontally, NOT vertically!
                // After Y-flip in pathToShapes, baseline is at y=0 for all characters.
                // Centering vertically would break baseline alignment.
                // We translate X to center the char, and Z to center depth, but leave Y at baseline.
                geometry.translate(-bbox.min.x - charWidth / 2, 0, -depth / 2);
              }
            } catch (error) {
              console.error(`[ExtrudedText3D] Error creating geometry for char "${char}":`, error);
              charWidth = charAdvance * 0.8;
              charHeight = fontSize * 0.8;
              geometry = new THREE.BoxGeometry(charWidth, charHeight, depth);
            }
          }

          const charState = createCharState();
          const charBaseX = xOffset + charWidth / 2;
          
          const charColorValue = charColor
            ? charColor(char, globalCharIndex, -1) // Total updated later
            : defaultColor;

          newCharacters.push({
            char,
            geometry,
            state: charState,
            baseX: charBaseX,
            baseY: lineY,
            color: charColorValue,
            wordIndex: newWordDataList.length,
            lineIndex,
          });

          newCharStates.push(charState);
          wordChars.push(charState);
          lineChars.push(charState);
          
          xOffset += font.getAdvanceWidth(char, fontSize);
          globalCharIndex++;
        }

        if (wordChars.length > 0) {
          newWordDataList.push({
            word: wordText,
            state: wordState,
            chars: wordChars,
          });
          lineWords.push({
            word: wordText,
            state: wordState,
            chars: wordChars,
          });
        }
      });

      newLineDataList.push({
        text: lineText,
        index: lineIndex,
        state: lineState,
        words: lineWords,
        chars: lineChars,
      });
    });

    // Update charColor totals if needed
    if (charColor) {
      const total = newCharacters.length;
      newCharacters.forEach((charData, idx) => {
        charData.color = charColor(charData.char, idx, total);
      });
    }

    return {
      characters: newCharacters,
      charStates: newCharStates,
      wordDataList: newWordDataList,
      lineDataList: newLineDataList,
    };
  }, [font, text, fontSize, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, curveSegments, defaultColor, charColor, lineHeight]);

  // Update state when layout changes
  useEffect(() => {
    if (layoutData) {
      setCharacters(layoutData.characters);
      setAllCharStates(layoutData.charStates);
      setWordDataList(layoutData.wordDataList);
      setLineDataList(layoutData.lineDataList);
    }
  }, [layoutData]);

  // Create GSAP timeline
  useEffect(() => {
    if (characters.length === 0 || allCharStates.length === 0) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({ paused: true });

    createTimelineRef.current({
      tl,
      chars: allCharStates,
      words: wordDataList,
      lines: lineDataList,
      text,
    });

    // Seek immediately to prevent 1-frame flash
    const timeInSeconds = frameRef.current / fpsRef.current;
    tl.seek(timeInSeconds);

    timelineRef.current = tl;
    setTimelineVersion(v => v + 1);
  }, [characters, allCharStates, wordDataList, lineDataList, text]);

  // Seek timeline on frame change (useLayoutEffect for synchronous update before paint)
  useLayoutEffect(() => {
    if (timelineRef.current) {
      const timeInSeconds = frame / fps;
      timelineRef.current.seek(timeInSeconds);
      forceUpdate(n => n + 1);
    }
  }, [frame, fps, timelineVersion]);

  // Don't render until ready
  if (!font || characters.length === 0 || timelineVersion === 0) {
    return null;
  }

  return (
    <group position={position}>
      {characters.map((charData, idx) => {
        const wordData = wordDataList[charData.wordIndex];
        const lineData = lineDataList[charData.lineIndex];
        
        return (
          <AnimatedExtrudedChar
            key={idx}
            geometry={charData.geometry}
            charState={charData.state}
            wordState={wordData?.state || createWordState()}
            lineState={lineData?.state || createLineState()}
            baseX={charData.baseX}
            baseY={charData.baseY}
            color={charData.color}
            metalness={metalness}
            roughness={roughness}
          />
        );
      })}
    </group>
  );
};

// ============================================================================
// PRESET TIMELINE FACTORIES
// ============================================================================

/**
 * Preset: Cinematic 3D reveal with depth
 */
export const extrudedPreset3DReveal = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  // Set initial state
  tl.set(chars, { opacity: 0, z: -2, rotationX: Math.PI / 2, scale: 0.5 });
  
  // Dramatic reveal
  tl.to(chars, {
    opacity: 1,
    z: 0,
    rotationX: 0,
    scale: 1,
    duration: 1.2,
    stagger: 0.05,
    ease: "power4.out",
  }, 0);
  
  return tl;
};

/**
 * Preset: Flip in from behind
 */
export const extrudedPresetFlipIn = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.set(chars, { opacity: 0, rotationY: -Math.PI, z: -1 });
  
  tl.to(chars, {
    opacity: 1,
    rotationY: 0,
    z: 0,
    duration: 0.8,
    stagger: 0.04,
    ease: "back.out(1.2)",
  }, 0);
  
  return tl;
};

/**
 * Preset: Explode from center
 */
export const extrudedPresetExplode = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.set(chars, { opacity: 0, scale: 0, z: 2 });
  
  tl.to(chars, {
    opacity: 1,
    scale: 1,
    z: 0,
    duration: 0.6,
    stagger: {
      each: 0.03,
      from: "center",
    },
    ease: "elastic.out(1, 0.5)",
  }, 0);
  
  return tl;
};

/**
 * Preset: Matrix-style cascade
 */
export const extrudedPresetMatrix = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.set(chars, { opacity: 0, y: 2, rotationX: Math.PI / 4 });
  
  tl.to(chars, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.4,
    stagger: {
      each: 0.02,
      from: "random",
    },
    ease: "power2.out",
  }, 0);
  
  return tl;
};

/**
 * Preset: Domino fall
 */
export const extrudedPresetDomino = ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  tl.set(chars, { opacity: 1, rotationX: -Math.PI / 2 });
  
  tl.to(chars, {
    rotationX: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "bounce.out",
  }, 0);
  
  return tl;
};

// ============================================================================
// IN/OUT ANIMATION PRESETS
// ============================================================================

/**
 * Preset: 3D Reveal In/Out
 * Dramatic entrance from depth, then exits back into depth
 */
export const extrudedPreset3DRevealInOut = (
  inDuration = 1.0,
  holdDuration = 1.5,
  outDuration = 0.6,
  stagger = 0.04
) => ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  // Set initial state
  tl.set(chars, { opacity: 0, z: -3, rotationX: Math.PI / 2, scale: 0.3 });
  
  // Animate IN
  tl.to(chars, {
    opacity: 1,
    z: 0,
    rotationX: 0,
    scale: 1,
    duration: inDuration,
    stagger,
    ease: "power4.out",
  }, 0);
  
  // Calculate when in animation ends
  const inEndTime = inDuration + (chars.length - 1) * stagger;
  
  // Hold
  tl.to({}, { duration: holdDuration }, inEndTime);
  
  // Animate OUT (push back into depth)
  tl.to(chars, {
    opacity: 0,
    z: 3,
    rotationX: -Math.PI / 2,
    scale: 0.3,
    duration: outDuration,
    stagger: stagger / 2,
    ease: "power2.in",
  }, inEndTime + holdDuration);
  
  return tl;
};

/**
 * Preset: Flip In/Out
 * Characters flip in from behind, then flip away to the front
 */
export const extrudedPresetFlipInOut = (
  inDuration = 0.7,
  holdDuration = 1.5,
  outDuration = 0.5,
  stagger = 0.05
) => ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  // Set initial state
  tl.set(chars, { opacity: 0, rotationY: -Math.PI, z: -1.5, scale: 0.5 });
  
  // Animate IN
  tl.to(chars, {
    opacity: 1,
    rotationY: 0,
    z: 0,
    scale: 1,
    duration: inDuration,
    stagger,
    ease: "back.out(1.4)",
  }, 0);
  
  const inEndTime = inDuration + (chars.length - 1) * stagger;
  
  // Hold
  tl.to({}, { duration: holdDuration }, inEndTime);
  
  // Animate OUT (flip forward)
  tl.to(chars, {
    opacity: 0,
    rotationY: Math.PI,
    z: 1.5,
    scale: 0.5,
    duration: outDuration,
    stagger: stagger / 2,
    ease: "power2.in",
  }, inEndTime + holdDuration);
  
  return tl;
};

/**
 * Preset: Explode In/Out
 * Characters explode from center in, then implode out
 */
export const extrudedPresetExplodeInOut = (
  inDuration = 0.8,
  holdDuration = 1.2,
  outDuration = 0.5,
  stagger = 0.03
) => ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  // Set initial state
  tl.set(chars, { opacity: 0, scale: 0, z: 3 });
  
  // Animate IN (explode from center)
  tl.to(chars, {
    opacity: 1,
    scale: 1,
    z: 0,
    duration: inDuration,
    stagger: {
      each: stagger,
      from: "center",
    },
    ease: "elastic.out(1, 0.6)",
  }, 0);
  
  const inEndTime = inDuration + (chars.length - 1) * stagger;
  
  // Hold
  tl.to({}, { duration: holdDuration }, inEndTime);
  
  // Animate OUT (implode to center)
  tl.to(chars, {
    opacity: 0,
    scale: 0,
    z: -3,
    duration: outDuration,
    stagger: {
      each: stagger / 2,
      from: "edges",
    },
    ease: "power3.in",
  }, inEndTime + holdDuration);
  
  return tl;
};

/**
 * Preset: Spin In/Out
 * Characters spin in while scaling up, then spin out while scaling down
 */
export const extrudedPresetSpinInOut = (
  inDuration = 0.8,
  holdDuration = 1.5,
  outDuration = 0.5,
  stagger = 0.06
) => ({
  tl,
  chars,
}: {
  tl: gsap.core.Timeline;
  chars: CharAnimationState[];
}) => {
  // Set initial state
  tl.set(chars, { opacity: 0, scale: 0, rotationZ: Math.PI * 2, rotationY: Math.PI / 4 });
  
  // Animate IN
  tl.to(chars, {
    opacity: 1,
    scale: 1,
    rotationZ: 0,
    rotationY: 0,
    duration: inDuration,
    stagger,
    ease: "back.out(1.2)",
  }, 0);
  
  const inEndTime = inDuration + (chars.length - 1) * stagger;
  
  // Hold
  tl.to({}, { duration: holdDuration }, inEndTime);
  
  // Animate OUT (spin the other way)
  tl.to(chars, {
    opacity: 0,
    scale: 0,
    rotationZ: -Math.PI * 2,
    rotationY: -Math.PI / 4,
    duration: outDuration,
    stagger: stagger / 2,
    ease: "power2.in",
  }, inEndTime + holdDuration);
  
  return tl;
};
