import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extBridgeNodeClientStub = (): Plugin => ({
  name: "ext-bridge-node-client-stub",
  enforce: "pre",
  resolveId(source) {
    if (source !== "@mittwald/ext-bridge/node") return null;
    if (this.environment.name !== "client") return null;
    return path.resolve(__dirname, "app/lib/extBridgeNodeClientStub.ts");
  },
});

export default defineConfig({
  root: __dirname,
  server: {
    host: true,
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
    extBridgeNodeClientStub(),
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
