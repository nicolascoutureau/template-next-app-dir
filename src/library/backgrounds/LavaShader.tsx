import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `LavaShader` component.
 */
export type LavaShaderProps = {
  /** Primary color of the lava. */
  primaryColor?: string;
  /** Secondary color for the lava flow. */
  secondaryColor?: string;
  /** Background/dark color. */
  backgroundColor?: string;
  /** Speed of the animation (1 = normal). */
  speed?: number;
  /** Scale of the noise pattern. */
  scale?: number;
  /** Intensity of the glow effect (0-1). */
  glowIntensity?: number;
  /** Width of the canvas. */
  width?: number;
  /** Height of the canvas. */
  height?: number;
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
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uBackgroundColor;
  uniform float uScale;
  uniform float uGlowIntensity;
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
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    
    // Create flowing lava effect
    float time = uTime * 0.3;
    
    // Multiple layers of noise for organic flow
    vec3 pos = vec3(uv * uScale, time);
    float noise1 = fbm(pos);
    float noise2 = fbm(pos + vec3(5.2, 1.3, time * 0.5));
    float noise3 = fbm(pos + vec3(noise1 * 2.0, noise2 * 2.0, time * 0.3));
    
    // Combine noise layers
    float finalNoise = noise1 + noise2 * 0.5 + noise3 * 0.25;
    finalNoise = finalNoise * 0.5 + 0.5; // Normalize to 0-1
    
    // Create temperature zones
    float temp = smoothstep(0.2, 0.8, finalNoise);
    
    // Color mixing
    vec3 color = mix(uBackgroundColor, uSecondaryColor, smoothstep(0.3, 0.5, temp));
    color = mix(color, uPrimaryColor, smoothstep(0.5, 0.8, temp));
    
    // Add glow for hot spots
    float glow = smoothstep(0.7, 1.0, temp) * uGlowIntensity;
    color += vec3(1.0, 0.8, 0.3) * glow * 0.5;
    
    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.3, 1.5, length(uv - 0.5) * 1.5);
    color *= vignette * 0.3 + 0.7;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function LavaPlane({
  primaryColor,
  secondaryColor,
  backgroundColor,
  scale,
  glowIntensity,
  speed,
}: {
  primaryColor: THREE.Color;
  secondaryColor: THREE.Color;
  backgroundColor: THREE.Color;
  scale: number;
  glowIntensity: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPrimaryColor: { value: primaryColor },
      uSecondaryColor: { value: secondaryColor },
      uBackgroundColor: { value: backgroundColor },
      uScale: { value: scale },
      uGlowIntensity: { value: glowIntensity },
    }),
    [primaryColor, secondaryColor, backgroundColor, scale, glowIntensity],
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
}

/**
 * `LavaShader` creates a realistic flowing lava/magma background effect.
 * Uses GLSL shaders with fractal Brownian motion for organic movement.
 *
 * @example
 * ```tsx
 * // Classic lava
 * <LavaShader
 *   primaryColor="#ff4500"
 *   secondaryColor="#ff8c00"
 *   backgroundColor="#1a0000"
 * />
 *
 * // Blue plasma variant
 * <LavaShader
 *   primaryColor="#00bfff"
 *   secondaryColor="#0040ff"
 *   backgroundColor="#000020"
 * />
 * ```
 */
export const LavaShader = ({
  primaryColor = "#ff4500",
  secondaryColor = "#ff8c00",
  backgroundColor = "#1a0000",
  speed = 1,
  scale = 3,
  glowIntensity = 0.8,
  width,
  height,
}: LavaShaderProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const primary = useMemo(() => new THREE.Color(primaryColor), [primaryColor]);
  const secondary = useMemo(
    () => new THREE.Color(secondaryColor),
    [secondaryColor],
  );
  const background = useMemo(
    () => new THREE.Color(backgroundColor),
    [backgroundColor],
  );

  return (
    <div style={{ width: w, height: h, position: "absolute", inset: 0 }}>
      <ThreeCanvas
        width={w}
        height={h}
        camera={{ position: [0, 0, 1], fov: 90 }}
      >
        <LavaPlane
          primaryColor={primary}
          secondaryColor={secondary}
          backgroundColor={background}
          scale={scale}
          glowIntensity={glowIntensity}
          speed={speed}
        />
      </ThreeCanvas>
    </div>
  );
};
