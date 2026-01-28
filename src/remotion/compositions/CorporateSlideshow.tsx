import { useMemo } from "react";
import { useVideoConfig, useCurrentFrame, spring, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Image, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  SplitText3DGsap,
  gsapPresetTypewriter,
  gsapPresetFadeUp,
  RichText3DGsap,
  richTextPresetTypewriter,
} from "../../library/text";
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

const SCENE_TIMING = {
  scene1: { start: 0, end: 100 },
  scene2: { start: 100, end: 220 },
  scene3: { start: 220, end: 340 },
  scene4: { start: 340, end: 460 },
  scene5: { start: 460, end: 540 },
};

export const CorporateSlideshow: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const aspect = width / height;

  const isScene1 = frame >= SCENE_TIMING.scene1.start && frame < SCENE_TIMING.scene1.end;
  const isScene2 = frame >= SCENE_TIMING.scene2.start && frame < SCENE_TIMING.scene2.end;
  const isScene3 = frame >= SCENE_TIMING.scene3.start && frame < SCENE_TIMING.scene3.end;
  const isScene4 = frame >= SCENE_TIMING.scene4.start && frame < SCENE_TIMING.scene4.end;
  const isScene5 = frame >= SCENE_TIMING.scene5.start && frame < SCENE_TIMING.scene5.end;

  const scene1LocalFrame = frame - SCENE_TIMING.scene1.start;
  const scene2LocalFrame = frame - SCENE_TIMING.scene2.start;
  const scene3LocalFrame = frame - SCENE_TIMING.scene3.start;
  const scene4LocalFrame = frame - SCENE_TIMING.scene4.start;
  const scene5LocalFrame = frame - SCENE_TIMING.scene5.start;

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
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Background planes */}
      {(isScene1 || isScene3 || isScene5) && (
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20 * aspect, 20]} />
          <meshBasicMaterial color={colors.black} />
        </mesh>
      )}
      {(isScene2 || isScene4) && (
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20 * aspect, 20]} />
          <meshBasicMaterial color={colors.cream} />
        </mesh>
      )}

      {/* Scene 1: Title */}
      {isScene1 && (
        <>
          <ColorBar3D
            position={[0, 0.8, 0]}
            width={3.5}
            height={0.04}
            color={colors.gold}
            localFrame={scene1LocalFrame}
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
      )}

      {/* Scene 2: Mission */}
      {isScene2 && (
        <>
          <ImageWithBorder
            url="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
            position={[-3, 0, 0]}
            width={4.5}
            height={3}
            localFrame={scene2LocalFrame}
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
            localFrame={scene2LocalFrame}
            startFrame={25}
            fps={fps}
          />
          <RichText3DGsap
            segments={[
              { text: "Ideas ", fontUrl: FONTS.bold, color: colors.gold },
              { text: "that become ", fontUrl: FONTS.semibold, color: colors.darkText },
              { text: "strategy.", fontUrl: FONTS.bold, color: colors.gold },
            ]}
            position={[2.5, 0, 0]}
            fontSize={0.4}
            createTimeline={richTextPresetTypewriter}
          />
        </>
      )}

      {/* Scene 3: Features */}
      {isScene3 && (
        <>
          <ColorBar3D position={[0, 3.1, 0]} width={1.2} height={0.03} color={colors.gold} localFrame={scene3LocalFrame} startFrame={10} fps={fps} />
          <SplitText3DGsap text="Innovation" fontUrl={FONTS.bold} position={[0, 2.5, 0]} fontSize={0.5} color={colors.white} createTimeline={gsapPresetTypewriter(0.04, 0.1)} />
          <SplitText3DGsap text="Pushing boundaries forward" fontUrl={FONTS.regular} position={[0, 1.9, 0]} fontSize={0.22} color={colors.gold} createTimeline={gsapPresetFadeUp(0.03, 0.5)} />

          <ColorBar3D position={[0, 1.0, 0]} width={1.0} height={0.03} color={colors.gold} localFrame={scene3LocalFrame} startFrame={35} fps={fps} />
          <SplitText3DGsap text="Strategy" fontUrl={FONTS.bold} position={[0, 0.4, 0]} fontSize={0.5} color={colors.white} createTimeline={gsapPresetTypewriter(0.04, 0.1)} />
          <SplitText3DGsap text="Data-driven decisions" fontUrl={FONTS.regular} position={[0, -0.2, 0]} fontSize={0.22} color={colors.gold} createTimeline={gsapPresetFadeUp(0.03, 0.5)} />

          <ColorBar3D position={[0, -1.1, 0]} width={0.9} height={0.03} color={colors.gold} localFrame={scene3LocalFrame} startFrame={60} fps={fps} />
          <SplitText3DGsap text="Growth" fontUrl={FONTS.bold} position={[0, -1.7, 0]} fontSize={0.5} color={colors.white} createTimeline={gsapPresetTypewriter(0.04, 0.1)} />
          <SplitText3DGsap text="Scaling with purpose" fontUrl={FONTS.regular} position={[0, -2.3, 0]} fontSize={0.22} color={colors.gold} createTimeline={gsapPresetFadeUp(0.03, 0.5)} />
        </>
      )}

      {/* Scene 4: Team */}
      {isScene4 && (
        <>
          <RichText3DGsap
            segments={[
              { text: "Our ", fontUrl: FONTS.bold, color: colors.darkText },
              { text: "Team", fontUrl: FONTS.bold, color: colors.gold },
            ]}
            position={[0, 4.5, 0]}
            fontSize={0.55}
            createTimeline={richTextPresetTypewriter}
          />
          <TeamCards3D localFrame={scene4LocalFrame} fps={fps} />
        </>
      )}

      {/* Scene 5: CTA */}
      {isScene5 && (
        <>
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
            localFrame={scene5LocalFrame}
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
      )}
    </ThreeCanvas>
  );
};

