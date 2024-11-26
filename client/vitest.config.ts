import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // Use V8 coverage
      reporter: ["text", "html"],
    },
  },
});
