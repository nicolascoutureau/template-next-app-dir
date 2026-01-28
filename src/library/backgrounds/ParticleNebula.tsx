import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `ParticleNebula` component.
 */
export type ParticleNebulaProps = {
  /** Array of nebula colors. */
  colors?: string[];
  /** Background color (deep space). */
  backgroundColor?: string;
  /** Speed of the animation. */
  speed?: number;
  /** Density of the nebula clouds. */
  density?: number;
  /** Enable star field. */
  stars?: boolean;
  /** Brightness of the nebula (0-1). */
  brightness?: number;
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
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uBackgroundColor;
  uniform float uDensity;
  uniform bool uStars;
  uniform float uBrightness;
  varying vec2 vUv;

  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
  }

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

  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  float stars(vec2 uv) {
    vec2 grid = fract(uv * 200.0);
    vec2 id = floor(uv * 200.0);
    float h = hash(id);
    
    if (h > 0.98) {
      float star = smoothstep(0.1, 0.0, length(grid - 0.5));
      float twinkle = sin(h * 100.0 + uTime * (h * 5.0 + 1.0)) * 0.5 + 0.5;
      return star * twinkle * (h - 0.98) * 50.0;
    }
    return 0.0;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.3;
    
    // Start with deep space background
    vec3 color = uBackgroundColor;
    
    // Add star field
    if (uStars) {
      float starField = stars(uv);
      starField += stars(uv * 1.5 + 0.5) * 0.5;
      starField += stars(uv * 0.7 + 0.3) * 0.7;
      color += vec3(starField);
    }
    
    // Create nebula clouds
    vec3 pos = vec3(uv * uDensity, time);
    
    // Multiple cloud layers
    float cloud1 = fbm(pos * 1.0 + vec3(0.0, 0.0, time * 0.1), 6);
    float cloud2 = fbm(pos * 1.5 + vec3(10.0, 0.0, time * 0.08), 5);
    float cloud3 = fbm(pos * 0.8 + vec3(20.0, 10.0, time * 0.12), 6);
    
    // Normalize and create density
    cloud1 = smoothstep(-0.2, 0.8, cloud1);
    cloud2 = smoothstep(-0.3, 0.7, cloud2);
    cloud3 = smoothstep(-0.1, 0.9, cloud3);
    
    // Color each cloud layer
    vec3 nebulaColor = vec3(0.0);
    nebulaColor += uColor1 * cloud1 * 0.6;
    nebulaColor += uColor2 * cloud2 * 0.5;
    nebulaColor += uColor3 * cloud3 * 0.4;
    
    // Add to background with additive blending
    color += nebulaColor * uBrightness;
    
    // Add bright cores
    float core1 = fbm(pos * 2.0 + vec3(5.0, 5.0, time * 0.05), 4);
    core1 = smoothstep(0.3, 0.7, core1);
    float core2 = fbm(pos * 2.5 + vec3(15.0, 5.0, time * 0.07), 4);
    core2 = smoothstep(0.4, 0.8, core2);
    
    vec3 coreColor = mix(uColor1, uColor2, 0.5) * 1.5;
    color += coreColor * (core1 * 0.2 + core2 * 0.15) * uBrightness;
    
    // Add subtle dust lanes (darker areas)
    float dust = fbm(pos * 3.0 + vec3(30.0, 20.0, time * 0.02), 4);
    dust = smoothstep(0.4, 0.6, dust);
    color *= 1.0 - dust * 0.2;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5) * 1.2);
    color *= 0.7 + vignette * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function NebulaPlane({
  colors,
  backgroundColor,
  density,
  stars,
  brightness,
  speed,
}: {
  colors: THREE.Color[];
  backgroundColor: THREE.Color;
  density: number;
  stars: boolean;
  brightness: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: colors[0] },
      uColor2: { value: colors[1] },
      uColor3: { value: colors[2] },
      uBackgroundColor: { value: backgroundColor },
      uDensity: { value: density },
      uStars: { value: stars },
      uBrightness: { value: brightness },
    }),
    [colors, backgroundColor, density, stars, brightness],
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
 * `ParticleNebula` creates a stunning deep space nebula effect.
 * Features volumetric cloud rendering with twinkling stars.
 *
 * @example
 * ```tsx
 * // Classic nebula
 * <ParticleNebula
 *   colors={["#7c3aed", "#ec4899", "#06b6d4"]}
 *   backgroundColor="#050510"
 * />
 *
 * // Fiery nebula
 * <ParticleNebula
 *   colors={["#dc2626", "#f97316", "#fbbf24"]}
 *   brightness={0.9}
 * />
 * ```
 */
export const ParticleNebula = ({
  colors = ["#7c3aed", "#ec4899", "#06b6d4"],
  backgroundColor = "#050510",
  speed = 1,
  density = 3,
  stars: showStars = true,
  brightness = 0.7,
  width,
  height,
}: ParticleNebulaProps) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  const threeColors = useMemo(() => {
    const normalizedColors = [...colors];
    while (normalizedColors.length < 3) {
      normalizedColors.push(normalizedColors[normalizedColors.length - 1]);
    }
    return normalizedColors.slice(0, 3).map((c) => new THREE.Color(c));
  }, [colors]);

  const bgColor = useMemo(
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
        <NebulaPlane
          colors={threeColors}
          backgroundColor={bgColor}
          density={density}
          stars={showStars}
          brightness={brightness}
          speed={speed}
        />
      </ThreeCanvas>
    </div>
  );
};
