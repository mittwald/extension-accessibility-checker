import { defineConfig } from "vite";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
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
