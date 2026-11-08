import { defineConfig } from "vitest/config";
import path from "node:path";

// Carica .env se presente (in CI le variabili arrivano già dall'ambiente).
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
  },
});
