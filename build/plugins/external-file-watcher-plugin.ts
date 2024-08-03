import { Compiler, RspackPluginInstance } from '@rspack/core';
import { globSync } from 'fs';
import { resolve } from 'path';

interface ExternalFileWatcherPluginOptions {
  files?: string[];
}

const getExternalFilesToWatch = (patterns: string[]): string[] => {
  const { filesToWatch, filesToExclude } = patterns.reduce<{
    filesToWatch: string[];
    filesToExclude: string[];
  }>(
    (acc, pattern) => {
      const isExclusion = pattern.startsWith('!');
      const resolvedFiles = globSync(isExclusion ? pattern.slice(1) : pattern);
      isExclusion ? acc.filesToExclude.push(...resolvedFiles) : acc.filesToWatch.push(...resolvedFiles);
      return acc;
    },
    { filesToWatch: [], filesToExclude: [] }
  );

  return [...new Set(filesToWatch.filter((file) => !filesToExclude.includes(file)))].map((file) => resolve(file));
};

export default class ExternalFileWatcherPlugin implements RspackPluginInstance {
  private readonly PLUGIN_NAME = 'rspack-plugin-external-file-watcher';
  private readonly files: string[];

  constructor({ files = [] }: ExternalFileWatcherPluginOptions) {
    this.files = files;
  }

  apply(compiler: Compiler) {
    const logger = compiler.getInfrastructureLogger(this.PLUGIN_NAME);

    compiler.hooks.initialize.tap(this.PLUGIN_NAME, () => {
      logger.info('Watching External Files:', this.files);
    });
    

    compiler.hooks.make.tapAsync(this.PLUGIN_NAME, (compilation, callback) => {
      const filesToWatch = getExternalFilesToWatch(this.files);

      filesToWatch.forEach((file) => {
        if (!compilation.fileDependencies.has(file)) {
          compilation.fileDependencies.add(file);
        }
      });

      callback();
    });
  }
}
