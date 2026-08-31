import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  server: {
    allowedHosts: ["host.docker.internal"],
  },
  build: {
    minify: false,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  plugins: [
    tanstackStart({
      srcDirectory: "app",
      router: {
        autoCodeSplitting: true,
        quoteStyle: "double",
      },
    }),
    viteReact({
      babel: { plugins: [["babel-plugin-react-compiler", {}]] },
    }),
  ],
});
