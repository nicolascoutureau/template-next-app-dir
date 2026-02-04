import { useMemo, useRef } from "react";
import { useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useTexture, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export interface MediaFrameProps {
  /** Image source URL */
  src: string;
  /** Width of the frame */
  width?: number;
  /** Height of the frame */
  height?: number;
  /** Border radius (corner rounding) */
  borderRadius?: number;
  /** Stroke/border width */
  strokeWidth?: number;
  /** Stroke/border color */
  strokeColor?: string;
  /** Frame at which stroke animation starts */
  strokeAnimationDelay?: number;
  /** Duration of stroke animation in frames */
  strokeDuration?: number;
  /** Frame at which content fade starts */
  contentDelay?: number;
  /** Duration of content fade in frames */
  contentFadeDuration?: number;
  /** Position offset [x, y, z] */
  position?: [number, number, number];
}

// Shader for animated stroke
const strokeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const strokeFragmentShader = `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uStrokeWidth;
  uniform float uBorderRadius;
  uniform vec2 uSize;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * uSize;
    vec2 halfSize = uSize * 0.5;
    
    float d = roundedBoxSDF(p, halfSize, uBorderRadius);
    
    // Create stroke mask
    float strokeOuter = smoothstep(0.0, 0.02, -d);
    float strokeInner = smoothstep(0.0, 0.02, -(d + uStrokeWidth));
    float stroke = strokeOuter - strokeInner;
    
    // Animate stroke drawing (using angle-based progress)
    float angle = atan(p.y, p.x);
    float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
    float drawProgress = smoothstep(normalizedAngle - 0.05, normalizedAngle + 0.05, uProgress);
    
    // Alternative: use perimeter-based progress
    float perimeter = 2.0 * (uSize.x + uSize.y - 4.0 * uBorderRadius) + 2.0 * 3.14159 * uBorderRadius;
    
    float alpha = stroke * uProgress;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * `MediaFrame` displays an image with an animated stroke border in 3D.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 5], fov: 50 }}>
 *   <MediaFrame
 *     src="/my-image.jpg"
 *     width={4}
 *     height={3}
 *     borderRadius={0.2}
 *     strokeWidth={0.05}
 *     strokeColor="#FFFFFF"
 *     strokeDuration={30}
 *   />
 * </ThreeCanvas>
 * ```
 */
export const MediaFrame = ({
  src,
  width = 4,
  height = 3,
  borderRadius = 0.2,
  strokeWidth = 0.05,
  strokeColor = "#FFFFFF",
  strokeAnimationDelay = 0,
  strokeDuration = 30,
  contentDelay,
  contentFadeDuration = 15,
  position = [0, 0, 0],
}: MediaFrameProps) => {
  const frame = useCurrentFrame();
  const strokeMeshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(src);

  const effectiveContentDelay = contentDelay ?? strokeAnimationDelay + strokeDuration;

  // Stroke animation progress
  const strokeLocalFrame = frame - strokeAnimationDelay;
  const strokeProgress = interpolate(
    strokeLocalFrame,
    [0, strokeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Content fade progress
  const contentLocalFrame = frame - effectiveContentDelay;
  const contentOpacity = interpolate(
    contentLocalFrame,
    [0, contentFadeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const color = useMemo(() => new THREE.Color(strokeColor), [strokeColor]);

  const strokeUniforms = useMemo(
    () => ({
      uColor: { value: color },
      uProgress: { value: 0 },
      uStrokeWidth: { value: strokeWidth },
      uBorderRadius: { value: borderRadius },
      uSize: { value: new THREE.Vector2(width, height) },
    }),
    [color, strokeWidth, borderRadius, width, height]
  );

  // Update stroke progress uniform
  useFrame(() => {
    if (strokeMeshRef.current) {
      const material = strokeMeshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgress.value = strokeProgress;
    }
  });

  // Configure texture
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  return (
    <group position={position}>
      {/* Image content with rounded corners */}
      {contentOpacity > 0 && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[width - strokeWidth * 2, height - strokeWidth * 2]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={contentOpacity}
          />
        </mesh>
      )}

      {/* Animated stroke border */}
      {strokeProgress > 0 && strokeProgress < 1 && (
        <mesh ref={strokeMeshRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[width + strokeWidth, height + strokeWidth]} />
          <shaderMaterial
            vertexShader={strokeVertexShader}
            fragmentShader={strokeFragmentShader}
            uniforms={strokeUniforms}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Static stroke border when animation complete */}
      {strokeProgress >= 1 && (
        <lineSegments position={[0, 0, 0.01]}>
          <edgesGeometry
            args={[new THREE.PlaneGeometry(width, height)]}
          />
          <lineBasicMaterial color={color} linewidth={1} />
        </lineSegments>
      )}
    </group>
  );
};

export type ImageFit = "cover" | "contain" | "fill";
