import React from "react";
import { SceneProps } from "./types";

/**
 * Scene component - defines a scene within a Sequence3D.
 * This is a declarative component that doesn't render anything itself;
 * it's processed by the parent Sequence3D component.
 *
 * @example
 * ```tsx
 * <Sequence3D>
 *   <Scene duration={100} transition={flipUnder}>
 *     <MySceneContent />
 *   </Scene>
 *   <Scene duration={120} transition={slideLeft}>
 *     <AnotherScene />
 *   </Scene>
 * </Sequence3D>
 * ```
 */
export const Scene: React.FC<SceneProps> = ({ children }) => {
  // This component doesn't render anything directly.
  // It's used declaratively and processed by Sequence3D.
  return <>{children}</>;
};

// Mark this component so Sequence3D can identify it
Scene.displayName = "Scene";
