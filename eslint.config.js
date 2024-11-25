import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
  // Strict TypeScript ESLint rules
  ...tseslint.configs.strict,

  {
    files: ['**/*.ts', '**/*.mjs'], // Exclude .js files here
    languageOptions: {
      parser: tsParser, // Ensure TypeScript parser is used
    },
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'semi': ['error', 'never'], // Enforce no semicolons
    },
  },

  // Standard JavaScript ESLint rules
  js.configs.recommended,

  // Ignore certain folders and files
  {
    ignores: ['**/node_modules', 'dist/', '**/*.js'], // Ignore all .js files
  },
];
