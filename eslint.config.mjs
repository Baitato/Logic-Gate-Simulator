import globals from "globals";
import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "import/no-unused-modules": "warn",
    },
  },
  js.configs.recommended,
];
