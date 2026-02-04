import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Light leak style presets.
 */
export type LightLeakStyle =
  | "warm"
  | "cool"
  | "rainbow"
  | "golden"
  | "film"
  | "neon"
  | "custom";

/**
 * Props for the `LightLeak` component.
 */
export type LightLeakProps = {
  /** Content to overlay light leak on (3D children). */
  children: ReactNode;
  /** Frame at which light leak starts. */
  startFrame?: number;
  /** Duration of the light leak in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Style preset for the light leak. */
  leakStyle?: LightLeakStyle;
  /** Custom colors (used when style is "custom"). */
  colors?: string[];
  /** Angle of the light leak gradient (in degrees). */
  angle?: number;
  /** Maximum opacity of the light leak. */
  maxOpacity?: number;
  /** Position offset [x, y] normalized (0-1). */
  position?: [number, number];
  /** Whether to animate position. */
  animated?: boolean;
};

const getLeakColors = (
  leakStyle: LightLeakStyle,
  customColors?: string[]
): string[] => {
  switch (leakStyle) {
    case "warm":
      return ["#ff6b35", "#f7931e", "#ffcc00", "#ff6b35"];
    case "cool":
      return ["#00d4ff", "#7b68ee", "#9370db", "#00d4ff"];
    case "rainbow":
      return ["#ff0080", "#ff8c00", "#ffff00", "#00ff00", "#00ffff", "#8000ff"];
    case "golden":
      return ["#ffd700", "#ffb347", "#ff8c00", "#ffd700"];
    case "film":
      return ["#ff4500", "#ff6347", "#ffa07a", "#ffb6c1", "#ff4500"];
    case "neon":
      return ["#ff00ff", "#00ffff", "#ff00ff", "#ffff00", "#00ffff"];
    case "custom":
      return customColors || ["#ffffff"];
    default:
      return ["#ffffff"];
  }
};

// Light leak shader
const leakVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const leakFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;
  uniform float uAngle;
  uniform vec2 uPosition;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Radial gradient from position
    float dist = length(uv - uPosition);
    float radial = 1.0 - smoothstep(0.0, 0.8, dist);
    radial = pow(radial, 1.5);
    
    // Directional gradient based on angle
    float angleRad = uAngle * 3.14159 / 180.0;
    vec2 dir = vec2(cos(angleRad), sin(angleRad));
    float linear = dot(uv - 0.5, dir) + 0.5;
    
    // Combine gradients
    float t = (radial * 0.6 + linear * 0.4);
    
    // Color interpolation
    vec3 color;
    if (t < 0.5) {
      color = mix(uColor1, uColor2, t * 2.0);
    } else {
      color = mix(uColor2, uColor3, (t - 0.5) * 2.0);
    }
    
    // Soft falloff
    float alpha = radial * uIntensity;
    alpha = pow(alpha, 0.8);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * `LightLeak` creates cinematic light leak/flare effects in 3D.
 * Adds the organic, analog feel of light bleeding onto film.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <LightLeak leakStyle="warm" durationInFrames={45}>
 *     <Image3D url="/my-image.jpg" scale={4} />
 *   </LightLeak>
 * </ThreeCanvas>
 * ```
 */
export const LightLeak = ({
  children,
  startFrame = 0,
  durationInFrames = 45,
  easing = Easing.inOut(Easing.quad),
  leakStyle = "warm",
  colors,
  angle = 45,
  maxOpacity = 0.5,
  position = [0.3, 0.3],
  animated = true,
}: LightLeakProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  const leakColors = getLeakColors(leakStyle, colors);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const intensity = Math.sin(easedProgress * Math.PI);

  // Animated position offset
  const animOffset = animated
    ? {
      x: Math.sin(easedProgress * Math.PI * 2) * 0.2,
      y: Math.cos(easedProgress * Math.PI * 1.5) * 0.15,
    }
    : { x: 0, y: 0 };

  const posX = position[0] + animOffset.x;
  const posY = position[1] + animOffset.y;

  const aspect = width / height;
  const overlaySize = 20;

  const threeColors = useMemo(() => {
    const normalized = [...leakColors];
    while (normalized.length < 3) {
      normalized.push(normalized[normalized.length - 1]);
    }
    return normalized.slice(0, 3).map((c) => new THREE.Color(c));
  }, [leakColors]);

  const uniforms = useMemo(
    () => ({
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uIntensity: { value: 0 },
      uAngle: { value: angle },
      uPosition: { value: new THREE.Vector2(posX, posY) },
    }),
    [threeColors, angle, posX, posY]
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uIntensity.value = intensity * maxOpacity;
      material.uniforms.uPosition.value.set(posX, posY);
    }
  });

  return (
    <group>
      {children}

      {/* Light leak overlay */}
      {intensity > 0.01 && (
        <mesh ref={meshRef} position={[0, 0, 4]} renderOrder={100}>
          <planeGeometry args={[overlaySize * aspect, overlaySize]} />
          <shaderMaterial
            vertexShader={leakVertexShader}
            fragmentShader={leakFragmentShader}
            uniforms={uniforms}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
