import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import remotion from "@remotion/eslint-plugin";

const eslintConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    ...remotion.flatPlugin,
    files: ["src/remotion/**"],
  },
  {
    files: ["src/remotion/**"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: ["node_modules/", ".next/", "out/"],
  },
];

export default eslintConfig;
