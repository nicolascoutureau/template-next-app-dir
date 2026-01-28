import type opentype from "opentype.js";

/**
 * Character metrics for positioning
 */
export interface CharMetric {
  char: string;
  xPosition: number;
  width: number;
  index: number;
  /** Baseline offset for vertical alignment (normalized across fonts) */
  baselineOffset: number;
}

/**
 * Text metrics result
 */
export interface TextMetricsResult {
  chars: CharMetric[];
  totalWidth: number;
  /** Baseline offset for this font (distance from middle to baseline) */
  baselineOffset: number;
}

/**
 * Segment layout data for rich text
 */
export interface SegmentLayout {
  segmentIndex: number;
  text: string;
  startX: number;
  width: number;
  chars: CharMetric[];
  /** Baseline offset for this segment's font */
  baselineOffset: number;
}

/**
 * Rich text layout result
 */
export interface RichTextLayout {
  segments: SegmentLayout[];
  totalWidth: number;
  /** Character positions relative to center (0) */
  allChars: Array<CharMetric & { segmentIndex: number }>;
}

/**
 * Calculate baseline offset for a font
 * This is the vertical offset needed to align the baseline when using anchorY="middle"
 * 
 * When rendering with anchorY="middle", the text's vertical center is positioned at the given Y.
 * The center in font coordinates is at: (ascender + descender) / 2
 * The baseline is at y=0 in font coordinates.
 * 
 * To align all fonts on the same baseline, we need to offset each font so its baseline
 * ends up at the target Y position, not its center.
 * 
 * The offset = (ascender + descender) / 2 (the middle point)
 * Adding this to Y moves the baseline to the target position.
 */
export function calculateBaselineOffset(font: opentype.Font, fontSize: number): number {
  const scale = fontSize / font.unitsPerEm;
  
  // Get font metrics
  const ascender = font.ascender * scale;
  const descender = font.descender * scale; // Usually negative
  
  // The vertical center of the glyph bounding box
  // When anchorY="middle" is used, this point is placed at the given Y position
  const middle = (ascender + descender) / 2;
  
  // To move the baseline (y=0 in font coords) to our target Y,
  // we need to ADD this offset to shift the text upward
  // (since middle is typically positive for most fonts)
  return middle;
}

/**
 * Calculate text metrics using opentype font
 * Returns character positions and total width
 */
export function calculateTextMetrics(
  font: opentype.Font,
  text: string,
  fontSize: number
): TextMetricsResult {
  const chars: CharMetric[] = [];
  const scale = fontSize / font.unitsPerEm;
  let xPosition = 0;
  
  // Calculate baseline offset for this font
  const baselineOffset = calculateBaselineOffset(font, fontSize);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const glyph = font.charToGlyph(char);
    const advanceWidth = (glyph.advanceWidth || 0) * scale;

    // Get kerning with next character if exists
    let kerning = 0;
    if (i < text.length - 1) {
      const nextChar = text[i + 1];
      kerning = font.getKerningValue(glyph, font.charToGlyph(nextChar)) * scale;
    }

    // Store center position of character
    const charCenterX = xPosition + advanceWidth / 2;

    chars.push({
      char,
      xPosition: charCenterX,
      width: advanceWidth,
      index: i,
      baselineOffset,
    });

    // Move to next position
    xPosition += advanceWidth + kerning;
  }

  return {
    chars,
    totalWidth: xPosition,
    baselineOffset,
  };
}

/**
 * Calculate rich text layout for multiple segments
 * Positions all characters correctly across segments with baseline alignment
 */
export function calculateRichTextLayout(
  segments: Array<{
    text: string;
    font: opentype.Font;
    fontSize: number;
  }>,
  segmentSpacing: number = 0
): RichTextLayout {
  const segmentLayouts: SegmentLayout[] = [];
  const allChars: Array<CharMetric & { segmentIndex: number }> = [];

  // First pass: calculate metrics for each segment
  const segmentMetrics = segments.map((seg) =>
    calculateTextMetrics(seg.font, seg.text, seg.fontSize)
  );

  // Calculate total width
  let totalWidth = 0;
  segmentMetrics.forEach((metrics, i) => {
    totalWidth += metrics.totalWidth;
    if (i > 0) {
      totalWidth += segmentSpacing;
    }
  });

  // Second pass: position segments centered around 0
  const startX = -totalWidth / 2;
  let currentX = startX;

  segments.forEach((segment, segIndex) => {
    if (segIndex > 0) {
      currentX += segmentSpacing;
    }

    const metrics = segmentMetrics[segIndex];
    const segmentStartX = currentX;

    // Create segment layout with baseline offset preserved
    const segmentChars: CharMetric[] = metrics.chars.map((charMetric) => ({
      ...charMetric,
      // Position is segment start + relative position within segment
      xPosition: segmentStartX + charMetric.xPosition,
      // Baseline offset is already set per character from calculateTextMetrics
    }));

    segmentLayouts.push({
      segmentIndex: segIndex,
      text: segment.text,
      startX: segmentStartX,
      width: metrics.totalWidth,
      chars: segmentChars,
      baselineOffset: metrics.baselineOffset,
    });

    // Add to all chars with segment index
    segmentChars.forEach((char) => {
      allChars.push({
        ...char,
        segmentIndex: segIndex,
      });
    });

    currentX += metrics.totalWidth;
  });

  return {
    segments: segmentLayouts,
    totalWidth,
    allChars,
  };
}

/**
 * Verify text layout is centered correctly
 * Returns true if the layout is centered around 0
 */
export function verifyLayoutCentered(layout: RichTextLayout): boolean {
  if (layout.allChars.length === 0) return true;

  // First char should be at approximately -totalWidth/2 + first char width/2
  const firstChar = layout.allChars[0];
  const lastChar = layout.allChars[layout.allChars.length - 1];

  // The leftmost edge should be at -totalWidth/2
  const leftEdge = firstChar.xPosition - firstChar.width / 2;
  const rightEdge = lastChar.xPosition + lastChar.width / 2;

  // Check symmetry with small tolerance for floating point
  const tolerance = 0.001;
  return Math.abs(leftEdge + rightEdge) < tolerance;
}

/**
 * Verify no characters overlap
 * Returns true if no characters overlap
 */
export function verifyNoOverlap(layout: RichTextLayout): boolean {
  const chars = layout.allChars;
  if (chars.length <= 1) return true;

  for (let i = 0; i < chars.length - 1; i++) {
    const current = chars[i];
    const next = chars[i + 1];

    // Skip space characters
    if (current.char === " " || next.char === " ") continue;

    const currentRight = current.xPosition + current.width / 2;
    const nextLeft = next.xPosition - next.width / 2;

    // Allow small overlap tolerance for kerning
    const tolerance = 0.01;
    if (currentRight > nextLeft + tolerance) {
      return false;
    }
  }

  return true;
}

/**
 * Verify segments are in correct order (left to right)
 */
export function verifySegmentOrder(layout: RichTextLayout): boolean {
  const segments = layout.segments;
  if (segments.length <= 1) return true;

  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1];

    if (current.startX + current.width > next.startX) {
      return false;
    }
  }

  return true;
}
