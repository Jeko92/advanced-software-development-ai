import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    passWithNoTests: true,
  },
});
