import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `FluidGradient` component.
 */
export type FluidGradientProps = {
  /** Primary color. */
  primaryColor?: string;
  /** Secondary color. */
  secondaryColor?: string;
  /** Background/base color. */
  backgroundColor?: string;
  /** Speed of the animation (0.1-0.5 recommended for premium feel). */
  speed?: number;
  /** Scale of the noise pattern (1-2 for subtle). */
  scale?: number;
  /** Intensity of color blending (0-1, lower is more subtle). */
  intensity?: number;
};

/** @deprecated Use FluidGradientProps instead */
export type LavaShaderProps = FluidGradientProps;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uBackgroundColor;
  uniform float uScale;
  uniform float uIntensity;
  varying vec2 vUv;

  // Simplex noise functions
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

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    // Reduced iterations for smoother, less complex result
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    
    // Flowing animation
    float time = uTime * 0.2;
    
    // Rich noise layers
    vec3 pos = vec3(uv * uScale, time);
    float noise1 = fbm(pos);
    float noise2 = fbm(pos + vec3(3.2, 1.1, time * 0.6));
    float noise3 = fbm(pos * 0.5 + vec3(time * 0.3, 0.0, 0.0));
    
    // Combine noises for rich variation
    float finalNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    finalNoise = finalNoise * 0.5 + 0.5; // Normalize to 0-1
    
    // Strong color transitions
    float blend1 = smoothstep(0.15, 0.85, finalNoise);
    float blend2 = smoothstep(0.3, 0.95, finalNoise);
    
    // Rich color mixing
    vec3 color = mix(uBackgroundColor, uSecondaryColor, blend1 * uIntensity * 1.2);
    color = mix(color, uPrimaryColor, blend2 * uIntensity);
    
    // Subtle film grain
    float grain = fract(sin(dot(uv * 400.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.01;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 1.2);
    color *= 0.92 + vignette * 0.08;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `FluidGradient` creates a subtle, flowing gradient background with organic movement.
 * Perfect for premium motion design with gentle, breathing animation.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <FluidGradient
 *     primaryColor="#4a5568"
 *     secondaryColor="#2d3748"
 *     backgroundColor="#1a202c"
 *     speed={0.3}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const FluidGradient = ({
  primaryColor = "#5a6a80",
  secondaryColor = "#3a4a60",
  backgroundColor = "#1a202c",
  speed = 0.3,
  scale = 1.5,
  intensity = 0.9,
}: FluidGradientProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Use ref to pass current frame to useFrame callback (avoids stale closure)
  const frameRef = useRef(frame);
  frameRef.current = frame;

  // Calculate plane dimensions to fill viewport at fov=90, z=1
  // Visible height = 2 * tan(45°) * 1 = 2
  // Visible width = visible height * aspect ratio
  const aspect = width / height;
  const planeHeight = 2;
  const planeWidth = planeHeight * aspect;

  const primary = useMemo(() => new THREE.Color(primaryColor), [primaryColor]);
  const secondary = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);
  const background = useMemo(() => new THREE.Color(backgroundColor), [backgroundColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPrimaryColor: { value: primary },
      uSecondaryColor: { value: secondary },
      uBackgroundColor: { value: background },
      uScale: { value: scale },
      uIntensity: { value: intensity },
    }),
    [primary, secondary, background, scale, intensity],
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = (frameRef.current / fps) * speed;
    }
  });

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

/** @deprecated Use FluidGradient instead */
export const LavaShader = FluidGradient;
