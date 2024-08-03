import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import webTransfrom from './test/plugins/web';
import emojiJsonTransfrom from './test/plugins/emoji-json';

export default defineConfig({
  test: {
    root: '.',
    include: ['./src/**/*.spec.ts'],
    globals: true,
    watch: false,
    environment: 'node'
  },
  plugins: [tsconfigPaths(), webTransfrom(), emojiJsonTransfrom()]
});
