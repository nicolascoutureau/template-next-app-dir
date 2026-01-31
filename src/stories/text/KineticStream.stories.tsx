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
  SwipeStream,
  PushStream
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

type FlipStory = StoryObj<typeof FlipTextStream>;
type ZoomStory = StoryObj<typeof ZoomTextStream>;
type BlurStory = StoryObj<typeof BlurTextStream>;
type ElasticStory = StoryObj<typeof ElasticStream>;
type BlockStory = StoryObj<typeof BlockStream>;
type ChromaticStory = StoryObj<typeof ChromaticStream>;
type DynamicSizeStory = StoryObj<typeof DynamicSizeStream>;
type StompStory = StoryObj<typeof StompStream>;
type SlotMachineStory = StoryObj<typeof SlotMachineStream>;
type OutlineStory = StoryObj<typeof OutlineStream>;
type SlicedStory = StoryObj<typeof SlicedStream>;
type TurbulenceStory = StoryObj<typeof TurbulenceStream>;
type NeonStory = StoryObj<typeof NeonStream>;
type SlideStory = StoryObj<typeof SlideStream>;
type SwipeStory = StoryObj<typeof SwipeStream>;
type PushStory = StoryObj<typeof PushStream>;

const text = "Kinetic typography brings words to life through motion and timing";

export const Flip: FlipStory = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text,
    wordsPerGroup: 1,
    fontSize: 80,
  },
};

export const FlipGrouped: FlipStory = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text: "Reading in chunks is often faster and easier to comprehend",
    wordsPerGroup: 2,
    fontSize: 60,
  },
};

export const Zoom: ZoomStory = {
  render: (args) => <ZoomTextStream {...args} />,
  args: {
    text: "Experience the impact of flying through words",
    wordsPerGroup: 1,
    fontSize: 90,
  },
};

export const Blur: BlurStory = {
  render: (args) => <BlurTextStream {...args} />,
  args: {
    text: "Motion blur creates a sense of extreme speed",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 5,
  },
};

export const Elastic: ElasticStory = {
  render: (args) => <ElasticStream {...args} />,
  args: {
    text: "Bouncing words feel alive and energetic like rubber",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 15,
  },
};

export const Block: BlockStory = {
  render: (args) => <BlockStream {...args} />,
  args: {
    text: "Solid block reveal creates a modern professional look",
    wordsPerGroup: 1,
    fontSize: 70,
    blockColor: "#ff0055",
    transitionDuration: 15,
  },
};

export const Chromatic: ChromaticStory = {
  render: (args) => <ChromaticStream {...args} />,
  args: {
    text: "Glitchy chromatic aberration for cyber punk vibes",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 8,
  },
};

export const DynamicSize: DynamicSizeStory = {
  render: (args) => <DynamicSizeStream {...args} />,
  args: {
    text: "Pulsing sizes create a rhythmic and organic visual flow",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 10,
  },
};

export const Stomp: StompStory = {
  render: (args) => <StompStream {...args} />,
  args: {
    text: "STOMP STOMP IMPACT HEAVY LOUD",
    wordsPerGroup: 1,
    fontSize: 100,
    fontWeight: "900",
    transitionDuration: 12,
  },
};

export const SlotMachine: SlotMachineStory = {
  render: (args) => <SlotMachineStream {...args} />,
  args: {
    text: "Rolling reeling spinning winning jackpot",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 15,
  },
};

export const Outline: OutlineStory = {
  render: (args) => <OutlineStream {...args} />,
  args: {
    text: "Hollow fills solid empty becomes full",
    wordsPerGroup: 1,
    fontSize: 90,
    fontWeight: "900",
    transitionDuration: 20,
  },
};

export const Sliced: SlicedStory = {
  render: (args) => <SlicedStream {...args} />,
  args: {
    text: "SLICED CUT SEPARATED SPLIT DIVIDED",
    wordsPerGroup: 1,
    fontSize: 100,
    fontWeight: "900",
    transitionDuration: 15,
  },
};

export const Turbulence: TurbulenceStory = {
  render: (args) => <TurbulenceStream {...args} />,
  args: {
    text: "Wavy liquid distorted turbulence water",
    wordsPerGroup: 1,
    fontSize: 80,
    fontWeight: "bold",
    transitionDuration: 20,
  },
};

export const Neon: NeonStory = {
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

export const SlideAlternate: SlideStory = {
  render: (args) => <SlideStream {...args} />,
  args: {
    text: "Left Right Left Right Keep Moving",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 12,
    direction: 'alternate',
  },
};

export const SlideLeft: SlideStory = {
  render: (args) => <SlideStream {...args} />,
  args: {
    text: "Always entering from the left side",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: 'left',
  },
};

export const Swipe: SwipeStory = {
  render: (args) => <SwipeStream {...args} />,
  args: {
    text: "Fast aggressive swipe transition",
    wordsPerGroup: 1,
    fontSize: 80,
    transitionDuration: 8,
  },
};

export const CustomDuration: FlipStory = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text: "This animation finishes in 100 frames regardless of total video length",
    wordsPerGroup: 2,
    fontSize: 60,
    duration: 100, // Finish early
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

export const WithEndDelay: FlipStory = {
  render: (args) => <FlipTextStream {...args} />,
  args: {
    text: "This last word stays visible for a moment",
    wordsPerGroup: 1,
    fontSize: 70,
    delayAfterLastWord: 45, // 1.5 seconds at 30fps
  },
};

export const ZoomWithEndDelay: ZoomStory = {
  render: (args) => <ZoomTextStream {...args} />,
  args: {
    text: "Smooth ending with delay",
    wordsPerGroup: 1,
    fontSize: 90,
    delayAfterLastWord: 60, // 2 seconds at 30fps
  },
};

export const PushUp: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Words push upward creating momentum",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: "up",
  },
};

export const PushDown: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Words falling down like rain",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: "down",
  },
};

export const PushLeft: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Reading flow pushing left naturally",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: "left",
  },
};

export const PushRight: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Reverse flow pushing right across",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: "right",
  },
};

export const PushNoSkew: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Clean movement without motion blur skew",
    wordsPerGroup: 1,
    fontSize: 80,
    direction: "up",
    withSkew: false,
  },
};

export const PushGrouped: PushStory = {
  render: (args) => <PushStream {...args} />,
  args: {
    text: "Two words at a time push through",
    wordsPerGroup: 2,
    fontSize: 70,
    direction: "up",
  },
};
