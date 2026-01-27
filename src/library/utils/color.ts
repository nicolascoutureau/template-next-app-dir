/**
 * Color manipulation utilities for motion design.
 * Professional motion design constantly manipulates colors — 
 * lighten for highlights, darken for shadows, adjust opacity, create tints.
 */

/**
 * Parses a color string to RGB values.
 */
function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  // Handle hex colors
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
  }

  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Handle hsl/hsla
  const hslMatch = color.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360;
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;

    // HSL to RGB conversion
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
      a,
    };
  }

  // Default to black
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Converts RGB to hex string.
 */
function toHex(r: number, g: number, b: number, a?: number): string {
  const hex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  if (a !== undefined && a < 1) {
    return `#${hex(r)}${hex(g)}${hex(b)}${hex(a * 255)}`;
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Converts RGB to rgba string.
 */
function toRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

/**
 * Color manipulation utilities.
 */
export const color = {
  /**
   * Lighten a color by a percentage (0-1).
   * 
   * @example
   * color.lighten("#3b82f6", 0.2) // 20% lighter
   */
  lighten(c: string, amount: number): string {
    const { r, g, b, a } = parseColor(c);
    const lighten = (v: number) => v + (255 - v) * amount;
    return a < 1
      ? toRgba(lighten(r), lighten(g), lighten(b), a)
      : toHex(lighten(r), lighten(g), lighten(b));
  },

  /**
   * Darken a color by a percentage (0-1).
   * 
   * @example
   * color.darken("#3b82f6", 0.2) // 20% darker
   */
  darken(c: string, amount: number): string {
    const { r, g, b, a } = parseColor(c);
    const darken = (v: number) => v * (1 - amount);
    return a < 1
      ? toRgba(darken(r), darken(g), darken(b), a)
      : toHex(darken(r), darken(g), darken(b));
  },

  /**
   * Set or adjust opacity of a color.
   * 
   * @example
   * color.alpha("#3b82f6", 0.5) // 50% opacity
   */
  alpha(c: string, opacity: number): string {
    const { r, g, b } = parseColor(c);
    return toRgba(r, g, b, opacity);
  },

  /**
   * Mix two colors together.
   * 
   * @example
   * color.mix("#3b82f6", "#ef4444", 0.5) // 50% blend
   */
  mix(c1: string, c2: string, amount: number = 0.5): string {
    const color1 = parseColor(c1);
    const color2 = parseColor(c2);
    const mix = (v1: number, v2: number) => v1 + (v2 - v1) * amount;
    return toHex(
      mix(color1.r, color2.r),
      mix(color1.g, color2.g),
      mix(color1.b, color2.b),
      mix(color1.a, color2.a)
    );
  },

  /**
   * Interpolate between multiple colors based on progress (0-1).
   * 
   * @example
   * color.interpolate(["#ff0000", "#00ff00", "#0000ff"], 0.5) // green
   */
  interpolate(colors: string[], progress: number): string {
    if (colors.length === 0) return "#000000";
    if (colors.length === 1) return colors[0];

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const segment = clampedProgress * (colors.length - 1);
    const index = Math.floor(segment);
    const localProgress = segment - index;

    if (index >= colors.length - 1) return colors[colors.length - 1];

    return color.mix(colors[index], colors[index + 1], localProgress);
  },

  /**
   * Parse a color to its RGB components.
   */
  parse: parseColor,

  /**
   * Convert RGB to hex.
   */
  toHex,

  /**
   * Convert RGB to rgba string.
   */
  toRgba,
};
