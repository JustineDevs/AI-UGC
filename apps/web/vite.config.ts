import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ai-ugc/contracts": resolve(__dirname, "../../packages/contracts/src"),
      "@ai-ugc/niche-packs": resolve(
        __dirname,
        "../../packages/niche-packs/src",
      ),
      "@ai-ugc/workflow-engine": resolve(
        __dirname,
        "../../packages/workflow-engine/src",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
