#!/usr/bin/env node

/**
 * Download Google Fonts as TTF files for use with opentype.js
 * 
 * Usage:
 *   node scripts/download-google-font.mjs "Font Family" [weight] [--italic]
 * 
 * Examples:
 *   node scripts/download-google-font.mjs "Inter" 700
 *   node scripts/download-google-font.mjs "Playfair Display" 400 --italic
 *   node scripts/download-google-font.mjs "Poppins" 600
 * 
 * Or use npm script:
 *   npm run download-font "Inter" 700
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FONTS_DIR = path.join(__dirname, "..", "public", "fonts");

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
      headers: {
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
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
async function getGoogleFontTTFUrl(family, weight = 400, italic = false) {
  // Build Google Fonts CSS API URL
  const weightSpec = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const apiUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${weightSpec}&display=swap`;

  console.log(`Fetching font CSS from: ${apiUrl}`);

  // Use an old user-agent to get TTF format
  // Try multiple user-agents until we get TTF
  const userAgents = [
    // Old IE - should definitely get TTF
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
    // Old Safari
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    // Very old Firefox
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6",
  ];

  for (const userAgent of userAgents) {
    try {
      const cssBuffer = await fetchUrl(apiUrl, { "User-Agent": userAgent });
      const css = cssBuffer.toString("utf-8");

      // Look for TTF URL
      const ttfMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);
      if (ttfMatch && ttfMatch[1]) {
        console.log(`Found TTF URL with user-agent: ${userAgent.substring(0, 30)}...`);
        return ttfMatch[1];
      }

      // Check what format we got
      const formatMatch = css.match(/format\(['"]([^'"]+)['"]\)/);
      if (formatMatch) {
        console.log(`Got format "${formatMatch[1]}" with this user-agent, trying next...`);
      }
    } catch (error) {
      console.log(`Failed with user-agent, trying next: ${error.message}`);
    }
  }

  // If we couldn't get TTF, try the Fontsource CDN as fallback
  console.log("Trying Fontsource CDN as fallback...");
  const fontsourceName = family.toLowerCase().replace(/\s+/g, "-");
  const fontsourceUrl = `https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/latin-${weight}-normal.ttf`;
  
  try {
    // Test if the URL exists
    await fetchUrl(fontsourceUrl, {});
    console.log(`Found font on Fontsource CDN`);
    return fontsourceUrl;
  } catch {
    // Fontsource didn't work either
  }

  throw new Error(
    `Could not find TTF format for "${family}" weight ${weight}. ` +
    `Google Fonts may only serve WOFF2 for this font. ` +
    `Try downloading manually from https://fonts.google.com/specimen/${encodeURIComponent(family)}`
  );
}

/**
 * Download a file from URL
 */
async function downloadFile(url, destPath) {
  console.log(`Downloading from: ${url}`);
  const buffer = await fetchUrl(url, {});
  
  // Ensure directory exists
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(destPath, buffer);
  console.log(`Saved to: ${destPath}`);
  return buffer.length;
}

/**
 * Generate filename for the font
 */
function getFontFilename(family, weight, italic) {
  const familyName = family.replace(/\s+/g, "");
  const weightName = WEIGHT_NAMES[weight] || weight;
  const italicSuffix = italic ? "Italic" : "";
  return `${familyName}-${weightName}${italicSuffix}.ttf`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Download Google Fonts as TTF files

Usage:
  node scripts/download-google-font.mjs "Font Family" [weight] [--italic]

Arguments:
  Font Family    The name of the Google Font (required)
  weight         Font weight: 100-900 (default: 400)
  --italic       Download italic variant

Examples:
  node scripts/download-google-font.mjs "Inter" 700
  node scripts/download-google-font.mjs "Playfair Display" 400 --italic
  node scripts/download-google-font.mjs "Poppins" 600

Available weights:
  100 = Thin
  200 = ExtraLight  
  300 = Light
  400 = Regular
  500 = Medium
  600 = SemiBold
  700 = Bold
  800 = ExtraBold
  900 = Black
`);
    process.exit(0);
  }

  const family = args[0];
  const weight = parseInt(args.find(a => /^\d+$/.test(a)) || "400", 10);
  const italic = args.includes("--italic");

  if (!family) {
    console.error("Error: Font family name is required");
    process.exit(1);
  }

  if (weight < 100 || weight > 900 || weight % 100 !== 0) {
    console.error("Error: Weight must be 100, 200, 300, 400, 500, 600, 700, 800, or 900");
    process.exit(1);
  }

  console.log(`\nDownloading Google Font:`);
  console.log(`  Family: ${family}`);
  console.log(`  Weight: ${weight} (${WEIGHT_NAMES[weight] || "Custom"})`);
  console.log(`  Style:  ${italic ? "Italic" : "Normal"}\n`);

  try {
    // Get the TTF URL
    const ttfUrl = await getGoogleFontTTFUrl(family, weight, italic);
    
    // Generate filename and path
    const filename = getFontFilename(family, weight, italic);
    const destPath = path.join(FONTS_DIR, filename);
    
    // Download the file
    const size = await downloadFile(ttfUrl, destPath);
    
    console.log(`\n✓ Successfully downloaded ${filename} (${(size / 1024).toFixed(1)} KB)`);
    console.log(`\nUsage in your code:`);
    console.log(`  import { staticFile } from "remotion";`);
    console.log(`  const fontUrl = staticFile("fonts/${filename}");`);
    
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
