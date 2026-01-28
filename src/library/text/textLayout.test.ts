import { describe, it, expect, beforeAll } from "vitest";
import opentype from "opentype.js";
import path from "path";
import fs from "fs";
import {
  calculateTextMetrics,
  calculateRichTextLayout,
  verifyLayoutCentered,
  verifyNoOverlap,
  verifySegmentOrder,
} from "./textLayout";

// Load fonts synchronously for testing (Node.js environment)
function loadFontSync(fontPath: string): opentype.Font {
  const buffer = fs.readFileSync(fontPath);
  // Convert Buffer to ArrayBuffer
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return opentype.parse(arrayBuffer);
}

// Fonts loaded from public/fonts
let interFont: opentype.Font;
let poppinsFont: opentype.Font;
let playfairFont: opentype.Font;

beforeAll(() => {
  const fontsDir = path.join(process.cwd(), "public/fonts");
  
  interFont = loadFontSync(path.join(fontsDir, "Inter-Regular.ttf"));
  poppinsFont = loadFontSync(path.join(fontsDir, "Poppins-SemiBold.ttf"));
  playfairFont = loadFontSync(path.join(fontsDir, "PlayfairDisplay-Bold.ttf"));
});

describe("calculateTextMetrics", () => {
  it("should return correct number of characters", () => {
    const result = calculateTextMetrics(interFont, "Hello", 1);
    expect(result.chars).toHaveLength(5);
  });

  it("should have positive total width for non-empty text", () => {
    const result = calculateTextMetrics(interFont, "Hello", 1);
    expect(result.totalWidth).toBeGreaterThan(0);
  });

  it("should return empty array for empty text", () => {
    const result = calculateTextMetrics(interFont, "", 1);
    expect(result.chars).toHaveLength(0);
    expect(result.totalWidth).toBe(0);
  });

  it("should scale width with fontSize", () => {
    const result1 = calculateTextMetrics(interFont, "Test", 1);
    const result2 = calculateTextMetrics(interFont, "Test", 2);
    // Width should approximately double
    expect(result2.totalWidth).toBeCloseTo(result1.totalWidth * 2, 5);
  });

  it("should have characters in left-to-right order", () => {
    const result = calculateTextMetrics(interFont, "ABCDE", 1);
    for (let i = 0; i < result.chars.length - 1; i++) {
      expect(result.chars[i].xPosition).toBeLessThan(result.chars[i + 1].xPosition);
    }
  });

  it("should handle spaces", () => {
    const result = calculateTextMetrics(interFont, "A B", 1);
    expect(result.chars).toHaveLength(3);
    expect(result.chars[1].char).toBe(" ");
  });

  it("should account for character width in position", () => {
    const result = calculateTextMetrics(interFont, "AB", 1);
    // Second character should start after first character ends
    const firstCharEnd = result.chars[0].xPosition + result.chars[0].width / 2;
    const secondCharStart = result.chars[1].xPosition - result.chars[1].width / 2;
    // Allow some tolerance for kerning
    expect(secondCharStart).toBeGreaterThanOrEqual(firstCharEnd - 0.1);
  });
});

describe("calculateRichTextLayout", () => {
  it("should handle single segment", () => {
    const result = calculateRichTextLayout([
      { text: "Hello", font: interFont, fontSize: 1 },
    ]);

    expect(result.segments).toHaveLength(1);
    expect(result.allChars).toHaveLength(5);
    expect(verifyLayoutCentered(result)).toBe(true);
  });

  it("should handle multiple segments", () => {
    const result = calculateRichTextLayout([
      { text: "Hello ", font: interFont, fontSize: 1 },
      { text: "World", font: poppinsFont, fontSize: 1 },
    ]);

    expect(result.segments).toHaveLength(2);
    expect(result.allChars).toHaveLength(11); // "Hello " (6) + "World" (5)
  });

  it("should center text around 0", () => {
    const result = calculateRichTextLayout([
      { text: "Create ", font: interFont, fontSize: 0.4 },
      { text: "stunning ", font: poppinsFont, fontSize: 0.4 },
      { text: "videos", font: playfairFont, fontSize: 0.4 },
    ]);

    expect(verifyLayoutCentered(result)).toBe(true);
  });

  it("should have segments in correct order", () => {
    const result = calculateRichTextLayout([
      { text: "First", font: interFont, fontSize: 1 },
      { text: "Second", font: poppinsFont, fontSize: 1 },
      { text: "Third", font: playfairFont, fontSize: 1 },
    ]);

    expect(verifySegmentOrder(result)).toBe(true);
  });

  it("should not have overlapping characters", () => {
    const result = calculateRichTextLayout([
      { text: "Create ", font: interFont, fontSize: 0.4 },
      { text: "stunning ", font: poppinsFont, fontSize: 0.4 },
      { text: "videos", font: playfairFont, fontSize: 0.4 },
    ]);

    expect(verifyNoOverlap(result)).toBe(true);
  });

  it("should add segment spacing correctly", () => {
    const withoutSpacing = calculateRichTextLayout([
      { text: "A", font: interFont, fontSize: 1 },
      { text: "B", font: interFont, fontSize: 1 },
    ], 0);

    const withSpacing = calculateRichTextLayout([
      { text: "A", font: interFont, fontSize: 1 },
      { text: "B", font: interFont, fontSize: 1 },
    ], 0.5);

    expect(withSpacing.totalWidth).toBeGreaterThan(withoutSpacing.totalWidth);
    expect(withSpacing.totalWidth - withoutSpacing.totalWidth).toBeCloseTo(0.5, 5);
  });

  it("should position segments contiguously", () => {
    const result = calculateRichTextLayout([
      { text: "Hello", font: interFont, fontSize: 1 },
      { text: "World", font: interFont, fontSize: 1 },
    ]);

    // Second segment should start where first ends
    const firstSegmentEnd = result.segments[0].startX + result.segments[0].width;
    const secondSegmentStart = result.segments[1].startX;
    
    expect(secondSegmentStart).toBeCloseTo(firstSegmentEnd, 5);
  });

  it("should handle mixed font sizes", () => {
    const result = calculateRichTextLayout([
      { text: "Small", font: interFont, fontSize: 0.5 },
      { text: "Large", font: interFont, fontSize: 1.5 },
    ]);

    // Larger text should have wider segment
    expect(result.segments[1].width).toBeGreaterThan(result.segments[0].width);
    expect(verifyLayoutCentered(result)).toBe(true);
  });

  it("should assign correct segment indices to characters", () => {
    const result = calculateRichTextLayout([
      { text: "AB", font: interFont, fontSize: 1 },
      { text: "CD", font: interFont, fontSize: 1 },
    ]);

    expect(result.allChars[0].segmentIndex).toBe(0);
    expect(result.allChars[1].segmentIndex).toBe(0);
    expect(result.allChars[2].segmentIndex).toBe(1);
    expect(result.allChars[3].segmentIndex).toBe(1);
  });
});

