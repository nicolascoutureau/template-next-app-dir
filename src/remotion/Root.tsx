import "../styles/global.css";
import { Composition } from "remotion";
import { compositions } from "./compositions";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          durationInFrames={comp.durationInFrames}
          fps={comp.fps}
          width={comp.width}
          height={comp.height}
        />
      ))}
    </>
  );
};
