#!/usr/bin/env node

/**
 * Download top 50 Google Fonts with common variants
 * Generates a TypeScript file listing all available fonts
 * 
 * Usage:
 *   node scripts/download-top-fonts.mjs
 * 
 * Or use npm script:
 *   npm run download-fonts
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FONTS_DIR = path.join(__dirname, "..", "public", "fonts");
const TS_OUTPUT = path.join(__dirname, "..", "src", "remotion", "fonts.ts");

// Top 50 Google Fonts with their most used weights
// Format: [family, weights[]]
const TOP_FONTS = [
  ["Roboto", [400, 500, 700]],
  ["Open Sans", [400, 600, 700]],
  ["Lato", [400, 700]],
  ["Montserrat", [400, 500, 600, 700]],
  ["Oswald", [400, 500, 700]],
  ["Source Sans Pro", [400, 600, 700]],
  ["Raleway", [400, 500, 600, 700]],
  ["Poppins", [400, 500, 600, 700]],
  ["Nunito", [400, 600, 700]],
  ["Playfair Display", [400, 700]],
  ["Roboto Condensed", [400, 700]],
  ["Ubuntu", [400, 500, 700]],
  ["Merriweather", [400, 700]],
  ["PT Sans", [400, 700]],
  ["Roboto Slab", [400, 500, 700]],
  ["Noto Sans", [400, 700]],
  ["Rubik", [400, 500, 700]],
  ["Work Sans", [400, 500, 600, 700]],
  ["Fira Sans", [400, 500, 700]],
  ["Quicksand", [400, 500, 700]],
  ["Nunito Sans", [400, 600, 700]],
  ["Inter", [400, 500, 600, 700]],
  ["Mulish", [400, 600, 700]],
  ["Barlow", [400, 500, 600, 700]],
  ["IBM Plex Sans", [400, 500, 700]],
  ["DM Sans", [400, 500, 700]],
  ["Manrope", [400, 500, 700]],
  ["Space Grotesk", [400, 500, 700]],
  ["Libre Franklin", [400, 500, 700]],
  ["Karla", [400, 700]],
  ["Heebo", [400, 500, 700]],
  ["Archivo", [400, 500, 700]],
  ["Josefin Sans", [400, 600, 700]],
  ["Cabin", [400, 500, 700]],
  ["Anton", [400]],
  ["Bebas Neue", [400]],
  ["Comfortaa", [400, 700]],
  ["Lexend", [400, 500, 700]],
  ["Outfit", [400, 500, 600, 700]],
  ["Plus Jakarta Sans", [400, 500, 600, 700]],
  ["Exo 2", [400, 500, 700]],
  ["Overpass", [400, 700]],
  ["Bitter", [400, 700]],
  ["Crimson Text", [400, 700]],
  ["Lora", [400, 700]],
  ["Cormorant Garamond", [400, 700]],
  ["Libre Baskerville", [400, 700]],
  ["EB Garamond", [400, 700]],
  ["Spectral", [400, 700]],
  ["Source Serif Pro", [400, 700]],
];

// Weight name mapping
const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

/**
 * Fetch URL with custom headers
 */
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: { ...headers },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });

    req.on("error", reject);
    req.end();
  });
}

/**
 * Get TTF URL from Google Fonts
 */
