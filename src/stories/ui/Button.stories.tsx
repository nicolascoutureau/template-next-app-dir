import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  Button,
  GlossyButton,
  GlassButton,
  NeonButton,
  GradientButton,
  SoftButton,
  OutlineButton,
  PillButton,
} from "../../remotion/base/components/ui";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "glossy",
        "glass",
        "neon",
        "gradient",
        "soft",
        "outline",
        "solid",
        "pill",
        "rounded",
        "sharp",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: { control: "color" },
    secondaryColor: { control: "color" },
    textColor: { control: "color" },
    pressed: { control: "boolean" },
    disabled: { control: "boolean" },
    hover: { control: "boolean" },
    animate: { control: "boolean" },
    animationType: {
      control: "select",
      options: ["fadeIn", "scaleIn", "slideUp", "bounce"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Centered wrapper
const CenteredWrapper = ({
  children,
  dark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "#0f0f0f" : "#fafafa",
    }}
  >
    {children}
  </AbsoluteFill>
);

// === INDIVIDUAL VARIANTS ===

export const Glossy: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <GlossyButton color="#3b82f6" size="lg">
        Glossy Button
      </GlossyButton>
    </CenteredWrapper>
  ),
};

export const Glass: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ position: "relative" }}>
        {/* Background for glass effect */}
        <div
          style={{
            position: "absolute",
            inset: -100,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: "blur(40px)",
            opacity: 0.6,
          }}
        />
        <GlassButton size="lg" textColor="#fff">
          Glass Button
        </GlassButton>
      </div>
    </CenteredWrapper>
  ),
};

export const Neon: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <NeonButton color="#00ff88" size="lg">
        Neon Button
      </NeonButton>
    </CenteredWrapper>
  ),
};

export const Gradient: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <GradientButton color="#667eea" secondaryColor="#764ba2" size="lg">
        Gradient Button
      </GradientButton>
    </CenteredWrapper>
  ),
};

export const Soft: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper dark={false}>
      <SoftButton color="#3b82f6" size="lg">
        Soft Button
      </SoftButton>
    </CenteredWrapper>
  ),
};

export const Outline: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <OutlineButton color="#f472b6" size="lg">
        Outline Button
      </OutlineButton>
    </CenteredWrapper>
  ),
};

export const Pill: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <PillButton color="#10b981" size="lg">
        Pill Button
      </PillButton>
    </CenteredWrapper>
  ),
};

export const Sharp: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <Button variant="sharp" color="#f59e0b" size="lg">
        Sharp Button
      </Button>
    </CenteredWrapper>
  ),
};

// === STATES ===

export const PressedState: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 20 }}>
        <GlossyButton color="#3b82f6" size="lg">
          Normal
        </GlossyButton>
        <GlossyButton color="#3b82f6" size="lg" pressed>
          Pressed
        </GlossyButton>
      </div>
    </CenteredWrapper>
  ),
};

export const HoverState: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 20 }}>
        <NeonButton color="#00ff88" size="lg">
          Normal
        </NeonButton>
        <NeonButton color="#00ff88" size="lg" hover>
          Hover
        </NeonButton>
      </div>
    </CenteredWrapper>
  ),
};

export const DisabledState: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 20 }}>
        <GradientButton color="#667eea" secondaryColor="#764ba2" size="lg">
          Enabled
        </GradientButton>
        <GradientButton
          color="#667eea"
          secondaryColor="#764ba2"
          size="lg"
          disabled
        >
          Disabled
        </GradientButton>
      </div>
    </CenteredWrapper>
  ),
};

// === SIZES ===

export const AllSizes: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <GlossyButton color="#3b82f6" size="xs">
          XS
        </GlossyButton>
        <GlossyButton color="#3b82f6" size="sm">
          Small
        </GlossyButton>
        <GlossyButton color="#3b82f6" size="md">
          Medium
        </GlossyButton>
        <GlossyButton color="#3b82f6" size="lg">
          Large
        </GlossyButton>
        <GlossyButton color="#3b82f6" size="xl">
          Extra Large
        </GlossyButton>
      </div>
    </CenteredWrapper>
  ),
};

// === COLORS ===

export const ColorPalette: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          maxWidth: 500,
        }}
      >
        <GlossyButton color="#ef4444">Red</GlossyButton>
        <GlossyButton color="#f97316">Orange</GlossyButton>
        <GlossyButton color="#eab308">Yellow</GlossyButton>
        <GlossyButton color="#22c55e">Green</GlossyButton>
        <GlossyButton color="#14b8a6">Teal</GlossyButton>
        <GlossyButton color="#06b6d4">Cyan</GlossyButton>
        <GlossyButton color="#3b82f6">Blue</GlossyButton>
        <GlossyButton color="#8b5cf6">Purple</GlossyButton>
        <GlossyButton color="#ec4899">Pink</GlossyButton>
      </div>
    </CenteredWrapper>
  ),
};

