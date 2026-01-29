import { useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type GlowProps = {
  color?: string;
  intensity?: number;
  size?: number;
  pulseSpeed?: number;
  pulseAmount?: number;
  position?: [number, number, number];
  opacity?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uOpacity;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0);

    float pulse = 1.0 + uPulse * 0.3;
    float alpha = glow * uIntensity * pulse * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export const Glow = ({
  color = "#ffffff",
  intensity = 1.0,
  size = 2,
  pulseSpeed = 0,
  pulseAmount = 0.2,
  position = [0, 0, 0],
  opacity = 1.0,
}: GlowProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const glowColor = useMemo(() => new THREE.Color(color), [color]);

  const uniforms = useMemo(
    () => ({
      uColor: { value: glowColor },
      uIntensity: { value: intensity },
      uOpacity: { value: opacity },
      uPulse: { value: 0 },
    }),
    [glowColor, intensity, opacity]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const time = frameRef.current / fps;
      material.uniforms.uPulse.value = pulseSpeed > 0
        ? Math.sin(time * pulseSpeed * Math.PI * 2) * pulseAmount
        : 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
