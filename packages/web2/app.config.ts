import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    esbuild: {
      options: {
        minify: false,
        target: "es2022",
      },
    },
  },
  vite: {
    build: {
      minify: false,
    },
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
