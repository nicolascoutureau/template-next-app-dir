import { useMemo } from "react";
import { useVideoConfig, useCurrentFrame, spring, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Image, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  SplitText3DGsap,
  gsapPresetTypewriter,
  gsapPresetFadeUp,
  RichText3DGsap,
  richTextPresetTypewriter,
  // SceneStack - LLM-friendly API
  SceneStack,
  type TransitionSpec,
} from "../../library";
import { getFontUrl } from "../fonts";

const colors = {
  black: "#000000",
  cream: "#F5F5F0",
  white: "#FFFFFF",
  darkText: "#1A1A1A",
  gold: "#D4AF37",
  goldLight: "#F4D03F",
};

const FONTS = {
  bold: getFontUrl("Inter", 700),
  semibold: getFontUrl("Inter", 600),
  regular: getFontUrl("Inter", 400),
};

export const CorporateSlideshow: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const aspect = width / height;

  // Define scenes - each with id, duration, and element
  const scenes = useMemo(
    () => [
      { id: "intro", durationInFrames: 100, element: <Scene1Content fps={fps} /> },
      { id: "strategy", durationInFrames: 120, element: <Scene2Content fps={fps} /> },
      { id: "values", durationInFrames: 120, element: <Scene3Content fps={fps} /> },
      { id: "team", durationInFrames: 120, element: <Scene4Content fps={fps} /> },
      { id: "cta", durationInFrames: 80, element: <Scene5Content fps={fps} /> },
    ],
    [fps]
  );

  // Define transitions between scenes (length = scenes.length - 1)
  // Using creative Akella-style transitions
  const transitions: TransitionSpec[] = useMemo(
    () => [
      { type: "morph", durationInFrames: 35, intensity: 0.25 },           // intro → strategy: organic wave distortion
      { type: "cube", durationInFrames: 30, direction: "left" },          // strategy → values: 3D cube rotation
      { type: "ripple", durationInFrames: 35, frequency: 25, amplitude: 0.08 }, // values → team: water ripple
      { type: "rgbShift", durationInFrames: 25, intensity: 0.8 },         // team → cta: chromatic aberration
    ],
    []
  );

  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      camera={{
        position: [0, 0, 10],
        left: -6 * aspect,
        right: 6 * aspect,
        top: 6,
        bottom: -6,
        near: 0.1,
        far: 100,
      }}
    >
      <SceneStack scenes={scenes} transitions={transitions} />
    </ThreeCanvas>
  );
};

// Scene Content Components
const Scene1Content: React.FC<{ fps: number }> = ({ fps }) => (
  <>
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 15]} />
      <meshBasicMaterial color={colors.black} />
    </mesh>
    <ColorBar3D
      position={[0, 0.8, 0]}
      width={3.5}
      height={0.04}
      color={colors.gold}
      startFrame={10}
      fps={fps}
    />
    <RichText3DGsap
      segments={[
        { text: "Create with ", fontUrl: FONTS.bold, color: colors.white },
        { text: "motion", fontUrl: FONTS.bold, color: colors.gold },
      ]}
      position={[0, 0, 0]}
      fontSize={0.6}
      createTimeline={richTextPresetTypewriter}
    />
  </>
);

const Scene2Content: React.FC<{ fps: number }> = ({ fps }) => (
  <>
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 15]} />
      <meshBasicMaterial color={colors.cream} />
    </mesh>
    <ImageWithBorder
      url="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
      position={[-3, 0, 0]}
      width={4.5}
      height={3}
      radius={0.15}
      strokeWidth={0.05}
      strokeColor={colors.gold}
      strokeDelay={5}
      strokeDuration={30}
    />
    <ColorBar3D
      position={[1.5, 1.5, 0]}
      width={0.8}
      height={0.04}
      color={colors.gold}
      startFrame={25}
      fps={fps}
    />
    <RichText3DGsap
      segments={[
        { text: "Ideas ", fontUrl: FONTS.bold, color: colors.gold },
        {
          text: "that become ",
          fontUrl: FONTS.semibold,
          color: colors.darkText,
        },
        { text: "strategy.", fontUrl: FONTS.bold, color: colors.gold },
      ]}
      position={[2.5, 0, 0]}
      fontSize={0.4}
      createTimeline={richTextPresetTypewriter}
    />
  </>
);

