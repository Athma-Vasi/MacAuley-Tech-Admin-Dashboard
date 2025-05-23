/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/*.test.ts", "**/*.spec.ts"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    // css: true,
    // coverage: {
    //   reporter: ["text", "html"], // generate a CLI report + an HTML report
    //   exclude: [
    //     "node_modules/",
    //     "dist/",
    //     "src/test/", // ignore test utils
    //     "**/*.d.ts",
    //   ],
    // },
  },
});
