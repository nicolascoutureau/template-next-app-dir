import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `FluidSimulation` component.
 */
export type FluidSimulationProps = {
  /** Array of fluid colors. */
  colors?: string[];
  /** Background color. */
  backgroundColor?: string;
  /** Speed of the fluid motion. */
  speed?: number;
  /** Viscosity of the fluid (lower = more fluid). */
  viscosity?: number;
  /** Turbulence intensity. */
  turbulence?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uBackgroundColor;
  uniform float uViscosity;
  uniform float uTurbulence;
  varying vec2 vUv;

  // Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Curl noise for fluid-like motion
  vec2 curlNoise(vec2 p, float time) {
    float eps = 0.01;
    
    float n1 = snoise(vec3(p + vec2(eps, 0.0), time));
    float n2 = snoise(vec3(p - vec2(eps, 0.0), time));
    float n3 = snoise(vec3(p + vec2(0.0, eps), time));
    float n4 = snoise(vec3(p - vec2(0.0, eps), time));
    
    float x = (n3 - n4) / (2.0 * eps);
    float y = -(n1 - n2) / (2.0 * eps);
    
    return vec2(x, y);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * (1.0 / uViscosity);
    
    // Domain warping for fluid effect
    vec2 curl1 = curlNoise(uv * 2.0, time * 0.5) * uTurbulence;
    vec2 curl2 = curlNoise((uv + curl1) * 3.0, time * 0.3) * uTurbulence * 0.5;
    vec2 curl3 = curlNoise((uv + curl2) * 4.0, time * 0.2) * uTurbulence * 0.25;
    
    vec2 distortedUv = uv + curl1 + curl2 + curl3;
    
    // Create fluid layers
    float layer1 = fbm(vec3(distortedUv * 3.0, time * 0.2));
    float layer2 = fbm(vec3(distortedUv * 4.0 + 10.0, time * 0.15));
    float layer3 = fbm(vec3(distortedUv * 2.0 + 20.0, time * 0.25));
    
    // Normalize layers
    layer1 = smoothstep(-0.5, 0.5, layer1);
    layer2 = smoothstep(-0.5, 0.5, layer2);
    layer3 = smoothstep(-0.5, 0.5, layer3);
    
    // Mix colors based on layers
    vec3 color = uBackgroundColor;
    color = mix(color, uColor1, layer1 * 0.6);
    color = mix(color, uColor2, layer2 * 0.5);
    color = mix(color, uColor3, layer3 * 0.4);
    
    // Add highlights
    float highlight = smoothstep(0.6, 0.9, layer1 + layer2 * 0.5);
    color += highlight * 0.15;
    
    // Subtle color shift based on position
    float shift = fbm(vec3(distortedUv * 1.5, time * 0.1));
    color = mix(color, color.gbr, shift * 0.1);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `FluidSimulation` creates a smooth, ink-in-water style fluid background.
 * Uses curl noise for realistic fluid dynamics simulation.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <FluidSimulation
 *     colors={["#1e3a8a", "#7c3aed", "#db2777"]}
 *     backgroundColor="#0f0f23"
 *   />
 * </ThreeCanvas>
 * ```
 */
export const FluidSimulation = ({
  colors = ["#1e3a8a", "#7c3aed", "#db2777"],
  backgroundColor = "#0f0f23",
  speed = 1,
  viscosity = 1,
  turbulence = 0.5,
}: FluidSimulationProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 3) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 3).map((c) => new THREE.Color(c));
  }, [colors]);

  const bgColor = useMemo(() => new THREE.Color(backgroundColor), [backgroundColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uBackgroundColor: { value: bgColor },
      uViscosity: { value: viscosity },
      uTurbulence: { value: turbulence },
    }),
    [threeColors, bgColor, viscosity, turbulence],
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = (frame / fps) * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};
