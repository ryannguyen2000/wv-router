import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  platform: "browser",
  target: "es2020",
  external: ["react", "react-dom", "zustand", "use-sync-external-store"],
  clean: true,
});
