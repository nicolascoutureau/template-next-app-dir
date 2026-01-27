import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from "react";

/**
 * Browser theme variants.
 */
export type BrowserTheme = "dark" | "light" | "macos-dark" | "macos-light" | "custom";

/**
 * Slot render props for custom parts.
 */
export type BrowserSlotProps = {
  theme: BrowserTheme;
};

/**
 * Props for `BrowserMockup`.
 */
export type BrowserMockupProps = {
  /** Content to display inside the browser window. */
  children: ReactNode;
  /** Browser theme style. */
  theme?: BrowserTheme;
  /** URL to display in the address bar. */
  url?: string;
  /** Browser window width. */
  width?: number | string;
  /** Browser window height. */
  height?: number | string;
  /** Whether to show the address bar. */
  showAddressBar?: boolean;
  /** Whether to show window controls. */
  showControls?: boolean;
  /** Shadow intensity (0-3). */
  shadowIntensity?: 0 | 1 | 2 | 3;
  /** Border radius of the window. */
  borderRadius?: number;

  // Custom theme colors
  /** Chrome/toolbar background color. */
  chromeColor?: string;
  /** Address bar background color. */
  addressBarColor?: string;
  /** Text color in address bar. */
  textColor?: string;
  /** Border color. */
  borderColor?: string;
  /** Close button color. */
  closeColor?: string;
  /** Minimize button color. */
  minimizeColor?: string;
  /** Maximize button color. */
  maximizeColor?: string;
  /** Content background color. */
  contentBackground?: string;

  // Slot overrides
  /** Custom controls renderer. */
  renderControls?: (props: BrowserSlotProps) => ReactNode;
  /** Custom address bar renderer. */
  renderAddressBar?: (props: BrowserSlotProps & { url: string }) => ReactNode;
  /** Custom header/chrome renderer (replaces entire header). */
  renderHeader?: (props: BrowserSlotProps) => ReactNode;

  /** Additional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export type BrowserMockupRef = ComponentPropsWithRef<"div">["ref"];

const defaultThemes: Record<
  Exclude<BrowserTheme, "custom">,
  {
    chrome: string;
    addressBar: string;
    text: string;
    border: string;
    controls: { close: string; minimize: string; maximize: string };
  }
> = {
  dark: {
    chrome: "#1e1e1e",
    addressBar: "#2d2d2d",
    text: "#9ca3af",
    border: "#333333",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  light: {
    chrome: "#f5f5f5",
    addressBar: "#ffffff",
    text: "#6b7280",
    border: "#e5e5e5",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  "macos-dark": {
    chrome: "#28292b",
    addressBar: "#1c1c1e",
    text: "#86868b",
    border: "#3d3d3f",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  "macos-light": {
    chrome: "#f6f6f6",
    addressBar: "#ffffff",
    text: "#86868b",
    border: "#d1d1d6",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
};

const shadows: Record<0 | 1 | 2 | 3, string> = {
  0: "none",
  1: "0 4px 20px rgba(0, 0, 0, 0.1)",
  2: "0 8px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)",
  3: "0 25px 80px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)",
};

/**
 * `BrowserMockup` renders content inside a customizable browser window frame.
 * Supports theming and slot-based customization.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BrowserMockup url="https://example.com">
 *   <Screenshot />
 * </BrowserMockup>
 *
 * // Custom theme
 * <BrowserMockup
 *   theme="custom"
 *   chromeColor="#1a1a2e"
 *   addressBarColor="#16213e"
 *   borderColor="#0f3460"
 * >
 *   <Content />
 * </BrowserMockup>
 *
 * // Custom address bar
 * <BrowserMockup
 *   renderAddressBar={({ url }) => (
 *     <div className="custom-address-bar">
 *       <SearchIcon /> {url}
 *     </div>
 *   )}
 * >
 *   <Content />
 * </BrowserMockup>
 * ```
 */
export const BrowserMockup = forwardRef<HTMLDivElement, BrowserMockupProps>(
  (
    {
      children,
      theme = "dark",
      url = "https://example.com",
      width = 1000,
      height = 640,
      showAddressBar = true,
      showControls = true,
      shadowIntensity = 2,
      borderRadius = 12,
      chromeColor,
      addressBarColor,
      textColor,
      borderColor,
      closeColor,
      minimizeColor,
      maximizeColor,
      contentBackground = "#000",
      renderControls,
      renderAddressBar,
      renderHeader,
      className,
      style,
      ...restProps
    },
    ref,
  ) => {
    const themeColors =
      theme !== "custom"
        ? defaultThemes[theme]
        : {
            chrome: chromeColor ?? "#1e1e1e",
            addressBar: addressBarColor ?? "#2d2d2d",
            text: textColor ?? "#9ca3af",
            border: borderColor ?? "#333333",
            controls: {
              close: closeColor ?? "#ff5f57",
              minimize: minimizeColor ?? "#febc2e",
              maximize: maximizeColor ?? "#28c840",
            },
          };

    // Apply custom overrides to theme
    const colors = {
      chrome: chromeColor ?? themeColors.chrome,
      addressBar: addressBarColor ?? themeColors.addressBar,
      text: textColor ?? themeColors.text,
      border: borderColor ?? themeColors.border,
      controls: {
        close: closeColor ?? themeColors.controls.close,
        minimize: minimizeColor ?? themeColors.controls.minimize,
        maximize: maximizeColor ?? themeColors.controls.maximize,
      },
    };

    const chromeHeight = showAddressBar ? 52 : 36;

    const slotProps: BrowserSlotProps = { theme };

    const wrapperStyle: CSSProperties = {
      width,
      height,
      borderRadius,
      overflow: "hidden",
      boxShadow: shadows[shadowIntensity],
      border: `1px solid ${colors.border}`,
      // CSS variables for external styling
      "--browser-chrome": colors.chrome,
      "--browser-address-bar": colors.addressBar,
      "--browser-text": colors.text,
      "--browser-border": colors.border,
      ...style,
    } as CSSProperties;

    const DefaultControls = () => (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors.controls.close,
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors.controls.minimize,
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors.controls.maximize,
          }}
        />
      </div>
    );

    const DefaultAddressBar = () => (
      <div
        style={{
          flex: 1,
          height: 28,
          background: colors.addressBar,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          fontSize: 13,
          color: colors.text,
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ marginRight: 8, opacity: 0.6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4z" />
          </svg>
        </span>
        {url}
      </div>
    );

    const DefaultHeader = () => (
      <div
        style={{
          height: chromeHeight,
          background: colors.chrome,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 12,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {showControls &&
          (renderControls ? renderControls(slotProps) : <DefaultControls />)}
        {showAddressBar &&
          (renderAddressBar ? (
            renderAddressBar({ ...slotProps, url })
          ) : (
            <DefaultAddressBar />
          ))}
      </div>
    );

    return (
      <div ref={ref} className={className} style={wrapperStyle} {...restProps}>
        {renderHeader ? renderHeader(slotProps) : <DefaultHeader />}
        <div
          style={{
            height:
              typeof height === "number"
                ? height - chromeHeight
                : `calc(100% - ${chromeHeight}px)`,
            overflow: "hidden",
            background: contentBackground,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

BrowserMockup.displayName = "BrowserMockup";
