import type { ReactNode } from "react";

export interface AsymmetricLayoutProps {
  /** Media content (3D element) */
  media: ReactNode;
  /** Text/other content (3D element) */
  content: ReactNode;
  /** Layout direction */
  layout: "media-left" | "media-right";
  /** Total width of the layout */
  width?: number;
  /** Total height of the layout */
  height?: number;
  /** Gap between media and content */
  gap?: number;
  /** Media section width ratio (0-1) */
  mediaRatio?: number;
  /** Vertical alignment: "top", "center", "bottom" */
  verticalAlign?: "top" | "center" | "bottom";
  /** Z position for the layout group */
  zPosition?: number;
}

/**
 * `AsymmetricLayout` creates a two-column 3D layout with media and content.
 * Use inside a ThreeCanvas.
 *
 * @example
 * ```tsx
 * <ThreeCanvas width={1920} height={1080} camera={{ position: [0, 0, 6], fov: 50 }}>
 *   <AsymmetricLayout
 *     layout="media-left"
 *     width={10}
 *     height={6}
 *     mediaRatio={0.45}
 *     media={<Image3D url="/product.jpg" scale={[4, 3]} />}
 *     content={
 *       <group>
 *         <SplitText3DGsap text="Product Title" />
 *       </group>
 *     }
 *   />
 * </ThreeCanvas>
 * ```
 */
export const AsymmetricLayout = ({
  media,
  content,
  layout,
  width = 10,
  height = 6,
  gap = 0.5,
  mediaRatio = 0.45,
  verticalAlign = "center",
  zPosition = 0,
}: AsymmetricLayoutProps) => {
  const contentRatio = 1 - mediaRatio;
  
  // Calculate section widths
  const mediaWidth = width * mediaRatio - gap / 2;
  const contentWidth = width * contentRatio - gap / 2;
  
  // Calculate horizontal positions
  const mediaX = layout === "media-left" 
    ? -width / 2 + mediaWidth / 2 
    : width / 2 - mediaWidth / 2;
  const contentX = layout === "media-left"
    ? width / 2 - contentWidth / 2
    : -width / 2 + contentWidth / 2;

  // Calculate vertical offset based on alignment
  const getVerticalOffset = () => {
    switch (verticalAlign) {
      case "top":
        return height / 4;
      case "bottom":
        return -height / 4;
      case "center":
      default:
        return 0;
    }
  };

  const yOffset = getVerticalOffset();

  return (
    <group position={[0, 0, zPosition]}>
      {/* Media section */}
      <group position={[mediaX, yOffset, 0]}>
        {media}
      </group>

      {/* Content section */}
      <group position={[contentX, yOffset, 0]}>
        {content}
      </group>
    </group>
  );
};