const ColorBar3D: React.FC<{
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
  localFrame: number;
  startFrame: number;
  fps: number;
}> = ({ position, width, height, color, localFrame, startFrame, fps }) => {
  const progress = spring({
    fps,
    frame: localFrame - startFrame,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const scaleX = Math.max(0, Math.min(1, progress));

  if (localFrame < startFrame) return null;

  return (
    <mesh position={position} scale={[scaleX, 1, 1]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const TeamCards3D: React.FC<{ localFrame: number; fps: number }> = ({ localFrame, fps }) => {
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
          frame: localFrame - delay,
          config: { damping: 80, stiffness: 100, mass: 0.8 },
        });

        const scale = Math.max(0, entrance);
        const y = member.y + (1 - scale) * 2;

        return (
          <group key={member.name + index} position={[member.x, y, 0]} scale={scale}>
            {/* Card background */}
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[2.2, 2.8]} />
              <meshBasicMaterial color={colors.white} />
            </mesh>
            {/* Avatar circle */}
            <mesh position={[0, 0.5, 0]}>
              <circleGeometry args={[0.5, 32]} />
              <meshBasicMaterial color={member.color} />
            </mesh>
            {/* Initial letter */}
            <SplitText3DGsap
              text={member.name}
              fontUrl={FONTS.bold}
              position={[0, 0.5, 0.1]}
              fontSize={0.4}
              color={colors.white}
              createTimeline={gsapPresetFadeUp(0.05, 0.3)}
            />
            {/* Role */}
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
  localFrame: number;
  radius?: number;
  strokeWidth?: number;
  strokeColor?: string;
  strokeDelay?: number;
  strokeDuration?: number;
  contentDelay?: number;
  contentFadeDuration?: number;
}> = ({
  url,
  position = [0, 0, 0],
  width,
  height,
  localFrame,
  radius = 0.1,
  strokeWidth = 0.03,
  strokeColor = "#FFFFFF",
  strokeDelay = 0,
  strokeDuration = 30,
  contentDelay,
  contentFadeDuration = 15,
}) => {
  const frame = localFrame;

  const effectiveContentDelay = contentDelay ?? strokeDelay + strokeDuration;

  const strokeProgress = interpolate(
    frame - strokeDelay,
    [0, strokeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const contentOpacity = interpolate(
    frame - effectiveContentDelay,
    [0, contentFadeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
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
      points.push(new THREE.Vector3(hw - r + Math.cos(angle) * r, hh - r + Math.sin(angle) * r, 0));
    }

    points.push(new THREE.Vector3(hw, -hh + r, 0));

    for (let i = 0; i <= segments; i++) {
      const angle = 0 - (i / segments) * (Math.PI / 2);
      points.push(new THREE.Vector3(hw - r + Math.cos(angle) * r, -hh + r + Math.sin(angle) * r, 0));
    }

    points.push(new THREE.Vector3(-hw + r, -hh, 0));

    for (let i = 0; i <= segments; i++) {
      const angle = -Math.PI / 2 - (i / segments) * (Math.PI / 2);
      points.push(new THREE.Vector3(-hw + r + Math.cos(angle) * r, -hh + r + Math.sin(angle) * r, 0));
    }

    points.push(new THREE.Vector3(-hw, hh - r, 0));

    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI - (i / segments) * (Math.PI / 2);
      points.push(new THREE.Vector3(-hw + r + Math.cos(angle) * r, hh - r + Math.sin(angle) * r, 0));
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
        <Line points={visiblePath} color={strokeColor} lineWidth={strokeWidth * 150} position={[0, 0, 0.05]} />
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