export const NeonColors: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 20 }}>
        <NeonButton color="#00ff88">Green</NeonButton>
        <NeonButton color="#00d4ff">Cyan</NeonButton>
        <NeonButton color="#ff00ff">Magenta</NeonButton>
        <NeonButton color="#ffff00">Yellow</NeonButton>
      </div>
    </CenteredWrapper>
  ),
};

// === GRADIENTS ===

export const GradientStyles: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <GradientButton color="#667eea" secondaryColor="#764ba2" size="lg">
          Purple Magic
        </GradientButton>
        <GradientButton color="#f093fb" secondaryColor="#f5576c" size="lg">
          Pink Sunset
        </GradientButton>
        <GradientButton color="#4facfe" secondaryColor="#00f2fe" size="lg">
          Ocean Blue
        </GradientButton>
        <GradientButton color="#43e97b" secondaryColor="#38f9d7" size="lg">
          Fresh Mint
        </GradientButton>
        <GradientButton color="#fa709a" secondaryColor="#fee140" size="lg">
          Warm Glow
        </GradientButton>
      </div>
    </CenteredWrapper>
  ),
};

// === WITH ICONS ===

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

export const WithIcons: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 16 }}>
        <GlossyButton color="#3b82f6" size="lg" icon={<PlayIcon />}>
          Play
        </GlossyButton>
        <GradientButton
          color="#667eea"
          secondaryColor="#764ba2"
          size="lg"
          iconRight={<ArrowIcon />}
        >
          Get Started
        </GradientButton>
        <OutlineButton color="#10b981" size="lg" icon={<DownloadIcon />}>
          Download
        </OutlineButton>
      </div>
    </CenteredWrapper>
  ),
};

// === ANIMATIONS ===

export const AnimatedButtons: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", gap: 20 }}>
        <GlossyButton
          color="#ef4444"
          size="lg"
          animate
          animationType="fadeIn"
          delay={0}
        >
          Fade In
        </GlossyButton>
        <GlossyButton
          color="#f97316"
          size="lg"
          animate
          animationType="scaleIn"
          delay={0.2}
        >
          Scale In
        </GlossyButton>
        <GlossyButton
          color="#22c55e"
          size="lg"
          animate
          animationType="slideUp"
          delay={0.4}
        >
          Slide Up
        </GlossyButton>
        <GlossyButton
          color="#3b82f6"
          size="lg"
          animate
          animationType="bounce"
          delay={0.6}
        >
          Bounce
        </GlossyButton>
      </div>
    </CenteredWrapper>
  ),
};

// === ALL VARIANTS GALLERY ===

export const VariantGallery: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={90}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => {
    const variants = [
      { variant: "glossy" as const, color: "#3b82f6", label: "Glossy" },
      { variant: "glass" as const, color: "#fff", label: "Glass" },
      { variant: "neon" as const, color: "#00ff88", label: "Neon" },
      {
        variant: "gradient" as const,
        color: "#667eea",
        secondaryColor: "#764ba2",
        label: "Gradient",
      },
      { variant: "soft" as const, color: "#8b5cf6", label: "Soft" },
      { variant: "outline" as const, color: "#f472b6", label: "Outline" },
      { variant: "solid" as const, color: "#14b8a6", label: "Solid" },
      { variant: "pill" as const, color: "#f59e0b", label: "Pill" },
      { variant: "rounded" as const, color: "#06b6d4", label: "Rounded" },
      { variant: "sharp" as const, color: "#ef4444", label: "Sharp" },
    ];

    return (
      <CenteredWrapper>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
            padding: 40,
          }}
        >
          {variants.map((v) => (
            <Button
              key={v.variant}
              variant={v.variant}
              color={v.color}
              secondaryColor={v.secondaryColor}
              textColor={
                v.variant === "soft" ||
                v.variant === "outline" ||
                v.variant === "neon"
                  ? v.color
                  : "#fff"
              }
            >
              {v.label}
            </Button>
          ))}
        </div>
      </CenteredWrapper>
    );
  },
};

// === BUTTON GROUP ===

export const ButtonGroup: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120}>
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <CenteredWrapper>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Primary CTA group */}
        <div style={{ display: "flex", gap: 12 }}>
          <GradientButton color="#667eea" secondaryColor="#764ba2" size="lg">
            Get Started
          </GradientButton>
          <OutlineButton color="#667eea" size="lg">
            Learn More
          </OutlineButton>
        </div>

        {/* Social buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <GlossyButton color="#1DA1F2" size="md">
            Twitter
          </GlossyButton>
          <GlossyButton color="#4267B2" size="md">
            Facebook
          </GlossyButton>
          <GlossyButton color="#333333" size="md">
            GitHub
          </GlossyButton>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <SoftButton color="#22c55e" size="md">
            Approve
          </SoftButton>
          <SoftButton color="#ef4444" size="md">
            Reject
          </SoftButton>
          <SoftButton color="#6b7280" size="md">
            Skip
          </SoftButton>
        </div>
      </div>
    </CenteredWrapper>
  ),
};
