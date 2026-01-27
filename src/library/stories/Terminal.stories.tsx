import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { Terminal } from "../index";
import type { TerminalProps } from "../index";

const meta: Meta<TerminalProps> = {
  title: "Motion Library/Mockups/Terminal",
  component: Terminal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light", "macos", "ubuntu", "windows", "custom"],
    },
    title: { control: "text" },
    prompt: { control: "text" },
    width: { control: { type: "number", min: 300, max: 1000 } },
    height: { control: { type: "number", min: 200, max: 600 } },
    showControls: { control: "boolean" },
    showTitleBar: { control: "boolean" },
    shadowIntensity: { control: { type: "range", min: 0, max: 3, step: 1 } },
    borderRadius: { control: { type: "number", min: 0, max: 24 } },
    animate: { control: "boolean" },
    lineDelay: { control: { type: "number", min: 1, max: 30 } },
    showCursor: { control: "boolean" },
    cursorBlinkSpeed: { control: { type: "number", min: 10, max: 60 } },
    fontSize: { control: { type: "number", min: 10, max: 20 } },
    padding: { control: { type: "number", min: 8, max: 32 } },
  },
};

export default meta;
type Story = StoryObj<TerminalProps>;

export const Dark: Story = {
  args: {
    theme: "dark",
    title: "Terminal",
    width: 600,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 10,
    lines: [
      { text: "npm install", isCommand: true },
      { text: "added 150 packages in 3.2s" },
      { text: "" },
      { text: "npm run build", isCommand: true },
      { text: "Creating an optimized production build..." },
      { text: "✓ Compiled successfully" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={800} height={500} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const MacOS: Story = {
  args: {
    theme: "macos",
    title: "user — zsh — 80×24",
    width: 650,
    height: 380,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 3,
    borderRadius: 10,
    prompt: "➜ ",
    lines: [
      { text: "git status", isCommand: true },
      { text: "On branch main", color: "#8abeb7" },
      { text: "Your branch is up to date with 'origin/main'." },
      { text: "" },
      { text: "nothing to commit, working tree clean" },
      { text: "" },
      { text: "git log --oneline -3", isCommand: true },
      { text: "a1b2c3d feat: add new feature" },
      { text: "e4f5g6h fix: resolve bug" },
      { text: "i7j8k9l docs: update readme" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={850} height={550} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const Ubuntu: Story = {
  args: {
    theme: "ubuntu",
    title: "user@ubuntu: ~/projects",
    width: 650,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 8,
    prompt: "$ ",
    lines: [
      { text: "ls -la", isCommand: true },
      { text: "total 32" },
      { text: "drwxr-xr-x  5 user user 4096 Jan 15 10:30 ." },
      { text: "drwxr-xr-x 20 user user 4096 Jan 14 09:15 .." },
      { text: "-rw-r--r--  1 user user  220 Jan 10 08:00 .bashrc" },
      { text: "drwxr-xr-x  8 user user 4096 Jan 15 10:30 .git" },
      { text: "-rw-r--r--  1 user user 1024 Jan 15 10:25 README.md" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={850} height={500} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const WindowsTerminal: Story = {
  args: {
    theme: "windows",
    title: "Windows PowerShell",
    width: 650,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 0,
    prompt: "PS C:\\Users\\dev> ",
    lines: [
      { text: "Get-Process | Select-Object -First 5", isCommand: true },
      { text: "" },
      { text: "Handles  NPM(K)    PM(K)    WS(K)   CPU(s)     Id  SI ProcessName" },
      { text: "-------  ------    -----    -----   ------     --  -- -----------" },
      { text: "    234      15    23456    34567     1.23   1234   1 Code" },
      { text: "    567      22    45678    56789     2.45   2345   1 chrome" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={850} height={500} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const Animated: Story = {
  args: {
    theme: "dark",
    title: "Terminal",
    width: 600,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 10,
    animate: true,
    lineDelay: 12,
    showCursor: true,
    cursorBlinkSpeed: 20,
    lines: [
      { text: "npx create-next-app@latest my-app", isCommand: true },
      { text: "Creating a new Next.js app in ./my-app" },
      { text: "" },
      { text: "Installing dependencies:", delay: 20 },
      { text: "- react" },
      { text: "- react-dom" },
      { text: "- next" },
      { text: "" },
      { text: "✓ Success! Created my-app", color: "#4ec9b0" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={800} height={500} durationInFrames={180}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const CustomTheme: Story = {
  args: {
    theme: "custom",
    title: "Custom Terminal",
    width: 600,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 12,
    backgroundColor: "#0d1117",
    headerColor: "#161b22",
    textColor: "#c9d1d9",
    promptColor: "#58a6ff",
    borderColor: "#30363d",
    cursorColor: "#58a6ff",
    lines: [
      { text: "echo 'Hello, World!'", isCommand: true },
      { text: "Hello, World!" },
      { text: "" },
      { text: "curl https://api.github.com/user", isCommand: true },
      { text: '{ "login": "developer", "id": 12345 }' },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={800} height={500} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const NoTitleBar: Story = {
  args: {
    theme: "dark",
    width: 500,
    height: 280,
    showTitleBar: false,
    shadowIntensity: 1,
    borderRadius: 8,
    fontSize: 13,
    padding: 12,
    lines: [
      { text: "node -v", isCommand: true },
      { text: "v20.10.0" },
      { text: "npm -v", isCommand: true },
      { text: "10.2.3" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={700} height={400} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const CodeOutput: Story = {
  args: {
    theme: "macos",
    title: "node — ~/app",
    width: 650,
    height: 400,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 10,
    prompt: "> ",
    lines: [
      { text: "const users = await db.query('SELECT * FROM users');", isCommand: true },
      { text: "[" },
      { text: '  { id: 1, name: "Alice", email: "alice@example.com" },' },
      { text: '  { id: 2, name: "Bob", email: "bob@example.com" },' },
      { text: '  { id: 3, name: "Charlie", email: "charlie@example.com" }' },
      { text: "]" },
      { text: "" },
      { text: "users.length", isCommand: true },
      { text: "3", color: "#f9a825" },
    ],
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={850} height={550} durationInFrames={90}>
      <Terminal {...args} />
    </RemotionPreview>
  ),
};

export const WithChildren: Story = {
  args: {
    theme: "dark",
    title: "Custom Content",
    width: 600,
    height: 350,
    showControls: true,
    showTitleBar: true,
    shadowIntensity: 2,
    borderRadius: 10,
  },
  render: (args: TerminalProps) => (
    <RemotionPreview width={800} height={500} durationInFrames={90}>
      <Terminal {...args}>
        <div style={{ color: "#4ec9b0" }}>$ npm run dev</div>
        <div style={{ marginTop: 8 }}>
          <span style={{ color: "#6a9955" }}>✓</span> Ready in 1.2s
        </div>
        <div style={{ marginTop: 16 }}>
          <span style={{ color: "#569cd6" }}>➜</span> Local:{" "}
          <span style={{ color: "#ce9178" }}>http://localhost:3000</span>
        </div>
        <div>
          <span style={{ color: "#569cd6" }}>➜</span> Network:{" "}
          <span style={{ color: "#ce9178" }}>http://192.168.1.5:3000</span>
        </div>
      </Terminal>
    </RemotionPreview>
  ),
};
