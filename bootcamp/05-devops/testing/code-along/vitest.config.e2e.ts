import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    globals: false,
    environment: 'node',
    include: ['test/**/*spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    hookTimeout: 30_000,
    passWithNoTests: true,
  },
});
