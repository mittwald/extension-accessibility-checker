import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: "./app",
    }),
    viteReact({
      babel: { plugins: [["babel-plugin-react-compiler", {}]] },
    }),
  ],
  server: {
    allowedHosts: ["host.docker.internal"],
  },
  resolve: {
    alias: {
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  esbuild: {
    target: "es2022",
  },
});
