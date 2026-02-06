import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { CodeBlock } from "../../remotion/library/components/ui/CodeBlock";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof CodeBlock> = {
  title: "UI/CodeBlock",
  component: CodeBlock,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0f0f23">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    theme: { control: { type: "radio" }, options: ["dark", "light"] },
    lineNumbers: { control: "boolean" },
    fontSize: { control: { type: "range", min: 10, max: 20, step: 1 } },
    typingSpeed: { control: { type: "range", min: 0, max: 5, step: 0.5 } },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sampleCode = `import { useCurrentFrame } from "remotion";

export const MyComponent = () => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, frame / 30);

  return (
    <div style={{ opacity }}>
      Hello World
    </div>
  );
};`;

export const Default: Story = {
  args: {
    code: sampleCode,
    fileName: "MyComponent.tsx",
    theme: "dark",
    lineNumbers: true,
    fontSize: 14,
  },
  render: (args) => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 600, height: 340 }}>
        <CodeBlock {...args} />
      </div>
    </AbsoluteFill>
  ),
};

export const TypingEffect: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 600, height: 340 }}>
        <CodeBlock
          code={sampleCode}
          fileName="typing.tsx"
          typingSpeed={2}
          theme="dark"
        />
      </div>
    </AbsoluteFill>
  ),
};

export const LightTheme: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 600, height: 340 }}>
        <CodeBlock
          code={sampleCode}
          fileName="component.tsx"
          theme="light"
        />
      </div>
    </AbsoluteFill>
  ),
};

export const HighlightedLines: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 600, height: 340 }}>
        <CodeBlock
          code={sampleCode}
          fileName="highlight.tsx"
          highlightLines={[4, 5]}
          theme="dark"
        />
      </div>
    </AbsoluteFill>
  ),
};

export const ShortSnippet: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 500, height: 180 }}>
        <CodeBlock
          code={`const greeting = "Hello, World!";\nconsole.log(greeting);`}
          fileName="hello.ts"
          theme="dark"
          fontSize={16}
        />
      </div>
    </AbsoluteFill>
  ),
};

export const FastTyping: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 550, height: 200 }}>
        <CodeBlock
          code={`async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}`}
          fileName="api.js"
          typingSpeed={4}
          theme="dark"
        />
      </div>
    </AbsoluteFill>
  ),
};
