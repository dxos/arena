import { ConfigPlugin } from "@dxos/config/vite-plugin";
import { ThemePlugin } from "@dxos/react-ui-theme/plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  server: { host: true },
  build: {
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        shell: resolve(__dirname, "./shell.html"),
      },
      output: {
        // Generate nicer chunk names. Default makes most chunks have names like index-[hash].js.
        chunkFileNames,
        manualChunks: {
          react: ["react", "react-dom"],
          dxos: ["@dxos/react-client"],
          ui: ["@dxos/react-ui", "@dxos/react-ui-theme"],
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    ConfigPlugin(),
    ThemePlugin({
      root: __dirname,
      content: [
        resolve(__dirname, "./index.html"),
        resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
        resolve(__dirname, "node_modules/@dxos/react-ui/dist/**/*.mjs"),
        resolve(__dirname, "node_modules/@dxos/react-ui-theme/dist/**/*.mjs"),
        resolve(__dirname, "./node_modules/@braneframe/plugin-*/dist/lib/**/*.mjs"),
        resolve(__dirname, "./node_modules/@dxos/react-ui-mosaic/dist/lib/**/*.mjs"),
        resolve(__dirname, "./node_modules/@dxos/react-ui-stack/dist/lib/**/*.mjs"),
        resolve(__dirname, "./node_modules/@dxos/react-ui-navtree/dist/lib/**/*.mjs"),
        resolve(__dirname, "../plugins/*/src/**/*.{js,ts,jsx,tsx}"),
      ],
    }),
    topLevelAwait(),
    wasm(),
    react({ jsxRuntime: "classic" }),
  ],
  worker: {
    format: "es",
    plugins: [topLevelAwait(), wasm()],
  },
});

function chunkFileNames(chunkInfo) {
  if (chunkInfo.facadeModuleId && chunkInfo.facadeModuleId.match(/index.[^\/]+$/gm)) {
    let segments = chunkInfo.facadeModuleId.split("/").reverse().slice(1);
    const nodeModulesIdx = segments.indexOf("node_modules");
    if (nodeModulesIdx !== -1) {
      segments = segments.slice(0, nodeModulesIdx);
    }
    const ignoredNames = ["dist", "lib", "browser"];
    const significantSegment = segments.find((segment) => !ignoredNames.includes(segment));
    if (significantSegment) {
      return `assets/${significantSegment}-[hash].js`;
    }
  }

  return "assets/[name]-[hash].js";
}
