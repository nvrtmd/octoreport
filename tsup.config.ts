import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  outDir: 'dist',
  format: ['esm'],
  bundle: true,
  splitting: false,
  clean: true,
  dts: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
  target: 'es2022',
  external: ['dotenv'],
});
