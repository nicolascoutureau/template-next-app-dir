import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { ShaderPlane, Noise } from "../index";
import type { ShaderPlaneProps } from "../index";
import { AbsoluteFill } from "remotion";

const meta: Meta<ShaderPlaneProps> = {
  title: "Motion Library/Background/ShaderPlane",
  component: ShaderPlane,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    speed: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    pixelRatio: { control: { type: "range", min: 0.5, max: 2, step: 0.25 } },
  },
};

export default meta;
type Story = StoryObj<ShaderPlaneProps>;

// Simple animated gradient shader
const gradientShader = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = v_uv;
    
    // Animated gradient
    float wave = sin(uv.x * 3.14159 + u_time) * 0.1;
    
    vec3 color1 = vec3(0.4, 0.2, 0.8); // Purple
    vec3 color2 = vec3(0.2, 0.6, 1.0); // Blue
    vec3 color3 = vec3(1.0, 0.4, 0.6); // Pink
    
    vec3 color = mix(color1, color2, uv.y + wave);
    color = mix(color, color3, uv.x * 0.3);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const AnimatedGradient: Story = {
  args: {
    fragmentShader: gradientShader,
    speed: 1,
    pixelRatio: 1,
  },
  render: (args: ShaderPlaneProps) => (
    <RemotionPreview durationInFrames={120} width={800} height={450}>
      <AbsoluteFill>
        <ShaderPlane {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Custom Shader
          </div>
        </div>
        <Noise opacity={0.03} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Concentric circles shader
const circlesShader = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 pos = (v_uv - 0.5) * 2.0;
    pos.x *= u_resolution.x / u_resolution.y;
    
    float d = length(pos);
    float rings = sin(d * 20.0 - u_time * 3.0) * 0.5 + 0.5;
    
    vec3 color1 = vec3(0.0, 0.8, 1.0);
    vec3 color2 = vec3(0.5, 0.0, 1.0);
    vec3 bg = vec3(0.05, 0.05, 0.1);
    
    vec3 color = mix(color2, color1, rings);
    color = mix(bg, color, 1.0 - smoothstep(0.0, 1.0, d));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const ConcentricRings: Story = {
  args: {
    fragmentShader: circlesShader,
    speed: 1,
    pixelRatio: 1,
  },
  render: (args: ShaderPlaneProps) => (
    <RemotionPreview durationInFrames={90} width={800} height={450}>
      <AbsoluteFill>
        <ShaderPlane {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Concentric Rings
          </div>
        </div>
      </AbsoluteFill>
    </RemotionPreview>
  ),
};

// Fractal noise visualization
const fractalShader = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 pos = v_uv * 4.0;
    pos.x *= u_resolution.x / u_resolution.y;
    
    float n = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      n += amp * noise(pos + u_time * 0.5);
      pos *= 2.0;
      amp *= 0.5;
    }
    
    vec3 color1 = vec3(0.1, 0.1, 0.2);
    vec3 color2 = vec3(0.2, 0.5, 0.8);
    vec3 color3 = vec3(0.8, 0.3, 0.5);
    
    vec3 color = mix(color1, color2, n);
    color = mix(color, color3, smoothstep(0.5, 0.8, n));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const FractalNoise: Story = {
  args: {
    fragmentShader: fractalShader,
    speed: 1,
    pixelRatio: 1,
  },
  render: (args: ShaderPlaneProps) => (
    <RemotionPreview durationInFrames={180} width={800} height={450}>
      <AbsoluteFill>
        <ShaderPlane {...args} width={800} height={450} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            Fractal Noise
          </div>
        </div>
        <Noise opacity={0.02} width={800} height={450} />
      </AbsoluteFill>
    </RemotionPreview>
  ),
};