async function getGoogleFontTTFUrl(family, weight = 400) {
  const weightSpec = `wght@${weight}`;
  const apiUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${weightSpec}&display=swap`;

  const userAgents = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6",
  ];

  for (const userAgent of userAgents) {
    try {
      const cssBuffer = await fetchUrl(apiUrl, { "User-Agent": userAgent });
      const css = cssBuffer.toString("utf-8");

      const ttfMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);
      if (ttfMatch && ttfMatch[1]) {
        return ttfMatch[1];
      }
    } catch {
      // Try next user agent
    }
  }

  // Try Fontsource CDN as fallback
  const fontsourceName = family.toLowerCase().replace(/\s+/g, "-");
  const fontsourceUrl = `https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/latin-${weight}-normal.ttf`;
  
  try {
    await fetchUrl(fontsourceUrl, {});
    return fontsourceUrl;
  } catch {
    return null;
  }
}

/**
 * Download a file from URL
 */
async function downloadFile(url, destPath) {
  const buffer = await fetchUrl(url, {});
  
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

/**
 * Generate filename for the font
 */
function getFontFilename(family, weight) {
  const familyName = family.replace(/\s+/g, "");
  const weightName = WEIGHT_NAMES[weight] || weight;
  return `${familyName}-${weightName}.ttf`;
}

/**
 * Generate TypeScript file with font list
 */
function generateTypescriptFile(downloadedFonts) {
  // Group by family
  const fontsByFamily = {};
  for (const { family, weight, filename } of downloadedFonts) {
    if (!fontsByFamily[family]) {
      fontsByFamily[family] = { weights: {} };
    }
    fontsByFamily[family].weights[weight] = filename;
  }

  const familyNames = Object.keys(fontsByFamily).sort();
  
  let ts = `/**
 * Available local fonts downloaded from Google Fonts
 * 
 * Generated by: npm run download-fonts
 * 
 * Usage:
 *   import { fonts, getFontUrl } from "./fonts";
 *   const url = getFontUrl("Inter", 700);
 * 
 * The getFontUrl function is fully type-safe - TypeScript will only
 * allow valid font/weight combinations that are actually available.
 */

import { staticFile } from "remotion";

// Font weight type
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// Available font families
export type FontFamily =
${familyNames.map(f => `  | "${f}"`).join("\n")};

// ============================================================================
// TYPE-SAFE FONT WEIGHT MAPPING
// Maps each font family to its available weights
// ============================================================================

export interface FontWeightMap {
${familyNames.map(family => {
  const weights = Object.keys(fontsByFamily[family].weights).map(Number).sort((a, b) => a - b);
  return `  "${family}": ${weights.join(" | ")};`;
}).join("\n")}
}

// Helper type to get available weights for a font family
export type AvailableWeights<F extends FontFamily> = FontWeightMap[F];

// Font variant info
export interface FontVariant {
  weight: FontWeight;
  filename: string;
}

// Font family info
export interface FontInfo<F extends FontFamily = FontFamily> {
  family: F;
  weights: AvailableWeights<F>[];
  variants: Partial<Record<FontWeight, string>>;
}

/**
 * All available fonts with their variants
 */
export const fonts: { [F in FontFamily]: FontInfo<F> } = {
${familyNames.map(family => {
  const info = fontsByFamily[family];
  const weights = Object.keys(info.weights).map(Number).sort((a, b) => a - b);
  const variants = weights.map(w => `    ${w}: "${info.weights[w]}"`).join(",\n");
  return `  "${family}": {
    family: "${family}",
    weights: [${weights.join(", ")}],
    variants: {
${variants}
    },
  }`;
}).join(",\n")}
} as const;

/**
 * Get the font URL for a specific family and weight
 * 
 * This function is fully type-safe - TypeScript will only allow
 * valid font/weight combinations that are actually available.
 * 
 * @example
 * // Valid calls:
 * getFontUrl("Inter", 700);        // OK - Inter has weight 700
 * getFontUrl("Anton", 400);        // OK - Anton has weight 400
 * 
 * // Invalid calls (TypeScript errors):
 * getFontUrl("Anton", 700);        // Error - Anton only has weight 400
 * getFontUrl("Inter", 100);        // Error - Inter doesn't have weight 100
 */
export function getFontUrl<F extends FontFamily>(
  family: F,
  weight: AvailableWeights<F>
): string {
  const font = fonts[family];
  const filename = font.variants[weight as FontWeight];
  
  if (!filename) {
    throw new Error(\`Weight \${weight} not available for "\${family}". Available: \${font.weights.join(", ")}\`);
  }
  
  return staticFile(\`fonts/\${filename}\`);
}

/**
 * Get all available weights for a font family
 */
export function getFontWeights<F extends FontFamily>(family: F): AvailableWeights<F>[] {
  return fonts[family].weights;
}

/**
 * List all available font families
 */
export function getFontFamilies(): FontFamily[] {
  return Object.keys(fonts) as FontFamily[];
}

/**
 * Check if a font family is available
 */
export function hasFontFamily(family: string): family is FontFamily {
  return family in fonts;
}

/**
 * Check if a specific font variant is available
 */
export function hasFontVariant<F extends FontFamily>(
  family: F, 
  weight: FontWeight
): weight is AvailableWeights<F> {
  const font = fonts[family];
  return font ? weight in font.variants : false;
}
`;

  return ts;
}

/**
 * Main function
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Downloading Top 50 Google Fonts");
  console.log("=".repeat(60));
  console.log();

  const downloadedFonts = [];
  const failed = [];
  let totalSize = 0;

  for (const [family, weights] of TOP_FONTS) {
    console.log(`\n📦 ${family}`);
    
    for (const weight of weights) {
      const filename = getFontFilename(family, weight);
      const destPath = path.join(FONTS_DIR, filename);
      
      // Skip if already exists
      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        console.log(`   ✓ ${WEIGHT_NAMES[weight]} (${weight}) - already exists`);
        downloadedFonts.push({ family, weight, filename });
        totalSize += stats.size;
        continue;
      }
      
      try {
        const ttfUrl = await getGoogleFontTTFUrl(family, weight);
        
        if (!ttfUrl) {
          console.log(`   ✗ ${WEIGHT_NAMES[weight]} (${weight}) - TTF not available`);
          failed.push({ family, weight, reason: "TTF not available" });
          continue;
        }
        
        const size = await downloadFile(ttfUrl, destPath);
        console.log(`   ✓ ${WEIGHT_NAMES[weight]} (${weight}) - ${(size / 1024).toFixed(1)} KB`);
        downloadedFonts.push({ family, weight, filename });
        totalSize += size;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`   ✗ ${WEIGHT_NAMES[weight]} (${weight}) - ${error.message}`);
        failed.push({ family, weight, reason: error.message });
      }
    }
  }

  // Generate TypeScript file
  console.log("\n" + "=".repeat(60));
  console.log("Generating TypeScript fonts file...");
  
  const tsContent = generateTypescriptFile(downloadedFonts);
  fs.writeFileSync(TS_OUTPUT, tsContent);
  console.log(`✓ Generated: ${TS_OUTPUT}`);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log(`✓ Downloaded: ${downloadedFonts.length} font variants`);
  console.log(`✗ Failed: ${failed.length} font variants`);
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 TypeScript: ${TS_OUTPUT}`);
  
  if (failed.length > 0) {
    console.log("\nFailed fonts:");
    for (const { family, weight, reason } of failed) {
      console.log(`  - ${family} ${weight}: ${reason}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Usage in your code:");
  console.log("=".repeat(60));
  console.log(`
import { getFontUrl, fonts } from "../remotion/fonts";

// Get a specific font URL
const interBold = getFontUrl("Inter", 700);

// List all available fonts
console.log(Object.keys(fonts));

// Check available weights
console.log(fonts["Poppins"].weights);
`);
}

main().catch(console.error);
