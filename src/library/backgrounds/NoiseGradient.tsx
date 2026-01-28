import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Noise type for the gradient.
 */
export type NoiseType = "perlin" | "simplex" | "worley" | "voronoi";

/**
 * Props for the `NoiseGradient` component.
 */
export type NoiseGradientProps = {
  /** Array of gradient colors. */
  colors?: string[];
  /** Type of noise pattern. */
  noiseType?: NoiseType;
  /** Speed of the animation. */
  speed?: number;
  /** Scale of the noise pattern. */
  scale?: number;
  /** Contrast of the gradient (0-2). */
  contrast?: number;
  /** Grain intensity (0-1). */
  grain?: number;
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
  uniform vec3 uColor4;
  uniform float uScale;
  uniform float uContrast;
  uniform float uGrain;
  uniform int uNoiseType;
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

  // Voronoi noise
  vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  float voronoi(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    float res = 8.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 b = vec2(float(i), float(j));
        vec2 r = b - f + hash2(p + b);
        float d = dot(r, r);
        res = min(res, d);
      }
    }
    return sqrt(res);
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

  // Random for grain
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  vec3 getGradientColor(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.33) {
      return mix(uColor1, uColor2, t * 3.0);
    } else if (t < 0.66) {
      return mix(uColor2, uColor3, (t - 0.33) * 3.0);
    } else {
      return mix(uColor3, uColor4, (t - 0.66) * 3.0);
    }
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.5;
    
    float noiseValue;
    
    // Choose noise type
    if (uNoiseType == 0) {
      // Perlin-style (using simplex)
      noiseValue = fbm(vec3(uv * uScale, time * 0.3));
    } else if (uNoiseType == 1) {
      // Simplex layered
      noiseValue = snoise(vec3(uv * uScale, time * 0.2));
      noiseValue += snoise(vec3(uv * uScale * 2.0, time * 0.3)) * 0.5;
      noiseValue += snoise(vec3(uv * uScale * 4.0, time * 0.4)) * 0.25;
      noiseValue = noiseValue / 1.75;
    } else if (uNoiseType == 2) {
      // Worley-style
      noiseValue = voronoi(uv * uScale + time * 0.2);
      noiseValue = 1.0 - noiseValue;
    } else {
      // Voronoi cells
      float v1 = voronoi(uv * uScale + time * 0.1);
      float v2 = voronoi(uv * uScale * 2.0 - time * 0.15);
      noiseValue = mix(v1, v2, 0.5);
    }
    
    // Normalize and apply contrast
    noiseValue = noiseValue * 0.5 + 0.5;
    noiseValue = pow(noiseValue, 1.0 / uContrast);
    
    // Domain warping for organic feel
    vec2 warp = vec2(
      fbm(vec3(uv * 2.0 + time * 0.1, 0.0)),
      fbm(vec3(uv * 2.0 + 10.0 + time * 0.1, 0.0))
    );
    float warpedNoise = fbm(vec3((uv + warp * 0.2) * uScale, time * 0.2));
    noiseValue = mix(noiseValue, warpedNoise * 0.5 + 0.5, 0.3);
    
    // Get color from gradient
    vec3 color = getGradientColor(noiseValue);
    
    // Add film grain
    float grain = (random(uv * 1000.0 + time) - 0.5) * uGrain;
    color += grain;
    
    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length((uv - 0.5) * 1.5));
    color *= 0.85 + vignette * 0.15;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const noiseTypeMap: Record<NoiseType, number> = {
  perlin: 0,
  simplex: 1,
  worley: 2,
  voronoi: 3,
};

/**
 * `NoiseGradient` creates smooth, organic gradient backgrounds using various noise algorithms.
 * Inspired by Codrops-style abstract backgrounds with domain warping for extra organic feel.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <NoiseGradient
 *     colors={["#1a1a2e", "#16213e", "#e94560", "#ff6b6b"]}
 *     noiseType="simplex"
 *   />
 * </ThreeCanvas>
 * ```
 */
export const NoiseGradient = ({
  colors = ["#1a1a2e", "#16213e", "#e94560", "#ff6b6b"],
  noiseType = "simplex",
  speed = 1,
  scale = 3,
  contrast = 1,
  grain = 0.03,
}: NoiseGradientProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 4) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 4).map((c) => new THREE.Color(c));
  }, [colors]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uColor4: { value: threeColors[3] },
      uScale: { value: scale },
      uContrast: { value: contrast },
      uGrain: { value: grain },
      uNoiseType: { value: noiseTypeMap[noiseType] },
    }),
    [threeColors, noiseType, scale, contrast, grain],
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
