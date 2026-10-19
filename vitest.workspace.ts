import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'api',
      root: './apps/api',
      environment: 'node',
      globals: true,
    },
  },
  {
    test: {
      name: 'web',
      root: './apps/web',
      environment: 'jsdom',
      globals: true,
      setupFiles: './tests/setup.ts',
    },
  },
]);
