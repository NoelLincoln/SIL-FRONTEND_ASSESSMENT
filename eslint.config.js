import tsParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        node: true, // Node.js globals
        es2021: true, // ECMAScript 2021 globals
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      // ESLint's recommended rules
      "eqeqeq": "error", // Enforce strict equality
      "curly": "error", // Require curly braces for all control statements
      "no-console": "warn", // Disallow console.log

      // TypeScript-specific recommended rules
      "@typescript-eslint/no-explicit-any": "warn",
       
      // Custom rules
      "no-undef": "off", // Disable no-undef rule
      "semi": ["error", "never"], // Enforce no semicolons
    },
  }, 
  {
    ignores: ["node_modules", "dist"],
  },
];
