import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Set the API base URL based on your environment (development or production)
    "process.env.API_URL": JSON.stringify(
      process.env.API_URL || "http://localhost:5000",
    ),
  },
});
