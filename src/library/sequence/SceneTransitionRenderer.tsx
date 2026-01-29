import * as THREE from "three";
import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree, createPortal } from "@react-three/fiber";
import { useFBO, OrthographicCamera } from "@react-three/drei";
import type { TransitionSpec } from "./types";

// Vertex shader - simple fullscreen quad
const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Fragment shader - DEBUG: just show tFrom texture
const FRAG = /* glsl */ `
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform float progress;
uniform int mode;
uniform vec2 wipeDir;
uniform float seed;
uniform float softness;
varying vec2 vUv;

void main() {
  // DEBUG: Just show tFrom texture to verify shader works
  gl_FragColor = texture2D(tFrom, vUv);
}
`;

/**
 * Convert direction string to normalized vector for wipe shader
 */
function directionToVector(
  direction: "left" | "right" | "up" | "down",
): THREE.Vector2 {
  switch (direction) {
    case "left":
      return new THREE.Vector2(-1, 0);
    case "right":
      return new THREE.Vector2(1, 0);
    case "up":
      return new THREE.Vector2(0, 1);
    case "down":
      return new THREE.Vector2(0, -1);
  }
}

export interface SceneTransitionRendererProps {
  /** Source scene element (transitioning from) */
  from: React.ReactNode;
  /** Target scene element (transitioning to) */
  to: React.ReactNode;
  /** Transition progress from 0 to 1 */
  progress: number;
  /** Transition mode specification */
  mode: TransitionSpec;
}

/**
 * SceneTransitionRenderer - GPU-based scene transition using FBOs
 * 
 * Key insight: When we render the MAIN scene to FBO, colors are correct.
 * When we render a PORTAL scene to FBO with manual gl.render(), colors are wrong.
 * 
 * Solution: Don't use portals. Instead, render children directly but control
 * visibility to capture each scene separately.
 */
export const SceneTransitionRenderer: React.FC<
  SceneTransitionRendererProps
> = ({ from, to, progress, mode }) => {
  const { gl, size, camera, scene } = useThree();
  
  // Refs for the scene groups
  const fromGroupRef = useRef<THREE.Group>(null);
  const toGroupRef = useRef<THREE.Group>(null);
  const quadRef = useRef<THREE.Mesh>(null);
  
  // Get actual pixel dimensions
  const dpr = gl.getPixelRatio();
  const width = Math.floor(size.width * dpr);
  const height = Math.floor(size.height * dpr);
  
  // Calculate plane size from orthographic camera bounds
  const orthoCamera = camera as THREE.OrthographicCamera;
  const planeWidth = orthoCamera.right - orthoCamera.left;
  const planeHeight = orthoCamera.top - orthoCamera.bottom;
  
  // Create FBOs using drei's useFBO
  const fboFrom = useFBO(width, height, { 
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const fboTo = useFBO(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });

  // Determine transition type
  const transitionMode = mode.type === "fade" ? 0 : mode.type === "wipe" ? 1 : 2;
  const useShader = transitionMode !== 0; // Use shader for wipe/dissolve, basic materials for fade
  
  // Materials for simple fade (using Two MeshBasicMaterials with opacity)
  const materialFrom = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: null,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: true,
    });
  }, []);
  
  const materialTo = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: null,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: true,
    });
  }, []);

  // ShaderMaterial for wipe/dissolve
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tFrom: { value: null },
        tTo: { value: null },
        progress: { value: 0 },
        mode: { value: 0 },
        wipeDir: { value: new THREE.Vector2(1, 0) },
        seed: { value: 1 },
        softness: { value: 0.08 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      toneMapped: true,
    });
  }, []);

  // Update fade materials
  materialFrom.map = fboFrom.texture;
  materialFrom.opacity = 1 - progress;
  materialFrom.needsUpdate = true;
  
  materialTo.map = fboTo.texture;
  materialTo.opacity = progress;
  materialTo.needsUpdate = true;
  
  // Update shader uniforms
  shaderMaterial.uniforms.tFrom.value = fboFrom.texture;
  shaderMaterial.uniforms.tTo.value = fboTo.texture;
  shaderMaterial.uniforms.progress.value = progress;
  shaderMaterial.uniforms.mode.value = transitionMode;
  
  if (mode.type === "wipe") {
    shaderMaterial.uniforms.wipeDir.value.copy(directionToVector(mode.direction));
  } else if (mode.type === "dissolve") {
    shaderMaterial.uniforms.seed.value = mode.seed;
    shaderMaterial.uniforms.softness.value = mode.softness ?? 0.08;
  }

  // Render each scene to its FBO by toggling visibility
  useFrame(() => {
    if (!fromGroupRef.current || !toGroupRef.current || !quadRef.current) return;
    
    // Hide quad during FBO capture
    quadRef.current.visible = false;
    
    // Capture "from" scene: show from, hide to
    fromGroupRef.current.visible = true;
    toGroupRef.current.visible = false;
    
    gl.setRenderTarget(fboFrom);
    gl.clear(true, true, true);
    gl.render(scene, camera);
    
    // Capture "to" scene: hide from, show to
    fromGroupRef.current.visible = false;
    toGroupRef.current.visible = true;
    
    gl.setRenderTarget(fboTo);
    gl.clear(true, true, true);
    gl.render(scene, camera);
    
    // Restore: hide both scenes, show quad
    fromGroupRef.current.visible = false;
    toGroupRef.current.visible = false;
    quadRef.current.visible = true;
    
    gl.setRenderTarget(null);
  }, -1); // Run before normal render

  return (
    <>
      {/* Scene groups - visibility controlled in useFrame */}
      <group ref={fromGroupRef} visible={false}>
        {from}
      </group>
      <group ref={toGroupRef} visible={false}>
        {to}
      </group>

      {/* Render quads based on transition type */}
      <group ref={quadRef}>
        {!useShader ? (
          // Fade: Two quads with opacity blending
          <>
            <mesh frustumCulled={false} position={[0, 0, -0.01]}>
              <planeGeometry args={[planeWidth, planeHeight]} />
              <primitive attach="material" object={materialFrom} />
            </mesh>
            <mesh frustumCulled={false} position={[0, 0, 0]}>
              <planeGeometry args={[planeWidth, planeHeight]} />
              <primitive attach="material" object={materialTo} />
            </mesh>
          </>
        ) : (
          // Wipe/Dissolve: Single quad with shader
          <mesh frustumCulled={false} position={[0, 0, 0]}>
            <planeGeometry args={[planeWidth, planeHeight]} />
            <primitive attach="material" object={shaderMaterial} />
          </mesh>
        )}
      </group>
    </>
  );
};

SceneTransitionRenderer.displayName = "SceneTransitionRenderer";
