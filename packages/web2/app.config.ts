import { defineConfig } from "@tanstack/react-start/config";
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
    server: {
      allowedHosts: ["host.docker.internal"],
    },
    build: {
      minify: false,
    },
    resolve: {
      alias: {
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    },
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
