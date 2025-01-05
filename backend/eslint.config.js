import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["./src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      complexity: ["error", 10],
      "max-depth": ["error", 4],
      "max-nested-callbacks": ["error", 4],
      "max-statements": ["error", 10],
      yoda: ["error", "never"],
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
