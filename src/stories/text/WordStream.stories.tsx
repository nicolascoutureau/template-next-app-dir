import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { WordStream } from '../../remotion/library/components/text/WordStream';
import { RemotionWrapper } from '../helpers/RemotionWrapper';

const meta: Meta<typeof WordStream> = {
  title: 'Text/WordStream',
  component: WordStream,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <RemotionWrapper 
        durationInFrames={150} 
        fps={30} 
        width={800} 
        height={450}
        backgroundColor="#111111"
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WordStream>;

const text = "This is a word stream animation pushing text one by one";

export const DefaultUp: Story = {
  args: {
    text: text,
    direction: "up",
    fontSize: 80,
    totalDuration: 3
  },
};

export const Down: Story = {
  args: {
    text: text,
    direction: "down",
    fontSize: 80,
  },
};

export const Left: Story = {
  args: {
    text: text,
    direction: "left",
    fontSize: 80,
  },
};

export const Right: Story = {
  args: {
    text: text,
    direction: "right",
    fontSize: 80,
  },
};

export const Fast: Story = {
  args: {
    text: "Speed reading is amazing for quick consumption of information",
    direction: "up",
    fontSize: 60,
    transitionDuration: 5,
  },
  decorators: [
      (Story) => (
          <RemotionWrapper durationInFrames={90} backgroundColor="#111111">
               <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                <Story />
               </div>
          </RemotionWrapper>
      )
  ]
};

export const NoSkew: Story = {
    args: {
        text: "Clean push without skew effect",
        withSkew: false,
        direction: "up",
        fontSize: 70
    }
}
