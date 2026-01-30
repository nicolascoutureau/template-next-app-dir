import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { Cursor, type CursorPoint } from "../../remotion/base/components/ui";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Cursor> = {
  title: "UI/Cursor",
  component: Cursor,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    size: { control: { type: "range", min: 16, max: 48, step: 4 } },
    color: { control: "color" },
    showClickRipple: { control: "boolean" },
    shadow: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Cursor>;

// Demo UI elements
const DemoUI = () => (
  <AbsoluteFill
    style={{
      padding: 40,
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}
  >
    <h1 style={{ margin: 0, fontSize: 32, color: "#1e293b" }}>Dashboard</h1>
    <div style={{ display: "flex", gap: 12 }}>
      <button
        style={{
          padding: "12px 24px",
          fontSize: 16,
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Click Me
      </button>
      <button
        style={{
          padding: "12px 24px",
          fontSize: 16,
          backgroundColor: "#e2e8f0",
          color: "#475569",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
    <input
      style={{
        padding: "12px 16px",
        fontSize: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        width: 300,
      }}
      placeholder="Type something..."
      readOnly
    />
    <div
      style={{
        width: 200,
        height: 150,
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
      }}
    >
      Drag me
    </div>
  </AbsoluteFill>
);

// === BASIC EXAMPLES ===

export const FollowPath: Story = {
  render: () => {
    const path: CursorPoint[] = [
      { x: 50, y: 50, frame: 0 },
      { x: 200, y: 100, frame: 30, ease: "smooth" },
      { x: 350, y: 80, frame: 60, ease: "smooth" },
      { x: 400, y: 200, frame: 90, ease: "smooth" },
      { x: 250, y: 250, frame: 120, ease: "smooth" },
      { x: 100, y: 180, frame: 150, ease: "smooth" },
    ];

    return (
      <>
        {/* Show path visualization */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d={`M ${path.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            stroke="#e2e8f0"
            strokeWidth={2}
            strokeDasharray="8 4"
            fill="none"
          />
          {path.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill="#94a3b8" />
          ))}
        </svg>
        <Cursor path={path} size={24} color="#000" />
      </>
    );
  },
};

export const ClickButton: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const path: CursorPoint[] = [
      { x: 100, y: 200, frame: 0, cursor: "default" },
      { x: 115, y: 115, frame: 30, cursor: "pointer", ease: "smooth" },
      { x: 115, y: 115, frame: 45, click: true }, // Click!
      { x: 115, y: 115, frame: 70 },
      { x: 250, y: 180, frame: 100, cursor: "default", ease: "smooth" },
    ];

    return (
      <>
        <DemoUI />
        <Cursor
          path={path}
          size={24}
          color="#000"
          rippleColor="rgba(59, 130, 246, 0.4)"
        />
      </>
    );
  },
};

export const DragAndDrop: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const path: CursorPoint[] = [
      { x: 100, y: 100, frame: 0, cursor: "default" },
      { x: 140, y: 310, frame: 30, cursor: "grab", ease: "smooth" },
      { x: 140, y: 310, frame: 45, click: true, cursor: "grabbing" },
      { x: 200, y: 280, frame: 70, cursor: "grabbing", ease: "snappy" },
      { x: 350, y: 250, frame: 100, cursor: "grabbing", ease: "smooth" },
      { x: 400, y: 310, frame: 130, cursor: "grabbing", ease: "smooth" },
      { x: 400, y: 310, frame: 145, cursor: "grab" },
      { x: 300, y: 200, frame: 170, cursor: "default", ease: "smooth" },
    ];

    return (
      <>
        <DemoUI />
        <Cursor path={path} size={24} color="#000" />
      </>
    );
  },
};

export const TextSelection: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const path: CursorPoint[] = [
      { x: 200, y: 150, frame: 0, cursor: "default" },
      { x: 60, y: 210, frame: 30, cursor: "text", ease: "smooth" },
      { x: 60, y: 210, frame: 45, click: true },
      // Simulate text selection drag
      { x: 150, y: 210, frame: 75, cursor: "text", ease: "linear" },
      { x: 250, y: 210, frame: 105, cursor: "text", ease: "linear" },
      { x: 250, y: 210, frame: 120 },
      { x: 350, y: 180, frame: 140, cursor: "default", ease: "smooth" },
    ];

    return (
      <>
        <DemoUI />
        <Cursor path={path} size={24} color="#000" />
      </>
    );
  },
};

// === STYLE VARIATIONS ===

export const WhiteCursor: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1e293b">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const path: CursorPoint[] = [
      { x: 100, y: 100, frame: 0 },
      { x: 300, y: 150, frame: 40, ease: "smooth" },
      { x: 300, y: 150, frame: 55, click: true },
      { x: 200, y: 250, frame: 90, ease: "smooth" },
    ];

    return (
      <Cursor
        path={path}
        size={28}
        color="#ffffff"
        rippleColor="rgba(255, 255, 255, 0.4)"
      />
    );
  },
};

export const LargeCursor: Story = {
  render: () => {
    const path: CursorPoint[] = [
      { x: 100, y: 100, frame: 0 },
      { x: 250, y: 180, frame: 50, ease: "smooth" },
      { x: 250, y: 180, frame: 70, click: true },
      { x: 400, y: 120, frame: 120, ease: "smooth" },
    ];

    return <Cursor path={path} size={40} color="#ef4444" />;
  },
};

export const NoRipple: Story = {
  render: () => {
    const path: CursorPoint[] = [
      { x: 100, y: 100, frame: 0 },
      { x: 200, y: 150, frame: 40, ease: "smooth" },
      { x: 200, y: 150, frame: 55, click: true },
      { x: 300, y: 100, frame: 90, ease: "smooth" },
      { x: 300, y: 100, frame: 105, click: true },
      { x: 400, y: 180, frame: 140, ease: "smooth" },
    ];

    return (
      <Cursor path={path} size={24} color="#000" showClickRipple={false} />
    );
  },
};

// === CURSOR STYLES ===

export const AllCursorStyles: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={240} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const path: CursorPoint[] = [
      { x: 80, y: 80, frame: 0, cursor: "default" },
      { x: 200, y: 80, frame: 30, cursor: "pointer", ease: "smooth" },
      { x: 320, y: 80, frame: 60, cursor: "text", ease: "smooth" },
      { x: 440, y: 80, frame: 90, cursor: "grab", ease: "smooth" },
      { x: 80, y: 200, frame: 120, cursor: "grabbing", ease: "smooth" },
      { x: 200, y: 200, frame: 150, cursor: "crosshair", ease: "smooth" },
      { x: 320, y: 200, frame: 180, cursor: "move", ease: "smooth" },
      { x: 440, y: 200, frame: 210, cursor: "default", ease: "smooth" },
    ];

    const labels = [
      { x: 80, y: 120, label: "default" },
      { x: 200, y: 120, label: "pointer" },
      { x: 320, y: 120, label: "text" },
      { x: 440, y: 120, label: "grab" },
      { x: 80, y: 240, label: "grabbing" },
      { x: 200, y: 240, label: "crosshair" },
      { x: 320, y: 240, label: "move" },
    ];

    return (
      <>
        {labels.map(({ x, y, label }) => (
          <div
            key={label}
            style={{
              position: "absolute",
              left: x - 30,
              top: y,
              fontSize: 12,
              color: "#64748b",
              fontFamily: "monospace",
            }}
          >
            {label}
          </div>
        ))}
        <Cursor path={path} size={32} color="#000" />
      </>
    );
  },
};

// === EASING COMPARISON ===

export const EasingComparison: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const easings = ["linear", "smooth", "snappy", "slow"] as const;
    const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];

    return (
      <>
        {/* Labels */}
        {easings.map((ease, i) => (
          <div
            key={ease}
            style={{
              position: "absolute",
              left: 30,
              top: 60 + i * 60,
              fontSize: 14,
              color: colors[i],
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            {ease}
          </div>
        ))}

        {/* Lines */}
        {easings.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 120,
              top: 68 + i * 60,
              width: 400,
              height: 2,
              backgroundColor: "#e2e8f0",
            }}
          />
        ))}

        {/* Cursors */}
        {easings.map((ease, i) => {
          const y = 60 + i * 60;
          const path: CursorPoint[] = [
            { x: 120, y, frame: 0 },
            { x: 520, y, frame: 120, ease },
          ];
          return (
            <Cursor
              key={ease}
              path={path}
              size={20}
              color={colors[i]}
              showClickRipple={false}
              shadow={false}
            />
          );
        })}
      </>
    );
  },
};
