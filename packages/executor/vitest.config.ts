import { defineConfig } from "vitest/config";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    // Tests that drive a real Chrome need more than the 5s default.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