const Scene3Content: React.FC<{ fps: number }> = ({ fps }) => (
  <>
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 15]} />
      <meshBasicMaterial color={colors.black} />
    </mesh>
    <ColorBar3D
      position={[0, 3.1, 0]}
      width={1.2}
      height={0.03}
      color={colors.gold}
      startFrame={10}
      fps={fps}
    />
    <SplitText3DGsap
      text="Innovation"
      fontUrl={FONTS.bold}
      position={[0, 2.5, 0]}
      fontSize={0.5}
      color={colors.white}
      createTimeline={gsapPresetTypewriter(0.04, 0.1)}
    />
    <SplitText3DGsap
      text="Pushing boundaries forward"
      fontUrl={FONTS.regular}
      position={[0, 1.9, 0]}
      fontSize={0.22}
      color={colors.gold}
      createTimeline={gsapPresetFadeUp(0.03, 0.5)}
    />

    <ColorBar3D
      position={[0, 1.0, 0]}
      width={1.0}
      height={0.03}
      color={colors.gold}
      startFrame={35}
      fps={fps}
    />
    <SplitText3DGsap
      text="Strategy"
      fontUrl={FONTS.bold}
      position={[0, 0.4, 0]}
      fontSize={0.5}
      color={colors.white}
      createTimeline={gsapPresetTypewriter(0.04, 0.1)}
    />
    <SplitText3DGsap
      text="Data-driven decisions"
      fontUrl={FONTS.regular}
      position={[0, -0.2, 0]}
      fontSize={0.22}
      color={colors.gold}
      createTimeline={gsapPresetFadeUp(0.03, 0.5)}
    />

    <ColorBar3D
      position={[0, -1.1, 0]}
      width={0.9}
      height={0.03}
      color={colors.gold}
      startFrame={60}
      fps={fps}
    />
    <SplitText3DGsap
      text="Growth"
      fontUrl={FONTS.bold}
      position={[0, -1.7, 0]}
      fontSize={0.5}
      color={colors.white}
      createTimeline={gsapPresetTypewriter(0.04, 0.1)}
    />
    <SplitText3DGsap
      text="Scaling with purpose"
      fontUrl={FONTS.regular}
      position={[0, -2.3, 0]}
      fontSize={0.22}
      color={colors.gold}
      createTimeline={gsapPresetFadeUp(0.03, 0.5)}
    />
  </>
);

const Scene4Content: React.FC<{ fps: number }> = ({ fps }) => (
  <>
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 15]} />
      <meshBasicMaterial color={colors.cream} />
    </mesh>
    <RichText3DGsap
      segments={[
        { text: "Our ", fontUrl: FONTS.bold, color: colors.darkText },
        { text: "Team", fontUrl: FONTS.bold, color: colors.gold },
      ]}
      position={[0, 4.5, 0]}
      fontSize={0.55}
      createTimeline={richTextPresetTypewriter}
    />
    <TeamCards3D fps={fps} />
  </>
);

const Scene5Content: React.FC<{ fps: number }> = ({ fps }) => (
  <>
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 15]} />
      <meshBasicMaterial color={colors.black} />
    </mesh>
    <RichText3DGsap
      segments={[
        { text: "GET ", fontUrl: FONTS.bold, color: colors.white },
        { text: "STARTED", fontUrl: FONTS.bold, color: colors.gold },
      ]}
      position={[0, 1, 0]}
      fontSize={0.9}
      createTimeline={richTextPresetTypewriter}
    />
    <ColorBar3D
      position={[0, -0.3, 0]}
      width={1.8}
      height={0.04}
      color={colors.gold}
      startFrame={25}
      fps={fps}
    />
    <SplitText3DGsap
      text="www.yourcompany.com"
      fontUrl={FONTS.regular}
      position={[0, -1.2, 0]}
      fontSize={0.28}
      color={colors.goldLight}
      createTimeline={gsapPresetFadeUp(0.03, 0.6)}
    />
  </>
);

