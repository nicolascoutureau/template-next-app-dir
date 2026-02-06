import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCurrentFrame } from "remotion";

export interface PerformanceMetrics {
  /** Average render time in milliseconds */
  avgRenderTime: number;
  /** Minimum render time in milliseconds */
  minRenderTime: number;
  /** Maximum render time in milliseconds */
  maxRenderTime: number;
  /** Number of renders measured */
  renderCount: number;
  /** Frames per second estimate */
  estimatedFPS: number;
  /** Total elapsed time */
  totalTime: number;
  /** Last 10 render times for trend analysis */
  recentRenders: number[];
  /** Performance rating */
  rating: "excellent" | "good" | "acceptable" | "poor";
}

export interface PerformanceMonitorProps {
  children: React.ReactNode;
  /** Show performance overlay */
  showOverlay?: boolean;
  /** Position of overlay */
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Callback when metrics update */
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  /** Label for the component being tested */
  label?: string;
}

/**
 * Performance monitoring wrapper for Remotion components in Storybook.
 * Measures render times, FPS estimates, and provides performance ratings.
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  showOverlay = true,
  overlayPosition = "top-right",
  onMetricsUpdate,
  label = "Component",
}) => {
  const frame = useCurrentFrame();
  const renderStartRef = useRef<number>(performance.now());
  const renderTimesRef = useRef<number[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const startTimeRef = useRef<number>(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgRenderTime: 0,
    minRenderTime: Infinity,
    maxRenderTime: 0,
    renderCount: 0,
    estimatedFPS: 0,
    totalTime: 0,
    recentRenders: [],
    rating: "excellent",
  });

  // Record render start time
  renderStartRef.current = performance.now();

  // Calculate performance rating
  const getRating = useCallback((avgTime: number): PerformanceMetrics["rating"] => {
    if (avgTime < 4) return "excellent"; // 250+ FPS theoretical
    if (avgTime < 8) return "good"; // 125+ FPS theoretical
    if (avgTime < 16.67) return "acceptable"; // 60+ FPS
    return "poor"; // Below 60 FPS
  }, []);

  useEffect(() => {
    // Only measure on new frames
    if (frame === lastFrameRef.current) return;
    lastFrameRef.current = frame;

    const renderTime = performance.now() - renderStartRef.current;
    const times = renderTimesRef.current;
    times.push(renderTime);

    // Keep last 100 measurements
    if (times.length > 100) {
      times.shift();
    }

    const totalTime = (performance.now() - startTimeRef.current) / 1000;
    const avgRenderTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minRenderTime = Math.min(...times);
    const maxRenderTime = Math.max(...times);
    const estimatedFPS = times.length > 1 ? 1000 / avgRenderTime : 0;
    const recentRenders = times.slice(-10);

    const newMetrics: PerformanceMetrics = {
      avgRenderTime,
      minRenderTime,
      maxRenderTime,
      renderCount: times.length,
      estimatedFPS,
      totalTime,
      recentRenders,
      rating: getRating(avgRenderTime),
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);
  }, [frame, getRating, onMetricsUpdate]);

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: 10, left: 10 },
    "top-right": { top: 10, right: 10 },
    "bottom-left": { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
  };

  const ratingColors: Record<PerformanceMetrics["rating"], string> = {
    excellent: "#22c55e",
    good: "#84cc16",
    acceptable: "#eab308",
    poor: "#ef4444",
  };

  return (
    <>
      {children}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            ...positionStyles[overlayPosition],
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "11px",
            zIndex: 9999,
            minWidth: "200px",
            backdropFilter: "blur(4px)",
            border: `1px solid ${ratingColors[metrics.rating]}40`,
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              paddingBottom: "6px",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{label}</span>
            <span
              style={{
                color: ratingColors[metrics.rating],
                textTransform: "uppercase",
                fontSize: "10px",
              }}
            >
              {metrics.rating}
            </span>
          </div>
          <div style={{ display: "grid", gap: "4px" }}>
            <Row label="Frame" value={frame} />
            <Row
              label="Avg Render"
              value={`${metrics.avgRenderTime.toFixed(2)}ms`}
              color={ratingColors[metrics.rating]}
            />
            <Row label="Min/Max" value={`${metrics.minRenderTime.toFixed(2)} / ${metrics.maxRenderTime.toFixed(2)}ms`} />
            <Row
              label="Est. FPS"
              value={metrics.estimatedFPS.toFixed(1)}
              color={metrics.estimatedFPS >= 60 ? "#22c55e" : metrics.estimatedFPS >= 30 ? "#eab308" : "#ef4444"}
            />
            <Row label="Samples" value={metrics.renderCount} />
          </div>
          {/* Mini performance graph */}
          <div
            style={{
              marginTop: "8px",
              height: "30px",
              display: "flex",
              alignItems: "flex-end",
              gap: "1px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "8px",
            }}
          >
            {metrics.recentRenders.map((time, i) => {
              const height = Math.min(100, (time / 20) * 100);
              const barColor = time < 4 ? "#22c55e" : time < 8 ? "#84cc16" : time < 16.67 ? "#eab308" : "#ef4444";
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    minHeight: "2px",
                    backgroundColor: barColor,
                    borderRadius: "1px",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

const Row: React.FC<{ label: string; value: string | number; color?: string }> = ({
  label,
  value,
  color,
}) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ color: "#888" }}>{label}:</span>
    <span style={{ color: color || "#fff" }}>{value}</span>
  </div>
);

export default PerformanceMonitor;
