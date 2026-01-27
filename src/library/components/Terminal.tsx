import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/**
 * Terminal theme variants.
 */
export type TerminalTheme =
  | "dark"
  | "light"
  | "macos"
  | "ubuntu"
  | "windows"
  | "custom";

/**
 * A single line in the terminal.
 */
export type TerminalLine = {
  /** The text content of the line. */
  text: string;
  /** Whether this line has a prompt prefix. */
  isCommand?: boolean;
  /** Custom prompt for this line (overrides default). */
  prompt?: string;
  /** Text color for this line. */
  color?: string;
  /** Delay in frames before this line appears. */
  delay?: number;
};

/**
 * Slot render props for custom parts.
 */
export type TerminalSlotProps = {
  theme: TerminalTheme;
};

/**
 * Props for `Terminal`.
 */
export type TerminalProps = {
  /** Lines to display in the terminal. */
  lines?: TerminalLine[];
  /** Alternative: raw children content. */
  children?: ReactNode;
  /** Terminal theme style. */
  theme?: TerminalTheme;
  /** Title shown in the terminal header. */
  title?: string;
  /** Default prompt string (e.g., "$ " or "→ "). */
  prompt?: string;
  /** Terminal width. */
  width?: number | string;
  /** Terminal height. */
  height?: number | string;
  /** Whether to show window controls. */
  showControls?: boolean;
  /** Whether to show the title bar. */
  showTitleBar?: boolean;
  /** Shadow intensity (0-3). */
  shadowIntensity?: 0 | 1 | 2 | 3;
  /** Border radius of the window. */
  borderRadius?: number;
  /** Whether to animate lines appearing sequentially. */
  animate?: boolean;
  /** Frames between each line appearing (when animate=true). */
  lineDelay?: number;
  /** Whether to show a blinking cursor. */
  showCursor?: boolean;
  /** Cursor blink speed in frames. */
  cursorBlinkSpeed?: number;
  /** Font size for terminal text. */
  fontSize?: number;
  /** Line height multiplier. */
  lineHeight?: number;
  /** Font family for terminal text. */
  fontFamily?: string;
  /** Padding inside the terminal content area. */
  padding?: number;

  // Custom theme colors
  /** Terminal background color. */
  backgroundColor?: string;
  /** Header/title bar background color. */
  headerColor?: string;
  /** Text color. */
  textColor?: string;
  /** Prompt color. */
  promptColor?: string;
  /** Border color. */
  borderColor?: string;
  /** Cursor color. */
  cursorColor?: string;
  /** Close button color. */
  closeColor?: string;
  /** Minimize button color. */
  minimizeColor?: string;
  /** Maximize button color. */
  maximizeColor?: string;

  // Slot overrides
  /** Custom controls renderer. */
  renderControls?: (props: TerminalSlotProps) => ReactNode;
  /** Custom header renderer (replaces entire header). */
  renderHeader?: (props: TerminalSlotProps) => ReactNode;
  /** Custom line renderer. */
  renderLine?: (
    props: TerminalSlotProps & { line: TerminalLine; index: number }
  ) => ReactNode;
  /** Custom cursor renderer. */
  renderCursor?: (props: TerminalSlotProps) => ReactNode;

  /** Additional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export type TerminalRef = ComponentPropsWithRef<"div">["ref"];

const defaultThemes: Record<
  Exclude<TerminalTheme, "custom">,
  {
    background: string;
    header: string;
    text: string;
    prompt: string;
    border: string;
    cursor: string;
    controls: { close: string; minimize: string; maximize: string };
  }
> = {
  dark: {
    background: "#1e1e1e",
    header: "#323232",
    text: "#d4d4d4",
    prompt: "#4ec9b0",
    border: "#3c3c3c",
    cursor: "#d4d4d4",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  light: {
    background: "#ffffff",
    header: "#f5f5f5",
    text: "#1e1e1e",
    prompt: "#0066cc",
    border: "#e0e0e0",
    cursor: "#1e1e1e",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  macos: {
    background: "#1d1f21",
    header: "#3c3c3c",
    text: "#c5c8c6",
    prompt: "#8abeb7",
    border: "#4a4a4a",
    cursor: "#c5c8c6",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  ubuntu: {
    background: "#300a24",
    header: "#48203a",
    text: "#eeeeec",
    prompt: "#4e9a06",
    border: "#5c3d52",
    cursor: "#eeeeec",
    controls: { close: "#ff5f57", minimize: "#febc2e", maximize: "#28c840" },
  },
  windows: {
    background: "#012456",
    header: "#1e1e1e",
    text: "#cccccc",
    prompt: "#3b78ff",
    border: "#3c3c3c",
    cursor: "#cccccc",
    controls: { close: "#e81123", minimize: "#ffb900", maximize: "#00cc6a" },
  },
};

const shadows: Record<0 | 1 | 2 | 3, string> = {
  0: "none",
  1: "0 4px 20px rgba(0, 0, 0, 0.15)",
  2: "0 8px 40px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)",
  3: "0 25px 80px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
};

/**
 * `Terminal` renders content inside a customizable terminal window frame.
 * Supports theming, animated line appearance, and slot-based customization.
 *
 * @example
 * ```tsx
 * // Basic usage with lines
 * <Terminal
 *   lines={[
 *     { text: "npm install", isCommand: true },
 *     { text: "added 150 packages in 3.2s" },
 *     { text: "npm run build", isCommand: true },
 *   ]}
 * />
 *
 * // With animation
 * <Terminal
 *   theme="macos"
 *   animate
 *   lineDelay={15}
 *   showCursor
 *   lines={[
 *     { text: "git status", isCommand: true },
 *     { text: "On branch main" },
 *     { text: "nothing to commit, working tree clean" },
 *   ]}
 * />
 *
 * // Custom theme
 * <Terminal
 *   theme="custom"
 *   backgroundColor="#0d1117"
 *   headerColor="#161b22"
 *   textColor="#c9d1d9"
 *   promptColor="#58a6ff"
 * >
 *   <pre>Custom content here</pre>
 * </Terminal>
 *
 * // Ubuntu style
 * <Terminal
 *   theme="ubuntu"
 *   title="user@ubuntu: ~/projects"
 *   prompt="$ "
 *   lines={[
 *     { text: "ls -la", isCommand: true },
 *     { text: "drwxr-xr-x  5 user user 4096 Jan 15 10:30 ." },
 *   ]}
 * />
 * ```
 */
export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      lines = [],
      children,
      theme = "dark",
      title = "Terminal",
      prompt = "$ ",
      width = 600,
      height = 400,
      showControls = true,
      showTitleBar = true,
      shadowIntensity = 2,
      borderRadius = 10,
      animate = false,
      lineDelay = 10,
      showCursor = false,
      cursorBlinkSpeed = 30,
      fontSize = 14,
      lineHeight = 1.5,
      fontFamily = "'SF Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
      padding = 16,
      backgroundColor,
      headerColor,
      textColor,
      promptColor,
      borderColor,
      cursorColor,
      closeColor,
      minimizeColor,
      maximizeColor,
      renderControls,
      renderHeader,
      renderLine,
      renderCursor,
      className,
      style,
      ...restProps
    },
    ref
  ) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const themeColors =
      theme !== "custom"
        ? defaultThemes[theme]
        : {
            background: backgroundColor ?? "#1e1e1e",
            header: headerColor ?? "#323232",
            text: textColor ?? "#d4d4d4",
            prompt: promptColor ?? "#4ec9b0",
            border: borderColor ?? "#3c3c3c",
            cursor: cursorColor ?? "#d4d4d4",
            controls: {
              close: closeColor ?? "#ff5f57",
              minimize: minimizeColor ?? "#febc2e",
              maximize: maximizeColor ?? "#28c840",
            },
          };

    // Apply custom overrides to theme
    const colors = {
      background: backgroundColor ?? themeColors.background,
      header: headerColor ?? themeColors.header,
      text: textColor ?? themeColors.text,
      prompt: promptColor ?? themeColors.prompt,
      border: borderColor ?? themeColors.border,
      cursor: cursorColor ?? themeColors.cursor,
      controls: {
        close: closeColor ?? themeColors.controls.close,
        minimize: minimizeColor ?? themeColors.controls.minimize,
        maximize: maximizeColor ?? themeColors.controls.maximize,
      },
    };

    const headerHeight = showTitleBar ? 36 : 0;
    const slotProps: TerminalSlotProps = { theme };

    // Cursor blink animation
    const cursorOpacity = showCursor
      ? interpolate(frame % cursorBlinkSpeed, [0, cursorBlinkSpeed / 2], [1, 0], {
          extrapolateRight: "clamp",
        }) > 0.5
        ? 1
        : 0
      : 0;

    const wrapperStyle: CSSProperties = {
      width,
      height,
      borderRadius,
      overflow: "hidden",
      boxShadow: shadows[shadowIntensity],
      border: `1px solid ${colors.border}`,
      background: colors.background,
      display: "flex",
      flexDirection: "column",
      // CSS variables for external styling
      "--terminal-background": colors.background,
      "--terminal-header": colors.header,
      "--terminal-text": colors.text,
      "--terminal-prompt": colors.prompt,
      "--terminal-border": colors.border,
      "--terminal-cursor": colors.cursor,
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

    const DefaultHeader = () => (
      <div
        style={{
          height: headerHeight,
          background: colors.header,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderBottom: `1px solid ${colors.border}`,
          position: "relative",
        }}
      >
        {showControls &&
          (renderControls ? renderControls(slotProps) : <DefaultControls />)}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: colors.text,
            opacity: 0.8,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {title}
        </div>
      </div>
    );

    const DefaultCursor = () => (
      <span
        style={{
          display: "inline-block",
          width: fontSize * 0.6,
          height: fontSize * 1.2,
          background: colors.cursor,
          opacity: cursorOpacity,
          verticalAlign: "text-bottom",
          marginLeft: 2,
        }}
      />
    );

    const renderTerminalLine = (line: TerminalLine, index: number) => {
      // Calculate when this line should appear
      const lineStartFrame = animate
        ? (line.delay ?? 0) + index * lineDelay
        : 0;
      const isVisible = frame >= lineStartFrame;

      if (!isVisible) return null;

      if (renderLine) {
        return renderLine({ ...slotProps, line, index });
      }

      const linePrompt = line.isCommand ? (line.prompt ?? prompt) : "";

      return (
        <div
          key={index}
          style={{
            color: line.color ?? colors.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {linePrompt && (
            <span style={{ color: colors.prompt }}>{linePrompt}</span>
          )}
          <span>{line.text}</span>
        </div>
      );
    };

    // Determine if cursor should show after last visible line
    const lastVisibleLineIndex = animate
      ? lines.findIndex((line, i) => {
          const lineStartFrame = (line.delay ?? 0) + i * lineDelay;
          return frame < lineStartFrame;
        }) - 1
      : lines.length - 1;

    const actualLastIndex =
      lastVisibleLineIndex === -2 ? lines.length - 1 : lastVisibleLineIndex;

    return (
      <div ref={ref} className={className} style={wrapperStyle} {...restProps}>
        {showTitleBar &&
          (renderHeader ? renderHeader(slotProps) : <DefaultHeader />)}
        <div
          style={{
            flex: 1,
            padding,
            overflow: "auto",
            fontFamily,
            fontSize,
            lineHeight,
            color: colors.text,
          }}
        >
          {children ? (
            children
          ) : (
            <>
              {lines.map(renderTerminalLine)}
              {showCursor &&
                actualLastIndex >= -1 &&
                (renderCursor ? renderCursor(slotProps) : <DefaultCursor />)}
            </>
          )}
        </div>
      </div>
    );
  }
);

Terminal.displayName = "Terminal";