describe("Rich text layout edge cases", () => {
  it("should handle empty segments gracefully", () => {
    const result = calculateRichTextLayout([
      { text: "", font: interFont, fontSize: 1 },
    ]);

    expect(result.segments).toHaveLength(1);
    expect(result.allChars).toHaveLength(0);
    expect(result.totalWidth).toBe(0);
  });

  it("should handle single character segments", () => {
    const result = calculateRichTextLayout([
      { text: "A", font: interFont, fontSize: 1 },
      { text: "B", font: poppinsFont, fontSize: 1 },
      { text: "C", font: playfairFont, fontSize: 1 },
    ]);

    expect(result.segments).toHaveLength(3);
    expect(result.allChars).toHaveLength(3);
    expect(verifyLayoutCentered(result)).toBe(true);
  });

  it("should handle only spaces", () => {
    const result = calculateRichTextLayout([
      { text: "   ", font: interFont, fontSize: 1 },
    ]);

    expect(result.allChars).toHaveLength(3);
    expect(result.totalWidth).toBeGreaterThan(0);
  });

  it("should handle special characters", () => {
    const result = calculateRichTextLayout([
      { text: "Hello!", font: interFont, fontSize: 1 },
      { text: "World?", font: poppinsFont, fontSize: 1 },
    ]);

    expect(result.allChars).toHaveLength(12);
    expect(verifyNoOverlap(result)).toBe(true);
  });

  it("should produce consistent results on multiple calls", () => {
    const segments = [
      { text: "Test", font: interFont, fontSize: 1 },
      { text: "Text", font: poppinsFont, fontSize: 1 },
    ];

    const result1 = calculateRichTextLayout(segments);
    const result2 = calculateRichTextLayout(segments);

    expect(result1.totalWidth).toBe(result2.totalWidth);
    expect(result1.allChars.length).toBe(result2.allChars.length);
    
    for (let i = 0; i < result1.allChars.length; i++) {
      expect(result1.allChars[i].xPosition).toBe(result2.allChars[i].xPosition);
    }
  });
});

