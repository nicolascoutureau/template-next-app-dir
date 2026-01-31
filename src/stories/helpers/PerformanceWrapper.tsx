import React, { useState, useEffect, useCallback } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill } from "remotion";
import { PerformanceMonitor, PerformanceMetrics } from "./PerformanceMonitor";

export interface PerformanceWrapperProps {
  children: React.ReactNode;
  /** Width of the player */
  width?: number;
  /** Height of the player */
  height?: number;
  /** Duration in frames */
  durationInFrames?: number;
  /** Frames per second */
  fps?: number;
  /** Whether to autoplay */
  autoPlay?: boolean;
  /** Whether to loop */
  loop?: boolean;
  /** Show controls */
  controls?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Component label for the performance monitor */
  componentLabel?: string;
  /** Show performance overlay */
  showPerformanceOverlay?: boolean;
  /** Overlay position */
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Callback when metrics are updated */
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

/**
 * Extended RemotionWrapper with integrated performance monitoring.
 * Use this wrapper to test component performance in Storybook.
 */
export const PerformanceWrapper: React.FC<PerformanceWrapperProps> = ({
  children,
  width = 800,
  height = 450,
  durationInFrames = 150,
  fps = 30,
  autoPlay = true,
  loop = true,
  controls = true,
  backgroundColor = "#ffffff",
  componentLabel = "Component",
  showPerformanceOverlay = true,
  overlayPosition = "top-right",
  onMetricsUpdate,
}) => {
  const [key, setKey] = useState(0);
  const [aggregateMetrics, setAggregateMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [children]);

  const handleMetricsUpdate = useCallback(
    (metrics: PerformanceMetrics) => {
      setAggregateMetrics(metrics);
      onMetricsUpdate?.(metrics);
    },
    [onMetricsUpdate]
  );

  const StoryComponent: React.FC = () => {
    return (
      <AbsoluteFill
        style={{
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PerformanceMonitor
          label={componentLabel}
          showOverlay={showPerformanceOverlay}
          overlayPosition={overlayPosition}
          onMetricsUpdate={handleMetricsUpdate}
        >
          {children}
        </PerformanceMonitor>
      </AbsoluteFill>
    );
  };

  const ratingColors: Record<string, string> = {
    excellent: "#22c55e",
    good: "#84cc16",
    acceptable: "#eab308",
    poor: "#ef4444",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "20px",
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#0a0a0a",
      }}
    >
      <Player
        key={key}
        component={StoryComponent}
        compositionWidth={width}
        compositionHeight={height}
        durationInFrames={durationInFrames}
        fps={fps}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        style={{
          width: "calc(100vw - 80px)",
          maxWidth: "1200px",
          aspectRatio: `${width} / ${height}`,
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      />
      {/* Summary Stats Panel */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "16px 24px",
          backgroundColor: "#111",
          borderRadius: "8px",
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#fff",
        }}
      >
        <StatItem label="Duration" value={`${durationInFrames} frames @ ${fps}fps`} />
        <StatItem label="Time" value={`${(durationInFrames / fps).toFixed(1)}s`} />
        {aggregateMetrics && (
          <>
            <StatItem
              label="Avg Render"
              value={`${aggregateMetrics.avgRenderTime.toFixed(2)}ms`}
              valueColor={ratingColors[aggregateMetrics.rating]}
            />
            <StatItem
              label="Est. FPS"
              value={aggregateMetrics.estimatedFPS.toFixed(1)}
              valueColor={aggregateMetrics.estimatedFPS >= 60 ? "#22c55e" : aggregateMetrics.estimatedFPS >= 30 ? "#eab308" : "#ef4444"}
            />
            <StatItem
              label="Rating"
              value={aggregateMetrics.rating.toUpperCase()}
              valueColor={ratingColors[aggregateMetrics.rating]}
            />
          </>
        )}
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string; valueColor?: string }> = ({
  label,
  value,
  valueColor = "#fff",
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <span style={{ color: "#666", fontSize: "10px", marginBottom: "4px" }}>{label}</span>
    <span style={{ color: valueColor, fontWeight: "bold" }}>{value}</span>
  </div>
);

/**
 * Create a Storybook decorator with performance monitoring.
 */
export const withPerformance = (options?: Partial<PerformanceWrapperProps>) => {
  return (Story: React.FC) => (
    <PerformanceWrapper {...options}>
      <Story />
    </PerformanceWrapper>
  );
};

export default PerformanceWrapper;
