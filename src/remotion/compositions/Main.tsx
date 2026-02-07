import { AbsoluteFill, Artifact, useCurrentFrame } from "remotion";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { loadFont } from "@remotion/google-fonts/SpaceMono";

// This re-runs on every HMR update of this file
const hmrKey = Date.now();

export const Main: React.FC = () => {
  const { fontFamily } = loadFont();
  const frame = useCurrentFrame();
  return (
    <>
      {/* Leave this here to generate a thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <AbsoluteFill className="flex items-center justify-center bg-[#0f1115]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.28),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />
        <TextAnimation
          key={hmrKey}
          className="text-6xl md:text-7xl font-bold text-center tracking-tight text-white drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          style={{ fontFamily, fontWeight: 700, letterSpacing: "0.01em" }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const splitText = new SplitText(textRef.current, {
              type: "chars",
              charsClass: "char",
            });

            // Keep text fully visible on frame 0
            tl.set(splitText.chars, {
              opacity: 1,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              z: 0,
              transformPerspective: 800,
              transformOrigin: "50% 50% -20px",
            });

            // 3D block-style pulse without hiding the text
            tl.to(
              splitText.chars,
              {
                rotationX: -18,
                rotationY: 12,
                z: 22,
                textShadow:
                  "0 8px 0 rgba(17,24,39,0.6), 0 20px 40px rgba(37,99,235,0.35)",
                duration: 0.6,
                stagger: 0.025,
                ease: "power2.out",
              },
              0.2,
            );

            tl.to(splitText.chars, {
              rotationX: 0,
              rotationY: 0,
              z: 0,
              textShadow: "0 10px 30px rgba(37,99,235,0.35)",
              duration: 0.7,
              stagger: 0.02,
              ease: "sine.inOut",
            });

            return tl;
          }}
        >
          Welcome to{" "}
          <span className="text-sky-400 font-light">Typeframes</span>
        </TextAnimation>
      </AbsoluteFill>
    </>
  );
};
