import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { easing, color, layout, useLoopProgress } from "../index";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const meta: Meta = {
  title: "Motion Library/Utilities",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

// ============================================================================
// EASING UTILITIES
// ============================================================================

const EasingDemo = () => {
  const frame = useCurrentFrame();
  
  const easings = [
    { name: "snappy", fn: easing.snappy },
    { name: "smooth", fn: easing.smooth },
    { name: "bounce", fn: easing.bounce },
    { name: "elastic", fn: easing.elastic },
    { name: "heavy", fn: easing.heavy },
    { name: "pop", fn: easing.pop },
  ];

  const rawProgress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="flex flex-col gap-3">
      {easings.map(({ name, fn }) => {
        const progress = fn(rawProgress);
        return (
          <div key={name} className="flex items-center gap-4">
            <div className="w-20 text-right text-sm text-white/60">{name}</div>
            <div className="relative h-8 w-96 rounded bg-slate-800">
              <div
                className="absolute left-0 top-0 h-full rounded bg-gradient-to-r from-violet-500 to-purple-500"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white shadow-lg"
                style={{ left: `calc(${progress * 100}% - 12px)` }}
              />
            </div>
            <div className="w-16 text-sm text-white/40">
              {progress.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const EasingCurves: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={900} height={450}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="text-2xl font-bold text-white">Easing Utilities</div>
          <EasingDemo />
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

const ColorDemo = () => {
  const baseColor = "#3b82f6";
  const progress = useLoopProgress({ durationInFrames: 90 });

  return (
    <div className="flex flex-col gap-6">
      {/* Lighten/Darken */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-white/60">color.lighten / darken</div>
        <div className="flex gap-1">
          {[0.4, 0.3, 0.2, 0.1, 0, 0.1, 0.2, 0.3, 0.4].map((amount, i) => {
            const c = i < 4 
              ? color.darken(baseColor, amount)
              : i > 4 
                ? color.lighten(baseColor, amount)
                : baseColor;
            return (
              <div
                key={i}
                className="h-12 w-12 rounded"
                style={{ backgroundColor: c }}
              />
            );
          })}
        </div>
      </div>

      {/* Alpha */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-white/60">color.alpha</div>
        <div className="flex gap-1">
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((alpha, i) => (
            <div
              key={i}
              className="h-12 w-12 rounded"
              style={{ backgroundColor: color.alpha(baseColor, alpha) }}
            />
          ))}
        </div>
      </div>

      {/* Mix */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-white/60">color.mix</div>
        <div className="flex gap-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 rounded"
              style={{ 
                backgroundColor: color.mix("#ef4444", "#3b82f6", i / 10) 
              }}
            />
          ))}
        </div>
      </div>

      {/* Interpolate */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-white/60">color.interpolate (animated)</div>
        <div 
          className="h-12 w-full rounded"
          style={{ 
            backgroundColor: color.interpolate(
              ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"],
              progress
            ) 
          }}
        />
      </div>
    </div>
  );
};

export const ColorUtilities: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={500}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="text-2xl font-bold text-white">Color Utilities</div>
          <ColorDemo />
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

const LayoutGridDemo = () => {
  const positions = layout.grid(12, { 
    cols: 4, 
    gap: 10, 
    width: 300,
    startX: 50,
    startY: 50,
    alignX: "center",
    alignY: "center",
  });

  return (
    <div className="relative h-[250px] w-[400px] rounded-lg bg-slate-800/50">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-violet-500 text-sm font-bold text-white"
          style={{ left: pos.x, top: pos.y }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

const LayoutCircleDemo = () => {
  const positions = layout.circle(8, { 
    radius: 80, 
    cx: 150, 
    cy: 100,
  });

  return (
    <div className="relative h-[200px] w-[300px] rounded-lg bg-slate-800/50">
      {/* Center point */}
      <div
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
        style={{ left: 150, top: 100 }}
      />
      {/* Circle outline */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20"
        style={{ left: 150, top: 100, width: 160, height: 160 }}
      />
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white"
          style={{ left: pos.x, top: pos.y }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

const LayoutDistributeDemo = () => {
  const positions = layout.distribute(5, { 
    axis: "x", 
    start: 50, 
    end: 350,
    fixed: 50,
  });

  return (
    <div className="relative h-[100px] w-[400px] rounded-lg bg-slate-800/50">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-cyan-500 text-sm font-bold text-white"
          style={{ left: pos.x, top: pos.y }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export const LayoutUtilities: Story = {
  render: () => (
    <RemotionPreview durationInFrames={60} width={900} height={600}>
      <AbsoluteFill className="items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-8">
          <div className="text-2xl font-bold text-white">Layout Utilities</div>
          
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-white/60">layout.grid(12, cols: 4)</div>
              <LayoutGridDemo />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-white/60">layout.circle(8)</div>
              <LayoutCircleDemo />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-white/60">layout.distribute(5, axis: x)</div>
            <LayoutDistributeDemo />
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Combined showcase
const CombinedDemo = () => {
  const frame = useCurrentFrame();
  const positions = layout.circle(6, { radius: 120, cx: 400, cy: 225 });
  
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const colors = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <>
      {positions.map((pos, i) => {
        const itemProgress = easing.pop(
          Math.max(0, Math.min(1, (progress - i * 0.1) / 0.3))
        );
        const c = color.lighten(colors[i], itemProgress * 0.2);
        
        return (
          <div
            key={i}
            className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl text-white shadow-lg"
            style={{
              left: pos.x,
              top: pos.y,
              backgroundColor: c,
              opacity: itemProgress,
              transform: `translate(-50%, -50%) scale(${itemProgress})`,
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </>
  );
};

export const CombinedShowcase: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill className="bg-slate-950">
        <CombinedDemo />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50">
          layout.circle + easing.pop + color.lighten
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
