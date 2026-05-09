import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for backend.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  globalIgnores([
    "dist/**"
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  }
];
