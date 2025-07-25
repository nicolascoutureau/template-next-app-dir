import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

export const SimpleText: React.FC = () => {
  const { fontFamily } = loadFont();

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div
        className="text-6xl font-bold text-white text-center"
        style={{ fontFamily }}
      >
        <div className="mb-4">Simple Text</div>
        <div className="text-3xl font-normal opacity-80">
          Auto-imported Composition
        </div>
      </div>
    </AbsoluteFill>
  );
};
