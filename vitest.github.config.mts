import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['lcov'],
        include: ['src/**']
      },
      reporters: ['default', 'github-actions']
    }
  })
);
