/**
 * Layout positioning utilities for video composition.
 * Positioning elements in video is different from web — you often need
 * pixel-perfect centering, grid placement, or circular distribution.
 */

/**
 * Point in 2D space.
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * Grid configuration.
 */
export type GridConfig = {
  /** Number of columns. */
  cols: number;
  /** Gap between items in pixels. */
  gap?: number;
  /** Total width of the grid area. */
  width?: number;
  /** Total height of the grid area (auto if not specified). */
  height?: number;
  /** Starting X position. */
  startX?: number;
  /** Starting Y position. */
  startY?: number;
  /** Horizontal alignment within each cell. */
  alignX?: "start" | "center" | "end";
  /** Vertical alignment within each cell. */
  alignY?: "start" | "center" | "end";
};

/**
 * Circle distribution configuration.
 */
export type CircleConfig = {
  /** Radius of the circle. */
  radius: number;
  /** Center X position. */
  cx?: number;
  /** Center Y position. */
  cy?: number;
  /** Starting angle in degrees. Defaults to -90 (top). */
  startAngle?: number;
  /** Whether to distribute evenly or use endAngle. */
  endAngle?: number;
};

/**
 * Distribute configuration.
 */
export type DistributeConfig = {
  /** Axis to distribute along. */
  axis: "x" | "y";
  /** Starting position. */
  start: number;
  /** Ending position. */
  end: number;
  /** Fixed perpendicular position. */
  fixed?: number;
};

/**
 * Layout positioning utilities.
 */
export const layout = {
  /**
   * Get the center point of a rectangle.
   * 
   * @example
   * const center = layout.center(1920, 1080); // { x: 960, y: 540 }
   */
  center(width: number, height: number): Point {
    return { x: width / 2, y: height / 2 };
  },

  /**
   * Position items in a grid layout.
   * 
   * @example
   * // 6 items in 3 columns
   * const positions = layout.grid(6, { cols: 3, gap: 20, width: 800 });
   * // Returns array of { x, y } for each item
   * 
   * // With custom alignment
   * const positions = layout.grid(4, { cols: 2, gap: 10, alignX: "center" });
   */
  grid(count: number, config: GridConfig): Point[] {
    const {
      cols,
      gap = 0,
      width = 1920,
      startX = 0,
      startY = 0,
      alignX = "start",
      alignY = "start",
    } = config;

    const rows = Math.ceil(count / cols);
    const cellWidth = (width - gap * (cols - 1)) / cols;
    const cellHeight = config.height 
      ? (config.height - gap * (rows - 1)) / rows 
      : cellWidth;

    const points: Point[] = [];

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      let x = startX + col * (cellWidth + gap);
      let y = startY + row * (cellHeight + gap);

      // Apply alignment
      if (alignX === "center") x += cellWidth / 2;
      else if (alignX === "end") x += cellWidth;

      if (alignY === "center") y += cellHeight / 2;
      else if (alignY === "end") y += cellHeight;

      points.push({ x, y });
    }

    return points;
  },

  /**
   * Position items in a circle.
   * 
   * @example
   * // 8 items in a circle centered at (960, 540)
   * const positions = layout.circle(8, { radius: 200, cx: 960, cy: 540 });
   * 
   * // Semi-circle (180 degrees)
   * const positions = layout.circle(5, { 
   *   radius: 150, 
   *   startAngle: -90, 
   *   endAngle: 90 
   * });
   */
  circle(count: number, config: CircleConfig): Point[] {
    const {
      radius,
      cx = 0,
      cy = 0,
      startAngle = -90,
      endAngle,
    } = config;

    const points: Point[] = [];
    const startRad = (startAngle * Math.PI) / 180;
    
    // Full circle if no endAngle, otherwise arc
    const totalAngle = endAngle !== undefined
      ? ((endAngle - startAngle) * Math.PI) / 180
      : Math.PI * 2;
    
    // For full circle, don't include endpoint (it would overlap with start)
    const divisor = endAngle !== undefined ? count - 1 : count;

    for (let i = 0; i < count; i++) {
      const angle = startRad + (totalAngle * i) / Math.max(1, divisor);
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      });
    }

    return points;
  },

  /**
   * Distribute items evenly along an axis.
   * 
   * @example
   * // 5 items evenly spaced horizontally
   * const positions = layout.distribute(5, { axis: "x", start: 100, end: 1820 });
   * 
   * // Vertical distribution with fixed X
   * const positions = layout.distribute(3, { 
   *   axis: "y", 
   *   start: 200, 
   *   end: 880, 
   *   fixed: 960 
   * });
   */
  distribute(count: number, config: DistributeConfig): Point[] {
    const { axis, start, end, fixed = 0 } = config;
    const points: Point[] = [];
    const step = count > 1 ? (end - start) / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const position = start + step * i;
      points.push(
        axis === "x" 
          ? { x: position, y: fixed }
          : { x: fixed, y: position }
      );
    }

    return points;
  },

  /**
   * Create a staggered/offset grid (every other row shifted).
   * 
   * @example
   * const positions = layout.honeycomb(12, { cols: 4, gap: 30, offset: 0.5 });
   */
  honeycomb(
    count: number,
    config: GridConfig & { offset?: number }
  ): Point[] {
    const { offset = 0.5, ...gridConfig } = config;
    const baseGrid = layout.grid(count, gridConfig);
    const cellWidth = (gridConfig.width ?? 1920) / gridConfig.cols;

    return baseGrid.map((point, i) => {
      const row = Math.floor(i / gridConfig.cols);
      const isOffsetRow = row % 2 === 1;
      return {
        x: point.x + (isOffsetRow ? cellWidth * offset : 0),
        y: point.y,
      };
    });
  },

  /**
   * Get a point along a line between two points.
   * 
   * @example
   * const midpoint = layout.lerp({ x: 0, y: 0 }, { x: 100, y: 100 }, 0.5);
   * // { x: 50, y: 50 }
   */
  lerp(from: Point, to: Point, t: number): Point {
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  },

  /**
   * Calculate distance between two points.
   */
  distance(a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Calculate angle between two points in degrees.
   */
  angle(from: Point, to: Point): number {
    return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
  },
};
