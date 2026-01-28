import React from "react";

export const Lights: React.FC = () => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light from the opposite side */}
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Point light for highlights */}
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />
    </>
  );
};
