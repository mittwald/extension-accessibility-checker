import { defineConfig } from "vite";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  build: {
    minify: false,
  },
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      routesDirectory: "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    viteReact({
      babel: { plugins: [["babel-plugin-react-compiler", {}]] },
    }),
  ],
});
