import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    // 테스트는 .env 값과 관계없이 항상 같은 환경에서 돌린다 (mock 모드 끔)
    env: {
      VITE_USE_MOCK: "false",
      VITE_API_URL: "http://api.test",
      VITE_FOOD_API_KEY: "test-key",
      VITE_GEMINI_API_KEY: "test-key",
    },
  },
});
