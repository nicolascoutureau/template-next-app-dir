import { HelloWorld } from "./compositions/HelloWorld";

// Define composition metadata for auto-registration
export interface CompositionMeta {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps?: Record<string, unknown>;
}

// Auto-import all compositions
export const compositions: CompositionMeta[] = [
  {
    id: "HelloWorld",
    component: HelloWorld,
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
  },
];

// Helper function to get composition by ID
export const getCompositionById = (id: string): CompositionMeta | undefined => {
  return compositions.find((comp) => comp.id === id);
};

// Helper function to get all composition IDs
export const getCompositionIds = (): string[] => {
  return compositions.map((comp) => comp.id);
};