// Helper Components
const ColorBar3D: React.FC<{
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
  startFrame: number;
  fps: number;
}> = ({ position, width, height, color, startFrame, fps }) => {
  // Note: This component now relies on Remotion's useCurrentFrame via the parent
  // For frame-based animations, we use spring with frame 0 as base
  const progress = spring({
    fps,
    frame: Math.max(0, -startFrame), // Will be overridden by context
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <mesh
      position={position}
      scale={[Math.max(0, Math.min(1, progress)), 1, 1]}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const TeamCards3D: React.FC<{ fps: number }> = ({ fps }) => {
  const teamMembers = [
    { name: "A", role: "CEO", color: "#F59E0B", x: -4, y: 1.5 },
    { name: "S", role: "Design", color: "#10B981", x: 0, y: 1.5 },
    { name: "M", role: "Engineering", color: "#3B82F6", x: 4, y: 1.5 },
    { name: "E", role: "Marketing", color: "#EC4899", x: -4, y: -2 },
    { name: "J", role: "Product", color: "#8B5CF6", x: 0, y: -2 },
    { name: "L", role: "Operations", color: "#F97316", x: 4, y: -2 },
  ];

  return (
    <>
      {teamMembers.map((member, index) => {
        const delay = index * 5 + 20;
        const entrance = spring({
          fps,
          frame: Math.max(0, -delay),
          config: { damping: 80, stiffness: 100, mass: 0.8 },
        });

        const scale = Math.max(0, entrance);
        const y = member.y + (1 - scale) * 2;

        return (
          <group
            key={member.name + index}
            position={[member.x, y, 0]}
            scale={scale}
          >
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[2.2, 2.8]} />
              <meshBasicMaterial color={colors.white} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <circleGeometry args={[0.5, 32]} />
              <meshBasicMaterial color={member.color} />
            </mesh>
            <SplitText3DGsap
              text={member.name}
              fontUrl={FONTS.bold}
              position={[0, 0.5, 0.1]}
              fontSize={0.4}
              color={colors.white}
              createTimeline={gsapPresetFadeUp(0.05, 0.3)}
            />
            <SplitText3DGsap
              text={member.role}
              fontUrl={FONTS.regular}
              position={[0, -0.5, 0.1]}
              fontSize={0.18}
              color={colors.darkText}
              createTimeline={gsapPresetFadeUp(0.03, 0.4)}
            />
          </group>
        );
      })}
    </>
  );
};

const ImageWithBorder: React.FC<{
  url: string;
  position?: [number, number, number];
  width: number;
  height: number;
  radius?: number;
  strokeWidth?: number;
  strokeColor?: string;
  strokeDelay?: number;
  strokeDuration?: number;
}> = ({
  url,
  position = [0, 0, 0],
  width,
  height,
  radius = 0.1,
  strokeWidth = 0.03,
  strokeColor = "#FFFFFF",
  strokeDelay = 0,
  strokeDuration = 30,
}) => {
    const frame = useCurrentFrame();

    // Animate stroke drawing
    const strokeProgress = interpolate(
      frame,
      [strokeDelay, strokeDelay + strokeDuration],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Content fades in after stroke completes
    const contentOpacity = interpolate(
      frame,
      [strokeDelay + strokeDuration * 0.5, strokeDelay + strokeDuration * 0.8],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const fullPath = useMemo(() => {
      const points: THREE.Vector3[] = [];
      const hw = width / 2;
      const hh = height / 2;
      const r = Math.min(radius, hw, hh);
      const segments = 8;

      points.push(new THREE.Vector3(-hw + r, hh, 0));
      points.push(new THREE.Vector3(hw - r, hh, 0));

      for (let i = 0; i <= segments; i++) {
        const angle = Math.PI / 2 - (i / segments) * (Math.PI / 2);
        points.push(
          new THREE.Vector3(
            hw - r + Math.cos(angle) * r,
            hh - r + Math.sin(angle) * r,
            0,
          ),
        );
      }

      points.push(new THREE.Vector3(hw, -hh + r, 0));

      for (let i = 0; i <= segments; i++) {
        const angle = 0 - (i / segments) * (Math.PI / 2);
        points.push(
          new THREE.Vector3(
            hw - r + Math.cos(angle) * r,
            -hh + r + Math.sin(angle) * r,
            0,
          ),
        );
      }

      points.push(new THREE.Vector3(-hw + r, -hh, 0));

      for (let i = 0; i <= segments; i++) {
        const angle = -Math.PI / 2 - (i / segments) * (Math.PI / 2);
        points.push(
          new THREE.Vector3(
            -hw + r + Math.cos(angle) * r,
            -hh + r + Math.sin(angle) * r,
            0,
          ),
        );
      }

      points.push(new THREE.Vector3(-hw, hh - r, 0));

      for (let i = 0; i <= segments; i++) {
        const angle = Math.PI - (i / segments) * (Math.PI / 2);
        points.push(
          new THREE.Vector3(
            -hw + r + Math.cos(angle) * r,
            hh - r + Math.sin(angle) * r,
            0,
          ),
        );
      }

      points.push(new THREE.Vector3(-hw + r, hh, 0));
      return points;
    }, [width, height, radius]);

    const visiblePath = useMemo(() => {
      if (strokeProgress <= 0) return [];
      const numPoints = Math.ceil(fullPath.length * strokeProgress);
      return fullPath.slice(0, Math.max(2, numPoints));
    }, [fullPath, strokeProgress]);

    return (
      <group position={position}>
        {visiblePath.length >= 2 && (
          <Line
            points={visiblePath}
            color={strokeColor}
            lineWidth={strokeWidth * 150}
            position={[0, 0, 0.05]}
          />
        )}
        {contentOpacity > 0 && (
          <Image
            url={url}
            scale={[width - strokeWidth * 2, height - strokeWidth * 2]}
            radius={Math.max(0, radius - strokeWidth)}
            transparent
            opacity={contentOpacity}
          />
        )}
      </group>
    );
  };
