import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Uniform types supported by ShaderPlane.
 */
export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

/**
 * Uniform definitions for the shader.
 */
export type Uniforms = Record<string, UniformValue>;

/**
 * Ref handle for ShaderPlane.
 */
export type ShaderPlaneRef = {
  /** The canvas element. */
  canvas: HTMLCanvasElement | null;
  /** The WebGL context. */
  gl: WebGLRenderingContext | null;
  /** Force a re-render. */
  render: () => void;
};

/**
 * Props for the `ShaderPlane` component.
 */
export type ShaderPlaneProps = {
  /** GLSL fragment shader source code. */
  fragmentShader: string;
  /** Custom uniforms to pass to the shader. */
  uniforms?: Uniforms;
  /** Width in pixels. Defaults to 1920. */
  width?: number;
  /** Height in pixels. Defaults to 1080. */
  height?: number;
  /** Pixel density multiplier. Defaults to 1. Lower for performance. */
  pixelRatio?: number;
  /** Whether to pass u_time uniform (based on frame). Defaults to true. */
  useTime?: boolean;
  /** Speed multiplier for time uniform. Defaults to 1. */
  speed?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Default vertex shader - just passes through position and UV.
 */
const DEFAULT_VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

/**
 * Compiles a shader from source.
 */
function compileShader(
  gl: WebGLRenderingContext,
  source: string,
  type: number
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Creates a shader program from vertex and fragment shaders.
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/**
 * Sets a uniform value based on its type.
 */
function setUniform(
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation | null,
  value: UniformValue
): void {
  if (!location) return;

  if (typeof value === "number") {
    gl.uniform1f(location, value);
  } else if (value.length === 2) {
    gl.uniform2f(location, value[0], value[1]);
  } else if (value.length === 3) {
    gl.uniform3f(location, value[0], value[1], value[2]);
  } else if (value.length === 4) {
    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
  }
}

/**
 * `ShaderPlane` is a base component for rendering custom GLSL fragment shaders.
 * It provides a full-screen quad with built-in uniforms for time, resolution,
 * and custom values. Syncs to Remotion's frame timeline for deterministic renders.
 *
 * Built-in uniforms (automatically provided):
 * - `u_time` - Current time in seconds (frame / fps)
 * - `u_resolution` - Canvas resolution in pixels [width, height]
 * - `u_frame` - Current frame number
 *
 * @example
 * ```tsx
 * // Simple gradient shader
 * const gradientShader = `
 *   precision mediump float;
 *   varying vec2 v_uv;
 *   uniform float u_time;
 *
 *   void main() {
 *     vec3 color = mix(
 *       vec3(0.4, 0.2, 0.8),
 *       vec3(0.2, 0.6, 1.0),
 *       v_uv.y + sin(u_time) * 0.2
 *     );
 *     gl_FragColor = vec4(color, 1.0);
 *   }
 * `;
 *
 * <ShaderPlane
 *   fragmentShader={gradientShader}
 *   width={1920}
 *   height={1080}
 * />
 *
 * // With custom uniforms
 * <ShaderPlane
 *   fragmentShader={customShader}
 *   uniforms={{
 *     u_color1: [1.0, 0.0, 0.5],
 *     u_intensity: 0.8,
 *   }}
 * />
 * ```
 */
export const ShaderPlane = forwardRef<ShaderPlaneRef, ShaderPlaneProps>(
  (
    {
      fragmentShader,
      uniforms = {},
      width = 1920,
      height = 1080,
      pixelRatio = 1,
      useTime = true,
      speed = 1,
      className,
      style,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const bufferRef = useRef<WebGLBuffer | null>(null);

    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Initialize WebGL context and program
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
      });

      if (!gl) {
        console.error("WebGL not supported");
        return;
      }

      glRef.current = gl;

      // Compile shaders
      const vertShader = compileShader(gl, DEFAULT_VERTEX_SHADER, gl.VERTEX_SHADER);
      const fragShader = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

      if (!vertShader || !fragShader) return;

      // Create program
      const program = createProgram(gl, vertShader, fragShader);
      if (!program) return;

      programRef.current = program;

      // Create full-screen quad buffer
      const positionBuffer = gl.createBuffer();
      bufferRef.current = positionBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      // Cleanup
      return () => {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(positionBuffer);
        programRef.current = null;
        bufferRef.current = null;
      };
    }, [fragmentShader]);

    // Render function
    const render = useCallback(() => {
      const gl = glRef.current;
      const program = programRef.current;
      const canvas = canvasRef.current;
      const buffer = bufferRef.current;

      if (!gl || !program || !canvas || !buffer) return;

      // Set canvas size
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      // Bind buffer and set up vertex attributes (must be done each render)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set built-in uniforms
      const time = (frame / fps) * speed;

      if (useTime) {
        const timeLocation = gl.getUniformLocation(program, "u_time");
        if (timeLocation) gl.uniform1f(timeLocation, time);
      }

      const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }

      const frameLocation = gl.getUniformLocation(program, "u_frame");
      if (frameLocation) gl.uniform1f(frameLocation, frame);

      // Set custom uniforms
      for (const [name, value] of Object.entries(uniforms)) {
        const location = gl.getUniformLocation(program, name);
        setUniform(gl, location, value);
      }

      // Clear and draw
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, [frame, fps, speed, width, height, pixelRatio, useTime, uniforms]);

    // Render on each frame
    useEffect(() => {
      render();
    }, [render]);

    // Expose ref
    useImperativeHandle(
      ref,
      () => ({
        canvas: canvasRef.current,
        gl: glRef.current,
        render,
      }),
      [render]
    );

    const canvasStyle: CSSProperties = {
      width,
      height,
      display: "block",
      ...style,
    };

    return <canvas ref={canvasRef} className={className} style={canvasStyle} />;
  }
);

ShaderPlane.displayName = "ShaderPlane";
