import type { Meta, StoryObj } from "@storybook/react";
import {
  BubbleMessage,
  ChatConversation,
} from "../../remotion/base/components/text";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof BubbleMessage> = {
  title: "Text/BubbleMessage",
  component: BubbleMessage,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#f5f5f5">
        <div style={{ width: "100%", height: "100%", padding: 20 }}>
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    align: { control: "select", options: ["left", "right"] },
    bubbleStyle: {
      control: "select",
      options: ["ios", "android", "minimal", "rounded", "glossy"],
    },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
    showTyping: { control: "boolean" },
    typingDuration: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    delay: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    showTail: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleMessage>;

export const SentMessage: Story = {
  args: {
    align: "right",
    bubbleStyle: "ios",
    delay: 0,
  },
  render: (args) => (
    <BubbleMessage {...args}>Hey! How are you doing?</BubbleMessage>
  ),
};

export const ReceivedMessage: Story = {
  args: {
    align: "left",
    bubbleStyle: "ios",
    delay: 0,
  },
  render: (args) => (
    <BubbleMessage {...args}>I'm doing great, thanks for asking!</BubbleMessage>
  ),
};

export const WithTypingIndicator: Story = {
  args: {
    align: "left",
    showTyping: true,
    typingDuration: 1.5,
    delay: 0,
  },
  render: (args) => (
    <BubbleMessage {...args}>Let me think about that...</BubbleMessage>
  ),
};

export const AndroidStyle: Story = {
  args: {
    align: "left",
    bubbleStyle: "android",
    backgroundColor: "#DCF8C6",
    textColor: "#000000",
  },
  render: (args) => (
    <BubbleMessage {...args}>This is Android style!</BubbleMessage>
  ),
};

export const WithSenderAndTimestamp: Story = {
  args: {
    align: "left",
    senderName: "John",
    timestamp: "12:34 PM",
    delay: 0,
  },
  render: (args) => (
    <BubbleMessage {...args}>Message with metadata</BubbleMessage>
  ),
};

export const Conversation: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#f5f5f5">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 350 }}>
            <Story />
          </div>
        </div>
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <ChatConversation>
      <BubbleMessage align="right" delay={0}>
        Hey! Are you free tonight?
      </BubbleMessage>
      <BubbleMessage align="left" delay={0.8} showTyping typingDuration={0.8}>
        Let me check my calendar...
      </BubbleMessage>
      <BubbleMessage align="left" delay={2.5}>
        Yes! What do you have in mind?
      </BubbleMessage>
      <BubbleMessage align="right" delay={3.5}>
        Dinner at 7?
      </BubbleMessage>
      <BubbleMessage align="left" delay={4.5}>
        Perfect! See you then 🎉
      </BubbleMessage>
    </ChatConversation>
  ),
};

export const CustomColors: Story = {
  args: {
    align: "right",
    backgroundColor: "#8B5CF6",
    textColor: "#ffffff",
  },
  render: (args) => (
    <BubbleMessage {...args}>Custom purple bubble!</BubbleMessage>
  ),
};

export const MinimalStyle: Story = {
  args: {
    align: "left",
    bubbleStyle: "minimal",
    backgroundColor: "#E5E7EB",
  },
  render: (args) => <BubbleMessage {...args}>Minimal and clean</BubbleMessage>,
};

export const GlossyStyle: Story = {
  args: {
    align: "right",
    bubbleStyle: "glossy",
    delay: 0,
  },
  render: (args) => (
    <BubbleMessage {...args}>This is a glossy bubble! ✨</BubbleMessage>
  ),
};

export const GlossyConversation: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#f5f5f5">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 350 }}>
            <Story />
          </div>
        </div>
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <ChatConversation>
      <BubbleMessage align="right" bubbleStyle="glossy" delay={0}>
        Hey! Check out this glossy effect
      </BubbleMessage>
      <BubbleMessage
        align="left"
        bubbleStyle="glossy"
        delay={0.8}
        showTyping
        typingDuration={0.6}
      >
        Wow, that looks shiny!
      </BubbleMessage>
      <BubbleMessage align="right" bubbleStyle="glossy" delay={2}>
        Right? Love the highlight
      </BubbleMessage>
      <BubbleMessage align="left" bubbleStyle="glossy" delay={3}>
        Very polished look 🔥
      </BubbleMessage>
    </ChatConversation>
  ),
};
