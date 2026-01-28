import type { CSSProperties, ReactNode } from "react";

export interface AsymmetricLayoutProps {
  media: ReactNode;
  content: ReactNode;
  layout: "media-left" | "media-right";
  mediaWidth?: string;
  contentWidth?: string;
  gap?: number;
  verticalAlign?: "top" | "center" | "bottom";
  padding?: number | string;
  className?: string;
  style?: CSSProperties;
}

export const AsymmetricLayout = ({
  media,
  content,
  layout,
  mediaWidth = "45%",
  contentWidth = "50%",
  gap = 40,
  verticalAlign = "center",
  padding = 60,
  className,
  style,
}: AsymmetricLayoutProps) => {
  const alignItems = getAlignItems(verticalAlign);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: layout === "media-left" ? "row" : "row-reverse",
    alignItems,
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    padding,
    boxSizing: "border-box",
    gap,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={{ width: mediaWidth, flexShrink: 0 }}>{media}</div>
      <div style={{ width: contentWidth }}>{content}</div>
    </div>
  );
};

function getAlignItems(
  verticalAlign: "top" | "center" | "bottom"
): CSSProperties["alignItems"] {
  switch (verticalAlign) {
    case "top":
      return "flex-start";
    case "bottom":
      return "flex-end";
    case "center":
    default:
      return "center";
  }
}
