import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "../../remotion/base/components/mockups";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof SearchBar> = {
  title: "Mockups/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#f8fafc">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    variant: { control: "select", options: ["default", "pill", "minimal", "glass"] },
    width: { control: { type: "range", min: 200, max: 500, step: 20 } },
    height: { control: { type: "range", min: 36, max: 56, step: 4 } },
    showIcon: { control: "boolean" },
    focused: { control: "boolean" },
    animate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    width: 320,
    animate: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "React tutorials",
    variant: "default",
    width: 320,
  },
};

export const Focused: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    width: 320,
    focused: true,
    focusColor: "#3b82f6",
  },
};

export const PillShape: Story = {
  args: {
    placeholder: "Search anything...",
    variant: "pill",
    width: 360,
    height: 48,
  },
};

export const Minimal: Story = {
  args: {
    placeholder: "Type to search",
    variant: "minimal",
    width: 280,
  },
};

export const GlassStyle: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#000">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  args: {
    placeholder: "Search...",
    variant: "glass",
    width: 400,
    height: 50,
  },
};

export const CustomColors: Story = {
  args: {
    placeholder: "Search products...",
    variant: "default",
    width: 350,
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    focusColor: "#f59e0b",
    focused: true,
  },
};

export const NoIcon: Story = {
  args: {
    placeholder: "Enter your query",
    variant: "default",
    width: 300,
    showIcon: false,
  },
};

export const CustomIcon: Story = {
  args: {
    placeholder: "Search files...",
    variant: "pill",
    width: 320,
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
};

export const CommandPalette: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1e293b">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  args: {
    placeholder: "Type a command or search...",
    variant: "default",
    width: 500,
    height: 52,
    backgroundColor: "#0f172a",
    textColor: "#f1f5f9",
    placeholderColor: "#64748b",
    borderColor: "#334155",
    focusColor: "#8b5cf6",
    focused: true,
  },
};

export const MultipleSearchBars: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <>
      <SearchBar placeholder="Default style" variant="default" width={320} delay={0} />
      <SearchBar placeholder="Pill style" variant="pill" width={320} delay={0.15} />
      <SearchBar placeholder="Minimal style" variant="minimal" width={320} delay={0.3} />
    </>
  ),
};
