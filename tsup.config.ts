import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: ['dotenv'],
});
