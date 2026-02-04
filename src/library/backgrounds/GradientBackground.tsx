import { useMemo, useRef } from "react";
import { useVideoConfig } from "remotion";
import * as THREE from "three";

/**
 * Gradient type.
 */
export type GradientType = "linear" | "radial" | "conic";

/**
 * Props for the `GradientBackground` component.
 */
export type GradientBackgroundProps = {
  /** Type of gradient. */
  type?: GradientType;
  /** Array of color stops. */
  colors: string[];
  /** Angle for linear gradients (in degrees). */
  angle?: number;
  /** Position for radial/conic gradients as [x, y] normalized (0-1). */
  position?: [number, number];
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const createFragmentShader = (colorCount: number, gradientType: GradientType) => `
  uniform vec3 uColors[${colorCount}];
  uniform float uAngle;
  uniform vec2 uPosition;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t;
    
    ${gradientType === "linear" ? `
    // Linear gradient
    float angleRad = uAngle * 3.14159265359 / 180.0;
    vec2 dir = vec2(cos(angleRad), sin(angleRad));
    vec2 centered = uv - 0.5;
    t = dot(centered, dir) + 0.5;
    ` : gradientType === "radial" ? `
    // Radial gradient
    float dist = length(uv - uPosition);
    t = dist * 1.414; // Normalize to ~0-1 for corner-to-corner
    ` : `
    // Conic gradient
    vec2 centered = uv - uPosition;
    float angleRad = uAngle * 3.14159265359 / 180.0;
    float a = atan(centered.y, centered.x) + angleRad;
    t = (a + 3.14159265359) / (2.0 * 3.14159265359);
    `}
    
    t = clamp(t, 0.0, 1.0);
    
    // Interpolate between colors
    float segment = t * ${(colorCount - 1).toFixed(1)};
    int idx = int(floor(segment));
    float localT = fract(segment);
    
    vec3 color = uColors[0];
    ${Array.from({ length: colorCount - 1 }, (_, i) => `
    if (idx == ${i}) {
      color = mix(uColors[${i}], uColors[${i + 1}], localT);
    }`).join("")}
    if (idx >= ${colorCount - 1}) {
      color = uColors[${colorCount - 1}];
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `GradientBackground` creates gradient backgrounds using Three.js shaders.
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * // Linear gradient
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <GradientBackground
 *     type="linear"
 *     colors={["#ff0080", "#7928ca", "#0070f3"]}
 *     angle={135}
 *   />
 * </ThreeCanvas>
 *
 * // Radial gradient
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <GradientBackground
 *     type="radial"
 *     colors={["#ffffff", "#000000"]}
 *     position={[0.5, 0.5]}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const GradientBackground = ({
  type = "linear",
  colors,
  angle = 180,
  position = [0.5, 0.5],
}: GradientBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { width, height } = useVideoConfig();

  // Calculate plane dimensions to fill viewport at fov=90, z=1
  const aspect = width / height;
  const planeHeight = 2;
  const planeWidth = planeHeight * aspect;

  const colorCount = Math.max(2, colors.length);
  const fragmentShader = useMemo(() => createFragmentShader(colorCount, type), [colorCount, type]);

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < colorCount) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.map((c) => new THREE.Color(c));
  }, [colors, colorCount]);

  const uniforms = useMemo(
    () => ({
      uColors: { value: threeColors },
      uAngle: { value: angle },
      uPosition: { value: new THREE.Vector2(position[0], position[1]) },
    }),
    [threeColors, angle, position]
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};
