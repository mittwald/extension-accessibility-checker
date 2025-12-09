import js from "@eslint/js";
import globals from "globals";
import localRules from "eslint-plugin-local-rules";
import noRelativePathsPlugin from "eslint-plugin-no-relative-import-paths";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", "node_modules", "eslint-local-rules.cjs"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "local-rules": localRules,
      "no-relative-import-paths": noRelativePathsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, prefix: "~", rootDir: "app" },
      ],
      "local-rules/prefer-relative-for-local": "error",
    },
  },
);
