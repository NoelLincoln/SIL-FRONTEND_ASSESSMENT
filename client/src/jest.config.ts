import { defineConfig } from 'vite';
import tsJest from 'ts-jest/presets';

export default defineConfig({
  test: {
    environment: 'jsdom', 
    transform: {
      '^.+\\.tsx?$': tsJest.transform,
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  },
});
