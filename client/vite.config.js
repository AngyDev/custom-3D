import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  esbuild: {
    loader: "jsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  plugins: [react()],
  // server: {
  //   port: 8080,
  // },
  build: {
    // Relative to the root
    outDir: "../client/dist",
    emptyOutDir: true,
  },
});
