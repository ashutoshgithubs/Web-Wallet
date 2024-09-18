import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@solana/web3.js": "@solana/web3.js/lib/index.esm.js",
    },
  },
});

// import { defineConfig } from 'vite';

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@solana/web3.js': '@solana/web3.js/lib/index.esm.js',
//     },
//   },
// });
