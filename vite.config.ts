import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/prelude-of-the-chambered-reborn/",
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "ES2022",
  },
});
