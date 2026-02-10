import { configs as tseslintConfigs } from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  // Global ignores
  {
    ignores: [
      ".next/",
      "node_modules/",
      "out/",
      "storage/",
      "scripts/*.mjs",
      "public/",
    ],
  },
  // TypeScript base config for all TS/TSX files
  ...tseslintConfigs.recommended,
  // React + Next.js rules for TSX/JSX files
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
