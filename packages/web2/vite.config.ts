import { defineConfig } from "vite";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
});
