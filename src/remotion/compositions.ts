import { CorporateSlideshow } from "./compositions/CorporateSlideshow";

export const composition = {
  id: "CorporateSlideshow",
  component: CorporateSlideshow,
  // Total: scenes (100+120+120+120+80=540) + transitions (25+30+25+20=100) = 640
  durationInFrames: 640,
  fps: 30,
  width: 1920,
  height: 1080,
};
