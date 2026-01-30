import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  AmbianceBackground,
  GradientOrbs,
} from "../../remotion/library/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof AmbianceBackground> = {
  title: "Effects/AmbianceBackground",
  component: AmbianceBackground,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    preset: {
      control: "select",
      options: [
        "midnight",
        "aurora",
        "sunset",
        "ocean",
        "lavender",
        "ember",
        "forest",
        "cosmic",
        "minimal",
        "warm",
        "cool",
        "softPink",
        "softLavender",
        "softCloud",
        "softPeach",
        "softMint",
        "softSky",
      ],
    },
    speed: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    grain: { control: "boolean" },
    grainOpacity: { control: { type: "range", min: 0, max: 0.1, step: 0.01 } },
    vignette: { control: "boolean" },
    vignetteIntensity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
    rays: { control: "boolean" },
    brightness: { control: { type: "range", min: 0.5, max: 1.5, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof AmbianceBackground>;

// Content overlay
const Content = ({ title, dark = true }: { title: string; dark?: boolean }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        fontSize: 56,
        fontWeight: 700,
        color: dark ? "#fff" : "#1a1a1a",
        textShadow: dark ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 18,
        color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
        letterSpacing: 2,
      }}
    >
      PREMIUM BACKGROUND
    </div>
  </AbsoluteFill>
);

// === DARK PRESETS ===

export const Midnight: Story = {
  args: { preset: "midnight", speed: 0.3 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Midnight" />
    </AmbianceBackground>
  ),
};

export const Aurora: Story = {
  args: { preset: "aurora", speed: 0.3 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Aurora" />
    </AmbianceBackground>
  ),
};

export const Sunset: Story = {
  args: { preset: "sunset", speed: 0.25 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Sunset" />
    </AmbianceBackground>
  ),
};

export const Ocean: Story = {
  args: { preset: "ocean", speed: 0.3 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Ocean" />
    </AmbianceBackground>
  ),
};

export const Lavender: Story = {
  args: { preset: "lavender", speed: 0.25 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Lavender" />
    </AmbianceBackground>
  ),
};

export const Ember: Story = {
  args: { preset: "ember", speed: 0.2 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Ember" />
    </AmbianceBackground>
  ),
};

export const Forest: Story = {
  args: { preset: "forest", speed: 0.2 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Forest" />
    </AmbianceBackground>
  ),
};

export const Cosmic: Story = {
  args: { preset: "cosmic", speed: 0.3 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Cosmic" />
    </AmbianceBackground>
  ),
};

// === LIGHT PRESETS ===

export const Minimal: Story = {
  args: { preset: "minimal", speed: 0.2 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Minimal" dark={false} />
    </AmbianceBackground>
  ),
};

export const Warm: Story = {
  args: { preset: "warm", speed: 0.2 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Warm" dark={false} />
    </AmbianceBackground>
  ),
};

export const Cool: Story = {
  args: { preset: "cool", speed: 0.2 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Cool" dark={false} />
    </AmbianceBackground>
  ),
};

// === SOFT/DREAMY PRESETS ===

export const SoftPink: Story = {
  args: { preset: "softPink", speed: 0.25, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Pink" dark={false} />
    </AmbianceBackground>
  ),
};

export const SoftLavender: Story = {
  args: { preset: "softLavender", speed: 0.25, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Lavender" dark={false} />
    </AmbianceBackground>
  ),
};

export const SoftCloud: Story = {
  args: { preset: "softCloud", speed: 0.2, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Cloud" dark={false} />
    </AmbianceBackground>
  ),
};

export const SoftPeach: Story = {
  args: { preset: "softPeach", speed: 0.25, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Peach" dark={false} />
    </AmbianceBackground>
  ),
};

export const SoftMint: Story = {
  args: { preset: "softMint", speed: 0.25, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Mint" dark={false} />
    </AmbianceBackground>
  ),
};

export const SoftSky: Story = {
  args: { preset: "softSky", speed: 0.25, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Soft Sky" dark={false} />
    </AmbianceBackground>
  ),
};

// === WITH EFFECTS ===

export const WithLightRays: Story = {
  args: { preset: "cosmic", speed: 0.3, rays: true },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Light Rays" />
    </AmbianceBackground>
  ),
};

export const HeavyVignette: Story = {
  args: {
    preset: "midnight",
    speed: 0.25,
    vignette: true,
    vignetteIntensity: 0.7,
  },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Vignette" />
    </AmbianceBackground>
  ),
};

export const NoGrain: Story = {
  args: { preset: "aurora", speed: 0.3, grain: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="No Grain" />
    </AmbianceBackground>
  ),
};

export const Static: Story = {
  args: { preset: "lavender", speed: 0 },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Static" />
    </AmbianceBackground>
  ),
};

// === CUSTOM COLORS ===

export const CustomColors: Story = {
  args: {
    preset: "midnight",
    primaryColor: "#ff0080",
    secondaryColor: "#7928ca",
    accentColor: "#00d4ff",
    speed: 0.3,
  },
  render: (args) => (
    <AmbianceBackground {...args}>
      <Content title="Custom" />
    </AmbianceBackground>
  ),
};

// === GRADIENT ORBS ===

export const GradientOrbsExample: Story = {
  render: () => (
    <GradientOrbs
      colors={["#667eea", "#764ba2", "#ec4899"]}
      count={3}
      speed={0.4}
      blur={80}
    >
      <Content title="Orbs" />
    </GradientOrbs>
  ),
};

export const GradientOrbsNeon: Story = {
  render: () => (
    <GradientOrbs
      colors={["#00ff88", "#00d4ff", "#ff0080"]}
      count={3}
      speed={0.5}
      blur={70}
      background="#0a0a0a"
    >
      <Content title="Neon Orbs" />
    </GradientOrbs>
  ),
};

// === GALLERY ===

export const PresetGallery: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const darkPresets = [
      "midnight",
      "aurora",
      "sunset",
      "ocean",
      "lavender",
      "cosmic",
    ] as const;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 8,
          padding: 8,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {darkPresets.map((preset) => (
          <div
            key={preset}
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <AmbianceBackground
              preset={preset}
              speed={0.3}
              vignette={false}
              grain={false}
            >
              <AbsoluteFill
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    textTransform: "capitalize",
                  }}
                >
                  {preset}
                </span>
              </AbsoluteFill>
            </AmbianceBackground>
          </div>
        ))}
      </div>
    );
  },
};

export const SoftPresetGallery: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#f5f5f5">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const softPresets = [
      "softPink",
      "softLavender",
      "softCloud",
      "softPeach",
      "softMint",
      "softSky",
    ] as const;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 8,
          padding: 8,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {softPresets.map((preset) => (
          <div
            key={preset}
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <AmbianceBackground
              preset={preset}
              speed={0.25}
              vignette={false}
              grain={false}
            >
              <AbsoluteFill
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#333",
                    textTransform: "capitalize",
                  }}
                >
                  {preset.replace("soft", "Soft ")}
                </span>
              </AbsoluteFill>
            </AmbianceBackground>
          </div>
        ))}
      </div>
    );
  },
};

// Example like the reference image - soft lavender/pink
export const DreamyLight: Story = {
  args: { preset: "softLavender", speed: 0.2, grain: false, vignette: false },
  render: (args) => (
    <AmbianceBackground {...args}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 500,
            background: "linear-gradient(180deg, #1a1a1a 0%, #666 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Let's jump in!
        </span>
        <div
          style={{
            width: 4,
            height: 60,
            background: "linear-gradient(180deg, #38bdf8 0%, #3b82f6 100%)",
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AmbianceBackground>
  ),
};