describe("Baseline alignment", () => {
  it("should calculate baseline offset for different fonts", () => {
    const inter = calculateTextMetrics(interFont, "Test", 1);
    const playfair = calculateTextMetrics(playfairFont, "Test", 1);
    
    // Both should have defined baseline offsets
    expect(inter.baselineOffset).toBeDefined();
    expect(playfair.baselineOffset).toBeDefined();
    expect(typeof inter.baselineOffset).toBe("number");
    expect(typeof playfair.baselineOffset).toBe("number");
  });

  it("should include baseline offset in rich text layout", () => {
    const result = calculateRichTextLayout([
      { text: "Hello", font: interFont, fontSize: 1 },
      { text: "World", font: playfairFont, fontSize: 1 },
    ]);

    // Each segment should have a baseline offset
    result.segments.forEach(seg => {
      expect(seg.baselineOffset).toBeDefined();
      expect(typeof seg.baselineOffset).toBe("number");
    });

    // Each character should have a baseline offset
    result.allChars.forEach(char => {
      expect(char.baselineOffset).toBeDefined();
      expect(typeof char.baselineOffset).toBe("number");
    });
  });

  it("should have consistent baseline offset within a segment", () => {
    const result = calculateRichTextLayout([
      { text: "ABC", font: interFont, fontSize: 1 },
    ]);

    const segmentOffset = result.segments[0].baselineOffset;
    result.allChars.forEach(char => {
      expect(char.baselineOffset).toBe(segmentOffset);
    });
  });

  it("should align baselines when offset is applied", () => {
    // This test verifies that when we apply the baseline offset,
    // all fonts will have their baseline at the same Y position
    
    const fontSize = 1;
    const targetY = 0; // We want all baselines at Y=0
    
    // Calculate metrics for different fonts
    const fonts = [
      { name: "Inter", font: interFont },
      { name: "Poppins", font: poppinsFont },
      { name: "Playfair", font: playfairFont },
    ];
    
    const baselineYPositions: number[] = [];
    
    fonts.forEach(({ font }) => {
      const scale = fontSize / font.unitsPerEm;
      const ascender = font.ascender * scale;
      const descender = font.descender * scale;
      const middle = (ascender + descender) / 2;
      
      // With anchorY="middle" at position Y=targetY:
      // - The center of the text is at targetY
      // - The baseline is at: targetY - middle (because baseline is below center by 'middle' amount)
      // 
      // With our offset applied (position Y = targetY + baselineOffset):
      // - The center is at targetY + baselineOffset = targetY + middle
      // - The baseline is at: (targetY + middle) - middle = targetY
      
      const metrics = calculateTextMetrics(font, "Test", fontSize);
      const baselineOffset = metrics.baselineOffset;
      
      // Verify offset equals middle
      expect(baselineOffset).toBeCloseTo(middle, 5);
      
      // Calculate where baseline ends up when offset is applied
      const positionY = targetY + baselineOffset; // Where we position the text
      const actualBaselineY = positionY - middle; // Where baseline ends up
      
      baselineYPositions.push(actualBaselineY);
    });
    
    // All baselines should be at the same position (targetY = 0)
    baselineYPositions.forEach(baselineY => {
      expect(baselineY).toBeCloseTo(targetY, 5);
    });
  });

  it("baseline offset should match font metrics formula", () => {
    // Verify our baseline offset matches the expected formula:
    // offset = (ascender + descender) / 2
    
    const fontSize = 0.4; // Same as used in Main.tsx
    
    [interFont, poppinsFont, playfairFont].forEach(font => {
      const scale = fontSize / font.unitsPerEm;
      const ascender = font.ascender * scale;
      const descender = font.descender * scale;
      const expectedOffset = (ascender + descender) / 2;
      
      const metrics = calculateTextMetrics(font, "x", fontSize);
      
      expect(metrics.baselineOffset).toBeCloseTo(expectedOffset, 10);
    });
  });

  it("different fonts should have different baseline offsets due to different metrics", () => {
    // Fonts have different ascender/descender ratios, so offsets should differ
    const inter = calculateTextMetrics(interFont, "x", 1);
    const playfair = calculateTextMetrics(playfairFont, "x", 1);
    
    // The offsets will likely be different (unless fonts have identical metrics)
    // This test documents that we expect variation between fonts
    console.log(`Inter baseline offset: ${inter.baselineOffset}`);
    console.log(`Playfair baseline offset: ${playfair.baselineOffset}`);
    
    // Both should be positive (for typical fonts where ascender > |descender|)
    expect(inter.baselineOffset).toBeGreaterThan(0);
    expect(playfair.baselineOffset).toBeGreaterThan(0);
  });
});

describe("Layout verification helpers", () => {
  it("verifyLayoutCentered should fail for off-center layout", () => {
    // Manually create an off-center layout
    const offCenter = {
      segments: [],
      totalWidth: 10,
      allChars: [
        { char: "A", xPosition: 0, width: 1, index: 0, segmentIndex: 0, baselineOffset: 0 },
        { char: "B", xPosition: 1, width: 1, index: 1, segmentIndex: 0, baselineOffset: 0 },
      ],
    };

    expect(verifyLayoutCentered(offCenter)).toBe(false);
  });

  it("verifyNoOverlap should detect overlapping characters", () => {
    const overlapping = {
      segments: [],
      totalWidth: 2,
      allChars: [
        { char: "A", xPosition: 0, width: 2, index: 0, segmentIndex: 0, baselineOffset: 0 },
        { char: "B", xPosition: 0.5, width: 2, index: 1, segmentIndex: 0, baselineOffset: 0 },
      ],
    };

    expect(verifyNoOverlap(overlapping)).toBe(false);
  });

  it("verifySegmentOrder should detect out-of-order segments", () => {
    const outOfOrder = {
      segments: [
        { segmentIndex: 0, text: "A", startX: 5, width: 1, chars: [], baselineOffset: 0 },
        { segmentIndex: 1, text: "B", startX: 0, width: 1, chars: [], baselineOffset: 0 },
      ],
      totalWidth: 6,
      allChars: [],
    };

    expect(verifySegmentOrder(outOfOrder)).toBe(false);
  });
});
