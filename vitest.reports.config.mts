import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['html'],
        include: ['src/**'],
        reportsDirectory: './dist/html/coverage/'
      },
      silent: true,
      reporters: ['html'],
      watch: true,
      outputFile: './dist/html/index.html'
    }
  })
);
