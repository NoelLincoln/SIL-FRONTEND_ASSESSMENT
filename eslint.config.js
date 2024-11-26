import tsParser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    env: {
      node: true, // Enables Node.js globals
      es2021: true,
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'semi': ['error', 'never'],
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
]
