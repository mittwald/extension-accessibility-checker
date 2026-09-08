import { defineConfig } from "vitest/config";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intentionally does not reuse vite.config.ts: the `tanstackStart` plugin does
// router codegen and server function transforms that unit tests neither need
// nor benefit from.
export default defineConfig({
  root: __dirname,
  test: {
    environment: "node",
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
});
