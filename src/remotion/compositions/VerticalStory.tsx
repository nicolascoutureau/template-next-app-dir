import { AbsoluteFill } from "remotion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextAnimation } from "../base/components/TextAnimation";
import { loadFont } from "@remotion/google-fonts/Inter";

export const VerticalStory: React.FC = () => {
  const { fontFamily } = loadFont();

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-b from-purple-500 to-pink-500">
      <div className="text-center space-y-8">
        <TextAnimation
          text={
            <div
              className="text-4xl text-white font-bold"
              style={{ fontFamily }}
            >
              <span className="block">Create</span>
              <span className="block text-yellow-300">Amazing</span>
              <span className="block">Content</span>
            </div>
          }
          createTimeline={({ textRef, tl }) => {
            // Split the text into individual characters
            const splitText = new SplitText(textRef.current, {
              type: "chars",
              charsClass: "char",
            });

            // Set initial state - characters are invisible and scaled down
            gsap.set(splitText.chars, {
              opacity: 0,
              scale: 0,
              rotation: 180,
            });

            // Animate characters appearing with bounce effect
            tl.to(splitText.chars, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1,
              stagger: 0.1,
              ease: "bounce.out",
            });

            // Add a subtle pulse effect
            tl.to(
              splitText.chars,
              {
                scale: 1.05,
                duration: 0.5,
                stagger: 0.05,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
              },
              "+=0.3",
            );

            return tl;
          }}
        />

        <TextAnimation
          text={
            <div className="text-xl text-white/80" style={{ fontFamily }}>
              <span className="block">Perfect for</span>
              <span className="block">Social Media</span>
            </div>
          }
          createTimeline={({ textRef, tl }) => {
            // Split the text into words
            const splitText = new SplitText(textRef.current, {
              type: "words",
              wordsClass: "word",
            });

            // Set initial state
            gsap.set(splitText.words, {
              opacity: 0,
              y: 30,
            });

            // Animate words appearing
            tl.to(
              splitText.words,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
              },
              "+=0.5",
            );

            return tl;
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
