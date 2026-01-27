import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { TextAnimation } from "../index";
import type { TextAnimationProps } from "../index";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

const meta: Meta<TextAnimationProps> = {
  title: "Motion Library/Text/TextAnimation",
  component: TextAnimation,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<TextAnimationProps>;

export const CharacterBounce: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Hello World"
        className="text-white"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            y: 50,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const FadeInWords: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Build amazing videos with code"
        className="text-white"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "words" });
          return tl.from(split.words, {
            opacity: 0,
            y: 30,
            rotationX: -90,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const Typewriter: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120}>
      <TextAnimation
        text="Typewriter effect"
        className="text-emerald-400 font-mono"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            stagger: 0.08,
            duration: 0.01,
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const ScaleUp: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="SCALE"
        className="text-violet-400"
        style={{ fontSize: "6rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: "back.out(2)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const SlideFromLeft: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Slide Animation"
        className="text-cyan-400"
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            x: -100,
            stagger: 0.03,
            duration: 0.4,
            ease: "power2.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const BlurIn: Story = {
  render: () => (
    <RemotionPreview durationInFrames={90}>
      <TextAnimation
        text="Blur Effect"
        className="text-rose-400"
        style={{ fontSize: "4rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            filter: "blur(20px)",
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const RotateIn: Story = {
  render: () => (
    <RemotionPreview durationInFrames={120}>
      <TextAnimation
        text="ROTATE"
        className="text-amber-400"
        style={{ fontSize: "5rem" }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl.from(split.chars, {
            opacity: 0,
            rotation: 180,
            y: 50,
            stagger: 0.08,
            duration: 0.6,
            ease: "back.out(1.4)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

// ============ PROFESSIONAL MOTION DESIGN ============

export const CinematicReveal: Story = {
  name: "Pro - Cinematic Reveal",
  render: () => (
    <RemotionPreview durationInFrames={150} width={1000} height={400}>
      <div className="flex flex-col items-center gap-4">
        <TextAnimation
          text="CINEMATIC"
          className="text-white tracking-[0.5em] font-light"
          style={{ fontSize: "5rem" }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              .set(split.chars, { opacity: 0, y: 100, rotationX: -90 })
              .to(split.chars, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                stagger: { each: 0.06, from: "center" },
                duration: 0.8,
                ease: "power4.out",
              })
              .to(
                split.chars,
                {
                  letterSpacing: "0.8em",
                  duration: 1.2,
                  ease: "power2.inOut",
                },
                "-=0.3"
              );
          }}
        />
        <TextAnimation
          text="EXPERIENCE"
          className="text-white/60 tracking-[0.3em] font-extralight"
          style={{ fontSize: "1.5rem" }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              .set(split.chars, { opacity: 0 })
              .to(
                split.chars,
                {
                  opacity: 1,
                  stagger: 0.03,
                  duration: 0.01,
                },
                0.8
              );
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const ElasticWave: Story = {
  name: "Pro - Elastic Wave",
  render: () => (
    <RemotionPreview durationInFrames={120} width={900} height={300}>
      <TextAnimation
        text="ELASTIC MOTION"
        className="text-fuchsia-400"
        style={{ fontSize: "4.5rem", fontWeight: 900 }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          // Set alternating start positions
          split.chars.forEach((char, i) => {
            gsap.set(char, {
              y: i % 2 === 0 ? -150 : 150,
              rotation: i % 2 === 0 ? -45 : 45,
              opacity: 0,
              scale: 0,
            });
          });
          return tl.to(split.chars, {
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            stagger: {
              each: 0.04,
              from: "edges",
            },
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });
        }}
      />
    </RemotionPreview>
  ),
};

export const GlitchEffect: Story = {
  name: "Pro - Glitch Effect",
  render: () => (
    <RemotionPreview durationInFrames={90} width={800} height={300}>
      <div className="relative">
        <TextAnimation
          text="GLITCH"
          className="text-white"
          style={{ fontSize: "6rem", fontWeight: 900 }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              .set(split.chars, { opacity: 0 })
              .to(split.chars, {
                opacity: 1,
                duration: 0.05,
                stagger: {
                  each: 0.02,
                  repeat: 3,
                  yoyo: true,
                },
              })
              .to(
                split.chars,
                {
                  x: "random(-10, 10)",
                  y: "random(-5, 5)",
                  skewX: "random(-20, 20)",
                  duration: 0.1,
                  stagger: {
                    each: 0.02,
                    repeat: 5,
                    yoyo: true,
                  },
                },
                0.2
              )
              .to(split.chars, {
                x: 0,
                y: 0,
                skewX: 0,
                duration: 0.3,
                ease: "power2.out",
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const MaskReveal: Story = {
  name: "Pro - Mask Reveal",
  render: () => (
    <RemotionPreview durationInFrames={90} width={900} height={300}>
      <div className="overflow-hidden">
        <TextAnimation
          text="REVEAL"
          className="text-white"
          style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1 }}
          createTimeline={({ textRef, tl }) => {
            return tl
              .set(textRef.current, {
                clipPath: "inset(0 100% 0 0)",
              })
              .to(textRef.current, {
                clipPath: "inset(0 0% 0 0)",
                duration: 0.8,
                ease: "power4.inOut",
              })
              .from(
                textRef.current,
                {
                  x: -100,
                  duration: 0.8,
                  ease: "power4.out",
                },
                0
              );
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const KineticTypography: Story = {
  name: "Pro - Kinetic Typography",
  render: () => (
    <RemotionPreview durationInFrames={180} width={1000} height={400}>
      <div className="flex flex-col items-center justify-center gap-2">
        <TextAnimation
          text="THINK"
          className="text-slate-400 font-light"
          style={{ fontSize: "2rem", letterSpacing: "0.5em" }}
          createTimeline={({ textRef, tl }) => {
            return tl.from(textRef.current, {
              opacity: 0,
              scale: 0.8,
              duration: 0.4,
              ease: "power2.out",
            });
          }}
        />
        <TextAnimation
          text="DIFFERENT"
          className="text-white"
          style={{ fontSize: "7rem", fontWeight: 900, lineHeight: 1 }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              .set(split.chars, {
                opacity: 0,
                scale: 3,
                y: 100,
              })
              .to(
                split.chars,
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  stagger: 0.05,
                  duration: 0.6,
                  ease: "back.out(1.2)",
                },
                0.3
              )
              .to(
                split.chars,
                {
                  color: (i) =>
                    ["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6", "#f97316"][
                      i % 9
                    ],
                  stagger: 0.03,
                  duration: 0.3,
                },
                "-=0.2"
              );
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const SplitScreenReveal: Story = {
  name: "Pro - Split Screen",
  render: () => (
    <RemotionPreview durationInFrames={120} width={1000} height={350}>
      <div className="relative flex items-center justify-center">
        <TextAnimation
          text="SPLIT"
          className="text-white"
          style={{ fontSize: "10rem", fontWeight: 900, lineHeight: 1 }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            const midpoint = Math.floor(split.chars.length / 2);
            const leftChars = split.chars.slice(0, midpoint);
            const rightChars = split.chars.slice(midpoint);

            return tl
              .set(split.chars, { opacity: 0 })
              .from(leftChars, {
                x: -200,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power4.out",
              })
              .from(
                rightChars,
                {
                  x: 200,
                  opacity: 0,
                  duration: 0.7,
                  stagger: -0.08,
                  ease: "power4.out",
                },
                0
              )
              .to(split.chars, {
                opacity: 1,
                duration: 0.01,
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const Perspective3D: Story = {
  name: "Pro - 3D Perspective",
  render: () => (
    <RemotionPreview durationInFrames={120} width={900} height={400}>
      <div style={{ perspective: "1000px" }}>
        <TextAnimation
          text="DIMENSION"
          className="text-white"
          style={{
            fontSize: "5rem",
            fontWeight: 800,
            transformStyle: "preserve-3d",
          }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              .set(split.chars, {
                transformPerspective: 1000,
                transformOrigin: "50% 50% -100px",
              })
              .from(split.chars, {
                rotationY: -180,
                rotationX: 45,
                opacity: 0,
                scale: 0.5,
                z: -500,
                stagger: {
                  each: 0.06,
                  from: "start",
                },
                duration: 1,
                ease: "power3.out",
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const LiquidMorph: Story = {
  name: "Pro - Liquid Morph",
  render: () => (
    <RemotionPreview durationInFrames={120} width={800} height={300}>
      <TextAnimation
        text="LIQUID"
        className="text-cyan-400"
        style={{ fontSize: "6rem", fontWeight: 900 }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl
            .set(split.chars, {
              opacity: 0,
              scaleY: 3,
              scaleX: 0.3,
              filter: "blur(10px)",
            })
            .to(split.chars, {
              opacity: 1,
              scaleY: 1,
              scaleX: 1,
              filter: "blur(0px)",
              stagger: {
                each: 0.08,
                from: "random",
              },
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
            });
        }}
      />
    </RemotionPreview>
  ),
};

// ============ IN & OUT ANIMATIONS ============

export const InOutBasic: Story = {
  name: "In/Out - Basic",
  render: () => (
    <RemotionPreview durationInFrames={150} width={800} height={300}>
      <TextAnimation
        text="HELLO WORLD"
        className="text-white"
        style={{ fontSize: "5rem", fontWeight: 700 }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl
            // IN: fade up
            .from(split.chars, {
              opacity: 0,
              y: 50,
              stagger: 0.04,
              duration: 0.5,
              ease: "back.out(1.7)",
            })
            // HOLD
            .to({}, { duration: 1 })
            // OUT: fade down
            .to(split.chars, {
              opacity: 0,
              y: -50,
              stagger: 0.03,
              duration: 0.4,
              ease: "power2.in",
            });
        }}
      />
    </RemotionPreview>
  ),
};

export const InOutScale: Story = {
  name: "In/Out - Scale Burst",
  render: () => (
    <RemotionPreview durationInFrames={150} width={900} height={300}>
      <TextAnimation
        text="IMPACT"
        className="text-amber-400"
        style={{ fontSize: "7rem", fontWeight: 900 }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl
            // IN: scale from center
            .from(split.chars, {
              opacity: 0,
              scale: 0,
              stagger: {
                each: 0.05,
                from: "center",
              },
              duration: 0.6,
              ease: "back.out(2)",
            })
            // HOLD
            .to({}, { duration: 0.8 })
            // OUT: explode outward
            .to(split.chars, {
              opacity: 0,
              scale: 2,
              stagger: {
                each: 0.03,
                from: "center",
              },
              duration: 0.4,
              ease: "power2.in",
            });
        }}
      />
    </RemotionPreview>
  ),
};

export const InOutSlide: Story = {
  name: "In/Out - Slide Through",
  render: () => (
    <RemotionPreview durationInFrames={150} width={900} height={300}>
      <div className="overflow-hidden">
        <TextAnimation
          text="SLIDING TEXT"
          className="text-sky-400"
          style={{ fontSize: "5rem", fontWeight: 800 }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            return tl
              // IN: slide from left
              .from(split.chars, {
                opacity: 0,
                x: -100,
                stagger: 0.03,
                duration: 0.5,
                ease: "power3.out",
              })
              // HOLD
              .to({}, { duration: 0.8 })
              // OUT: slide to right
              .to(split.chars, {
                opacity: 0,
                x: 100,
                stagger: 0.03,
                duration: 0.5,
                ease: "power3.in",
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const InOutRotate: Story = {
  name: "In/Out - Flip",
  render: () => (
    <RemotionPreview durationInFrames={180} width={900} height={350}>
      <div style={{ perspective: "1000px" }}>
        <TextAnimation
          text="FLIP ME"
          className="text-rose-400"
          style={{ fontSize: "6rem", fontWeight: 900 }}
          createTimeline={({ textRef, tl }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            gsap.set(split.chars, { transformPerspective: 1000 });
            return tl
              // IN: flip from top
              .from(split.chars, {
                opacity: 0,
                rotationX: -90,
                y: -50,
                stagger: 0.06,
                duration: 0.7,
                ease: "power3.out",
              })
              // HOLD
              .to({}, { duration: 0.8 })
              // OUT: flip to bottom
              .to(split.chars, {
                opacity: 0,
                rotationX: 90,
                y: 50,
                stagger: 0.04,
                duration: 0.5,
                ease: "power3.in",
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const InOutBlur: Story = {
  name: "In/Out - Focus",
  render: () => (
    <RemotionPreview durationInFrames={150} width={800} height={300}>
      <TextAnimation
        text="FOCUS"
        className="text-violet-400"
        style={{ fontSize: "7rem", fontWeight: 900 }}
        createTimeline={({ textRef, tl }) => {
          const split = new SplitText(textRef.current, { type: "chars" });
          return tl
            // IN: blur in with scale
            .from(split.chars, {
              opacity: 0,
              filter: "blur(20px)",
              scale: 1.5,
              stagger: 0.05,
              duration: 0.6,
              ease: "power2.out",
            })
            // HOLD
            .to({}, { duration: 0.8 })
            // OUT: blur out with scale
            .to(split.chars, {
              opacity: 0,
              filter: "blur(20px)",
              scale: 0.5,
              stagger: {
                each: 0.04,
                from: "end",
              },
              duration: 0.5,
              ease: "power2.in",
            });
        }}
      />
    </RemotionPreview>
  ),
};

export const InOutSequence: Story = {
  name: "In/Out - Word Sequence",
  render: () => (
    <RemotionPreview durationInFrames={210} width={900} height={350}>
      <div className="relative flex items-center justify-center h-full w-full">
        <TextAnimation
          text="CREATE"
          className="text-emerald-400 absolute"
          style={{ fontSize: "5rem", fontWeight: 800 }}
          createTimeline={({ textRef, tl }) => {
            return tl
              .from(textRef.current, {
                opacity: 0,
                y: 40,
                duration: 0.4,
                ease: "power3.out",
              })
              .to({}, { duration: 0.6 })
              .to(textRef.current, {
                opacity: 0,
                y: -40,
                duration: 0.3,
                ease: "power2.in",
              });
          }}
        />
        <TextAnimation
          text="INSPIRE"
          className="text-blue-400 absolute"
          style={{ fontSize: "5rem", fontWeight: 800 }}
          createTimeline={({ textRef, tl }) => {
            return tl
              .set(textRef.current, { opacity: 0 })
              .to({}, { duration: 1.2 })
              .to(textRef.current, {
                opacity: 1,
                duration: 0.01,
              })
              .from(textRef.current, {
                y: 40,
                duration: 0.4,
                ease: "power3.out",
              })
              .to({}, { duration: 0.6 })
              .to(textRef.current, {
                opacity: 0,
                y: -40,
                duration: 0.3,
                ease: "power2.in",
              });
          }}
        />
        <TextAnimation
          text="ACHIEVE"
          className="text-purple-400 absolute"
          style={{ fontSize: "5rem", fontWeight: 800 }}
          createTimeline={({ textRef, tl }) => {
            return tl
              .set(textRef.current, { opacity: 0 })
              .to({}, { duration: 2.4 })
              .to(textRef.current, {
                opacity: 1,
                duration: 0.01,
              })
              .from(textRef.current, {
                y: 40,
                scale: 0.9,
                duration: 0.5,
                ease: "back.out(1.5)",
              });
          }}
        />
      </div>
    </RemotionPreview>
  ),
};

export const InOutMask: Story = {
  name: "In/Out - Wipe",
  render: () => (
    <RemotionPreview durationInFrames={150} width={900} height={300}>
      <TextAnimation
        text="REVEAL"
        className="text-white"
        style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1 }}
        createTimeline={({ textRef, tl }) => {
          return tl
            // IN: wipe from left
            .set(textRef.current, { clipPath: "inset(0 100% 0 0)" })
            .to(textRef.current, {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.6,
              ease: "power3.inOut",
            })
            // HOLD
            .to({}, { duration: 1 })
            // OUT: wipe to right
            .to(textRef.current, {
              clipPath: "inset(0 0 0 100%)",
              duration: 0.5,
              ease: "power3.inOut",
            });
        }}
      />
    </RemotionPreview>
  ),
};
