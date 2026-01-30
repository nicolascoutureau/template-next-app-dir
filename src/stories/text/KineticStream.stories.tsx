import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  FlipTextStream, 
  ZoomTextStream, 
  BlurTextStream, 
  ElasticStream, 
  BlockStream, 
  ChromaticStream,
  DynamicSizeStream,
  StompStream,
  SlotMachineStream,
  OutlineStream,
  SlicedStream,
  TurbulenceStream,
  NeonStream,
  SlideStream,
  SwipeStream
} from '../../remotion/library/components/text/KineticStream';
import { RemotionWrapper } from '../helpers/RemotionWrapper';

const meta: Meta = {
  title: 'Text/KineticStream',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <RemotionWrapper 
        durationInFrames={180} 
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

type Story = StoryObj<typeof FlipTextStream>;

const text = "Kinetic typography brings words to life through motion and timing";

export const Flip: Story = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text,
    wordsPerGroup: 1,
    fontSize: 80,
  },
};

export const FlipGrouped: Story = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text: "Reading in chunks is often faster and easier to comprehend",
    wordsPerGroup: 2,
    fontSize: 60,
  },
};

export const Zoom: Story = {
  render: (args) => <ZoomTextStream {...args} />,
  args: {
    text: "Experience the impact of flying through words",
    wordsPerGroup: 1,
    fontSize: 90,
  },
};

export const Blur: Story = {
  render: (args) => <BlurTextStream {...args} />,
  args: {
    text: "Motion blur creates a sense of extreme speed",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 5,
  },
};

export const Elastic: Story = {
  render: (args) => <ElasticStream {...args} />,
  args: {
    text: "Bouncing words feel alive and energetic like rubber",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 15,
  },
};

export const Block: Story = {
  render: (args) => <BlockStream {...args} />,
  args: {
    text: "Solid block reveal creates a modern professional look",
    wordsPerGroup: 1,
    fontSize: 70,
    blockColor: "#ff0055",
    transitionDuration: 15,
  },
};

export const Chromatic: Story = {
  render: (args) => <ChromaticStream {...args} />,
  args: {
    text: "Glitchy chromatic aberration for cyber punk vibes",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 8,
  },
};

export const DynamicSize: Story = {
  render: (args) => <DynamicSizeStream {...args} />,
  args: {
    text: "Pulsing sizes create a rhythmic and organic visual flow",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 10,
  },
};

export const Stomp: Story = {
  render: (args) => <StompStream {...args} />,
  args: {
    text: "STOMP STOMP IMPACT HEAVY LOUD",
    wordsPerGroup: 1,
    fontSize: 100,
    fontWeight: "900",
    transitionDuration: 12,
  },
};

export const SlotMachine: Story = {
  render: (args) => <SlotMachineStream {...args} />,
  args: {
    text: "Rolling reeling spinning winning jackpot",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 15,
  },
};

export const Outline: Story = {
  render: (args) => <OutlineStream {...args} />,
  args: {
    text: "Hollow fills solid empty becomes full",
    wordsPerGroup: 1,
    fontSize: 90,
    fontWeight: "900",
    transitionDuration: 20,
  },
};

export const Sliced: Story = {
  render: (args) => <SlicedStream {...args} />,
  args: {
    text: "SLICED CUT SEPARATED SPLIT DIVIDED",
    wordsPerGroup: 1,
    fontSize: 100,
    fontWeight: "900",
    transitionDuration: 15,
  },
};

export const Turbulence: Story = {
  render: (args) => <TurbulenceStream {...args} />,
  args: {
    text: "Wavy liquid distorted turbulence water",
    wordsPerGroup: 1,
    fontSize: 80,
    fontWeight: "bold",
    transitionDuration: 20,
  },
};

export const Neon: Story = {
  render: (args) => <NeonStream {...args} />,
  args: {
    text: "NEON GLOW FLICKER LIGHT BRIGHT",
    wordsPerGroup: 1,
    fontSize: 90,
    fontWeight: "900",
    color: "#ffffff",
    neonColor: "#00ffcc",
    transitionDuration: 5,
  },
};

export const SlideAlternate: Story = {
  render: (args) => <SlideStream {...args} />,
  args: {
    text: "Left Right Left Right Keep Moving",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 12,
    direction: 'alternate',
  },
};

export const SlideLeft: Story = {
  render: (args) => <SlideStream {...args} />,
  args: {
    text: "Always entering from the left side",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: 'left',
  },
};

export const Swipe: Story = {
  render: (args) => <SwipeStream {...args} />,
  args: {
    text: "Fast aggressive swipe transition",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 8,
  },
};

export const CustomDuration: Story = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text: "This animation finishes in 100 frames regardless of total video length",
    wordsPerGroup: 2,
    fontSize: 60,
    totalDuration: 100, // Finish early
  },
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={200} backgroundColor="#111111">
         <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <Story />
        </div>
      </RemotionWrapper>
    )
  ]
};
