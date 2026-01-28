import { Main } from "./compositions/Main";

// Single composition configuration
// Product Launch Video: ~18 seconds total
// Scene 1: Opening (0-4s)
// Scene 2: Product Reveal (4-9s)
// Scene 3: Features (9-13s)
// Scene 4: CTA (13-18s)
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 540, // 18 seconds at 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};
