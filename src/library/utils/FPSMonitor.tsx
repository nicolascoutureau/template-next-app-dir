"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface FPSMonitorProps {
  /** Position of the monitor on screen */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Show additional stats (frame time, memory if available) */
  showDetails?: boolean;
  /** Custom styles to override defaults */
  style?: React.CSSProperties;
  /** Graph width in pixels */
  graphWidth?: number;
  /** Graph height in pixels */
  graphHeight?: number;
  /** Number of samples to show in graph */
  sampleCount?: number;
  /** Warning threshold (yellow) */
  warningThreshold?: number;
  /** Critical threshold (red) */
  criticalThreshold?: number;
}

interface Stats {
  fps: number;
  frameTime: number;
  memory?: number;
  minFps: number;
  maxFps: number;
  avgFps: number;
}

const positionStyles: Record<string, React.CSSProperties> = {
  "top-left": { top: 10, left: 10 },
  "top-right": { top: 10, right: 10 },
  "bottom-left": { bottom: 10, left: 10 },
  "bottom-right": { bottom: 10, right: 10 },
};

/**
 * FPSMonitor - A performance monitoring overlay for React applications.
 * Shows real-time FPS, frame time, and optional memory usage with a visual graph.
 */
export const FPSMonitor: React.FC<FPSMonitorProps> = ({
  position = "top-right",
  showDetails = true,
  style,
  graphWidth = 100,
  graphHeight = 40,
  sampleCount = 100,
  warningThreshold = 50,
  criticalThreshold = 30,
}) => {
  const [stats, setStats] = useState<Stats>({
    fps: 0,
    frameTime: 0,
    minFps: Infinity,
    maxFps: 0,
    avgFps: 0,
  });
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsValuesRef = useRef<number[]>([]);
  const rafIdRef = useRef<number | undefined>(undefined);

  const updateStats = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    // Update every 100ms for smoother display
    if (now - lastTimeRef.current >= 100) {
      const elapsed = now - lastTimeRef.current;
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
      const frameTime = elapsed / frameCountRef.current;

      // Track FPS values for min/max/avg
      fpsValuesRef.current.push(currentFps);
      if (fpsValuesRef.current.length > 600) {
        // Keep last 60 seconds at 10 samples/sec
        fpsValuesRef.current.shift();
      }

      const minFps = Math.min(...fpsValuesRef.current);
      const maxFps = Math.max(...fpsValuesRef.current);
      const avgFps = Math.round(
        fpsValuesRef.current.reduce((a, b) => a + b, 0) /
          fpsValuesRef.current.length
      );

      // Get memory if available (Chrome only)
      let memory: number | undefined;
      if ("memory" in performance) {
        const perfMemory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        memory = Math.round(perfMemory.usedJSHeapSize / 1048576); // Convert to MB
      }

      setStats({ fps: currentFps, frameTime, memory, minFps, maxFps, avgFps });
      setFpsHistory((prev) => {
        const newHistory = [...prev, currentFps];
        if (newHistory.length > sampleCount) {
          return newHistory.slice(-sampleCount);
        }
        return newHistory;
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    rafIdRef.current = requestAnimationFrame(updateStats);
  }, [sampleCount]);

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(updateStats);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateStats]);

  const getFpsColor = (fps: number): string => {
    if (fps >= warningThreshold) return "#22c55e"; // Green
    if (fps >= criticalThreshold) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const renderGraph = () => {
    if (fpsHistory.length < 2) return null;

    const maxFpsInHistory = Math.max(...fpsHistory, 60);
    const points = fpsHistory
      .map((fps, i) => {
        const x = (i / (sampleCount - 1)) * graphWidth;
        const y = graphHeight - (fps / maxFpsInHistory) * graphHeight;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg
        width={graphWidth}
        height={graphHeight}
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: 4,
          marginTop: 6,
        }}
      >
        {/* Grid lines */}
        <line
          x1={0}
          y1={graphHeight / 2}
          x2={graphWidth}
          y2={graphHeight / 2}
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="2,2"
        />
        <line
          x1={0}
          y1={graphHeight * 0.75}
          x2={graphWidth}
          y2={graphHeight * 0.75}
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="2,2"
        />

        {/* Warning threshold line */}
        <line
          x1={0}
          y1={graphHeight - (warningThreshold / maxFpsInHistory) * graphHeight}
          x2={graphWidth}
          y2={graphHeight - (warningThreshold / maxFpsInHistory) * graphHeight}
          stroke="rgba(234, 179, 8, 0.3)"
          strokeDasharray="4,4"
        />

        {/* FPS line */}
        <polyline
          points={points}
          fill="none"
          stroke={getFpsColor(stats.fps)}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 99999,
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        color: "#fff",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        padding: isCollapsed ? "6px 10px" : "10px 14px",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        userSelect: "none",
        minWidth: isCollapsed ? "auto" : 120,
        ...positionStyles[position],
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: "pointer",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: getFpsColor(stats.fps),
            }}
          >
            {stats.fps}
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>FPS</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
          {isCollapsed ? "▼" : "▲"}
        </span>
      </div>

      {!isCollapsed && (
        <>
          {showDetails && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Frame:</span>
                <span>{stats.frameTime.toFixed(1)}ms</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Min/Max:</span>
                <span>
                  {stats.minFps === Infinity ? "-" : stats.minFps}/
                  {stats.maxFps === 0 ? "-" : stats.maxFps}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Avg:</span>
                <span>{stats.avgFps || "-"}</span>
              </div>
              {stats.memory !== undefined && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Memory:</span>
                  <span>{stats.memory}MB</span>
                </div>
              )}
            </div>
          )}

          {renderGraph()}
        </>
      )}
    </div>
  );
};

/**
 * Hook to get FPS stats without rendering UI
 */
export const useFPS = (): Stats => {
  const [stats, setStats] = useState<Stats>({
    fps: 0,
    frameTime: 0,
    minFps: Infinity,
    maxFps: 0,
    avgFps: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsValuesRef = useRef<number[]>([]);
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 100) {
        const elapsed = now - lastTimeRef.current;
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        const frameTime = elapsed / frameCountRef.current;

        fpsValuesRef.current.push(currentFps);
        if (fpsValuesRef.current.length > 600) {
          fpsValuesRef.current.shift();
        }

        const minFps = Math.min(...fpsValuesRef.current);
        const maxFps = Math.max(...fpsValuesRef.current);
        const avgFps = Math.round(
          fpsValuesRef.current.reduce((a, b) => a + b, 0) /
            fpsValuesRef.current.length
        );

        let memory: number | undefined;
        if ("memory" in performance) {
          const perfMemory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
          memory = Math.round(perfMemory.usedJSHeapSize / 1048576);
        }

        setStats({ fps: currentFps, frameTime, memory, minFps, maxFps, avgFps });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(update);
    };

    rafIdRef.current = requestAnimationFrame(update);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return stats;
};

export default FPSMonitor;
