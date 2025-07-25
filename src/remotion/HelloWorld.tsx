import { AbsoluteFill } from "remotion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextAnimation } from "./base/components/TextAnimation";
import { loadFont } from "@remotion/google-fonts/Inter";

export const HelloWorld: React.FC = () => {
  const { fontFamily } = loadFont();

  return (
    <AbsoluteFill className="flex items-center justify-center bg-white">
      <TextAnimation
        text={
          <div className="text-xl" style={{ fontFamily }}>
            Welcome to{" "}
            <span className={`text-green-400 font-light`}>Motionable</span>
          </div>
        }
        createTimeline={({ textRef, tl }) => {
          // Split the text into individual characters using the ref
          const splitText = new SplitText(textRef.current, {
            type: "chars",
            charsClass: "char",
          });

          // Set initial state - characters are invisible and moved down
          gsap.set(splitText.chars, {
            opacity: 0,
            y: 50,
            rotationX: 90,
          });

          // Animate characters appearing with stagger effect
          tl.to(splitText.chars, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.7)",
          });

          // Optional: Add a subtle hover effect that scales characters
          tl.to(
            splitText.chars,
            {
              scale: 1.1,
              duration: 0.3,
              stagger: 0.02,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            },
            "+=0.5",
          );

          return tl;
        }}
      />
    </AbsoluteFill>
  );
};
