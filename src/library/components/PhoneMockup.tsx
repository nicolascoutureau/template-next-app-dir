import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from "react";

/**
 * Phone device presets.
 */
export type PhoneDevice =
  | "iphone-14"
  | "iphone-14-pro"
  | "iphone-15-pro"
  | "pixel"
  | "generic"
  | "custom";

/**
 * Phone color presets.
 */
export type PhoneColor =
  | "black"
  | "white"
  | "silver"
  | "gold"
  | "blue"
  | "purple"
  | "custom";

/**
 * Slot render props.
 */
export type PhoneSlotProps = {
  device: PhoneDevice;
};

/**
 * Device specifications.
 */
export type DeviceSpecs = {
  width: number;
  height: number;
  borderRadius: number;
  bezel: number;
  notchWidth?: number;
  notchHeight?: number;
  notchRadius?: number;
  dynamicIsland?: boolean;
};

/**
 * Props for `PhoneMockup`.
 */
export type PhoneMockupProps = {
  /** Content to display inside the phone screen. */
  children: ReactNode;
  /** Phone device preset or "custom" for manual specs. */
  device?: PhoneDevice;
  /** Phone frame color preset or "custom". */
  color?: PhoneColor;
  /** Scale of the phone (1 = 100%). */
  scale?: number;
  /** Rotation angle in degrees for 3D perspective (Y axis). */
  rotateY?: number;
  /** Rotation angle in degrees for tilt (X axis). */
  rotateX?: number;
  /** Z rotation. */
  rotateZ?: number;
  /** Whether to show the notch/dynamic island. */
  showNotch?: boolean;
  /** Shadow intensity (0-3). */
  shadowIntensity?: 0 | 1 | 2 | 3;
  /** 3D perspective distance. */
  perspective?: number;

  // Custom device specs (when device="custom")
  /** Custom device width. */
  deviceWidth?: number;
  /** Custom device height. */
  deviceHeight?: number;
  /** Custom border radius. */
  deviceBorderRadius?: number;
  /** Custom bezel thickness. */
  deviceBezel?: number;

  // Custom colors (when color="custom")
  /** Frame background color/gradient. */
  frameColor?: string;
  /** Frame accent color. */
  accentColor?: string;
  /** Screen border color. */
  screenBorderColor?: string;

  // Slot overrides
  /** Custom notch renderer. */
  renderNotch?: (props: PhoneSlotProps) => ReactNode;
  /** Custom frame renderer (wraps screen). */
  renderFrame?: (props: PhoneSlotProps & { screen: ReactNode }) => ReactNode;
  /** Custom status bar renderer. */
  renderStatusBar?: (props: PhoneSlotProps) => ReactNode;

  /** Additional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export type PhoneMockupRef = ComponentPropsWithRef<"div">["ref"];

const devicePresets: Record<Exclude<PhoneDevice, "custom">, DeviceSpecs> = {
  "iphone-14": {
    width: 280,
    height: 572,
    borderRadius: 44,
    bezel: 12,
    notchWidth: 120,
    notchHeight: 24,
    notchRadius: 12,
  },
  "iphone-14-pro": {
    width: 280,
    height: 572,
    borderRadius: 50,
    bezel: 10,
    dynamicIsland: true,
    notchWidth: 90,
    notchHeight: 28,
    notchRadius: 14,
  },
  "iphone-15-pro": {
    width: 280,
    height: 580,
    borderRadius: 52,
    bezel: 8,
    dynamicIsland: true,
    notchWidth: 95,
    notchHeight: 30,
    notchRadius: 15,
  },
  pixel: { width: 276, height: 580, borderRadius: 36, bezel: 10 },
  generic: { width: 280, height: 560, borderRadius: 32, bezel: 14 },
};

const colorPresets: Record<
  Exclude<PhoneColor, "custom">,
  { frame: string; accent: string }
> = {
  black: { frame: "#1a1a1a", accent: "#333333" },
  white: { frame: "#f5f5f5", accent: "#e0e0e0" },
  silver: { frame: "#c0c0c0", accent: "#a0a0a0" },
  gold: { frame: "#d4a574", accent: "#c49a6c" },
  blue: { frame: "#1e3a5f", accent: "#2d5a87" },
  purple: { frame: "#4a1a6b", accent: "#6b2d91" },
};

const shadows: Record<0 | 1 | 2 | 3, string> = {
  0: "none",
  1: "0 10px 30px rgba(0, 0, 0, 0.15)",
  2: "0 20px 50px rgba(0, 0, 0, 0.25), 0 5px 15px rgba(0, 0, 0, 0.1)",
  3: "0 35px 80px rgba(0, 0, 0, 0.35), 0 15px 35px rgba(0, 0, 0, 0.2)",
};

/**
 * `PhoneMockup` renders content inside a customizable smartphone frame.
 * Supports multiple device presets, 3D transforms, and slot-based customization.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PhoneMockup device="iphone-15-pro">
 *   <AppScreenshot />
 * </PhoneMockup>
 *
 * // With 3D rotation
 * <PhoneMockup rotateY={-15} rotateX={5}>
 *   <Content />
 * </PhoneMockup>
 *
 * // Custom device
 * <PhoneMockup
 *   device="custom"
 *   deviceWidth={300}
 *   deviceHeight={600}
 *   deviceBorderRadius={40}
 *   color="custom"
 *   frameColor="linear-gradient(145deg, #667eea 0%, #764ba2 100%)"
 * >
 *   <Content />
 * </PhoneMockup>
 *
 * // Custom status bar
 * <PhoneMockup
 *   renderStatusBar={() => (
 *     <div className="status-bar">
 *       <span>9:41</span>
 *       <span>5G</span>
 *     </div>
 *   )}
 * >
 *   <Content />
 * </PhoneMockup>
 * ```
 */
export const PhoneMockup = forwardRef<HTMLDivElement, PhoneMockupProps>(
  (
    {
      children,
      device = "iphone-14-pro",
      color = "black",
      scale = 1,
      rotateY = 0,
      rotateX = 0,
      rotateZ = 0,
      showNotch = true,
      shadowIntensity = 2,
      perspective = 1200,
      deviceWidth,
      deviceHeight,
      deviceBorderRadius,
      deviceBezel,
      frameColor,
      accentColor,
      screenBorderColor,
      renderNotch,
      renderFrame,
      renderStatusBar,
      className,
      style,
      ...restProps
    },
    ref,
  ) => {
    // Resolve device specs
    const specs: DeviceSpecs =
      device !== "custom"
        ? devicePresets[device]
        : {
            width: deviceWidth ?? 280,
            height: deviceHeight ?? 560,
            borderRadius: deviceBorderRadius ?? 40,
            bezel: deviceBezel ?? 12,
          };

    // Resolve colors
    const colors =
      color !== "custom"
        ? colorPresets[color]
        : { frame: frameColor ?? "#1a1a1a", accent: accentColor ?? "#333333" };

    const slotProps: PhoneSlotProps = { device };

    const transform = `perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;

    const wrapperStyle: CSSProperties = {
      width: specs.width,
      height: specs.height,
      transform,
      transformStyle: "preserve-3d",
      // CSS variables
      "--phone-width": `${specs.width}px`,
      "--phone-height": `${specs.height}px`,
      "--phone-radius": `${specs.borderRadius}px`,
      "--phone-bezel": `${specs.bezel}px`,
      "--phone-frame": colors.frame,
      "--phone-accent": colors.accent,
      ...style,
    } as CSSProperties;

    const frameStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      background:
        frameColor ??
        `linear-gradient(145deg, ${colors.frame} 0%, ${colors.accent} 100%)`,
      borderRadius: specs.borderRadius,
      padding: specs.bezel,
      boxShadow: shadows[shadowIntensity],
      position: "relative",
    };

    const screenStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      background: "#000",
      borderRadius: specs.borderRadius - specs.bezel + 2,
      overflow: "hidden",
      position: "relative",
      border: screenBorderColor ? `1px solid ${screenBorderColor}` : undefined,
    };

    const DefaultNotch = () => {
      if (!specs.notchWidth) return null;

      return (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: specs.notchWidth,
            height: specs.notchHeight,
            background: "#000",
            borderRadius: specs.notchRadius ?? 12,
            zIndex: 10,
          }}
        />
      );
    };

    const screen = (
      <div style={screenStyle}>
        {showNotch &&
          (specs.dynamicIsland || specs.notchWidth) &&
          (renderNotch ? renderNotch(slotProps) : <DefaultNotch />)}
        {renderStatusBar && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5,
            }}
          >
            {renderStatusBar(slotProps)}
          </div>
        )}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {children}
        </div>
      </div>
    );

    return (
      <div ref={ref} className={className} style={wrapperStyle} {...restProps}>
        {renderFrame ? (
          renderFrame({ ...slotProps, screen })
        ) : (
          <div style={frameStyle}>{screen}</div>
        )}
      </div>
    );
  },
);

PhoneMockup.displayName = "PhoneMockup";
