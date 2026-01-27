/**
 * Production-tested easing curves for motion design.
 * Named easings are faster to reach for than tuning spring parameters.
 */

/**
 * Cubic bezier helper.
 */
function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  // Newton-Raphson iteration for cubic bezier
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number): number => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEstimate = sampleCurveX(t) - x;
      if (Math.abs(xEstimate) < 1e-6) return t;
      const derivative = sampleCurveDerivativeX(t);
      if (Math.abs(derivative) < 1e-6) break;
      t -= xEstimate / derivative;
    }
    return t;
  };

  return (t: number) => sampleCurveY(solveCurveX(t));
}

/**
 * Named easing curves optimized for motion design production.
 */
export const easing = {
  /**
   * Quick attack, smooth settle. Perfect for UI elements appearing.
   * Like a confident tap that lands softly.
   */
  snappy: bezier(0.2, 0, 0, 1),

  /**
   * Buttery smooth movement. The go-to for elegant motion.
   * Standard CSS ease but slightly more refined.
   */
  smooth: bezier(0.25, 0.1, 0.25, 1),

  /**
   * Single bounce at the end. Adds playfulness without being excessive.
   * Great for elements "landing" in place.
   */
  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },

  /**
   * Springy overshoot. For elements that need to feel alive and reactive.
   * Overshoots then settles back.
   */
  elastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  /**
   * Slow, weighted movement. For large elements or cinematic transitions.
   * Feels like something with mass moving through resistance.
   */
  heavy: bezier(0.7, 0, 0.3, 1),

  /**
   * Fast overshoot + settle. Perfect for UI elements popping in.
   * Snappier and more energetic than elastic.
   */
  pop: bezier(0.34, 1.56, 0.64, 1),

  /**
   * Linear - no easing. Use sparingly; most motion should have easing.
   * Good for continuous rotation or progress bars.
   */
  linear: (t: number): number => t,

  /**
   * Ease in - starts slow, accelerates. For exits and things leaving frame.
   */
  in: bezier(0.4, 0, 1, 1),

  /**
   * Ease out - starts fast, decelerates. For entrances and reveals.
   */
  out: bezier(0, 0, 0.2, 1),

  /**
   * Ease in-out - slow start and end. For elements moving between states.
   */
  inOut: bezier(0.4, 0, 0.2, 1),

  /**
   * Anticipation - slight pull back before motion. 
   * Creates expectation, like winding up for a throw.
   */
  anticipate: bezier(0.36, 0, 0.66, -0.56),

  /**
   * Custom bezier curve creator.
   */
  bezier,
};
