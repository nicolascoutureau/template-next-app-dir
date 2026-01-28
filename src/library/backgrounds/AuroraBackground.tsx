import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Props for the `AuroraBackground` component.
 */
export type AuroraBackgroundProps = {
  /** Array of aurora colors (greens, blues, purples work best). */
  colors?: string[];
  /** Background/sky color. */
  backgroundColor?: string;
  /** Speed of the aurora movement. */
  speed?: number;
  /** Intensity of the aurora glow (0-1). */
  intensity?: number;
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
  uniform float uIntensity;
  uniform float uBands;
  varying vec2 vUv;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // Start with background color
    vec3 color = uBackgroundColor;
    
    // Create multiple aurora bands
    for (float i = 0.0; i < 3.0; i++) {
      float bandOffset = i * 0.15;
      float bandSpeed = 0.3 + i * 0.1;
      
      // Horizontal wave pattern
      float wave = sin(uv.x * 3.0 + time * bandSpeed + i * 2.0) * 0.1;
      wave += sin(uv.x * 7.0 - time * bandSpeed * 0.5) * 0.05;
      
      // Vertical noise for curtain effect
      float noise = fbm(vec2(uv.x * 2.0 + time * 0.1, uv.y * 0.5 + i));
      
      // Create aurora curtain shape
      float curtainY = 0.3 + bandOffset + wave + noise * 0.15;
      float curtainHeight = 0.2 + noise * 0.1;
      
      // Soft falloff for aurora band
      float bandMask = smoothstep(curtainY, curtainY + curtainHeight, uv.y);
      bandMask *= smoothstep(curtainY + curtainHeight + 0.3, curtainY + curtainHeight, uv.y);
      
      // Add vertical streaks
      float streaks = fbm(vec2(uv.x * 20.0 + time * 0.2, uv.y * 2.0 + i));
      streaks = pow(streaks * 0.5 + 0.5, 2.0);
      bandMask *= (0.5 + streaks * 0.5);
      
      // Color selection
      vec3 bandColor;
      if (i < 1.0) {
        bandColor = uColor1;
      } else if (i < 2.0) {
        bandColor = uColor2;
      } else {
        bandColor = uColor3;
      }
      
      // Add glow
      float glow = bandMask * uIntensity * (1.0 - i * 0.2);
      color += bandColor * glow;
      
      // Add bright core
      float core = smoothstep(curtainHeight * 0.8, curtainHeight * 0.2, abs(uv.y - curtainY - curtainHeight * 0.5));
      core *= bandMask * 0.3;
      color += bandColor * core * uIntensity;
    }
    
    // Add subtle shimmer
    float shimmer = fbm(uv * 10.0 + time);
    shimmer = smoothstep(0.4, 0.6, shimmer) * 0.05 * uIntensity;
    color += shimmer;
    
    // Add stars
    float stars = fbm(uv * 50.0);
    stars = pow(smoothstep(0.7, 0.9, stars), 4.0) * 0.3;
    color += stars * (1.0 - length(color) * 0.5);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `AuroraBackground` creates a stunning northern lights effect.
 * Features flowing curtains of light with organic movement and subtle stars.
 * 
 * Use inside a ThreeCanvas with camera={{ position: [0, 0, 1], fov: 90 }}.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 1], fov: 90 }}>
 *   <AuroraBackground
 *     colors={["#00ff87", "#60efff", "#ff00ff"]}
 *     backgroundColor="#0a0a1a"
 *   />
 * </ThreeCanvas>
 * ```
 */
export const AuroraBackground = ({
  colors = ["#00ff87", "#60efff", "#ff00ff"],
  backgroundColor = "#0a0a1a",
  speed = 1,
  intensity = 0.7,
}: AuroraBackgroundProps) => {
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

  const bgColor = useMemo(
    () => new THREE.Color(backgroundColor),
    [backgroundColor],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: threeColors[0] },
      uColor2: { value: threeColors[1] },
      uColor3: { value: threeColors[2] },
      uBackgroundColor: { value: bgColor },
      uIntensity: { value: intensity },
      uBands: { value: 3 },
    }),
    [threeColors, bgColor, intensity],
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
