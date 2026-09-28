import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs, so the build runs from any sub-path (itch.io, GitHub Pages, etc.).
  base: './',
  plugins: [react()],
  build: {
    // Phaser alone is ~1.4 MB minified, the default 500 kB warning is just noise.
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      output: {
        // Phaser gets its own chunk: it rarely changes, so it stays cached between game updates.
        codeSplitting: {
          groups: [{ name: 'phaser', test: /node_modules[\\/]phaser[\\/]/ }],
        },
      },
    },
  },
});
