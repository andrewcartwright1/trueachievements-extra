import { join } from 'path';
import { merge } from 'webpack-merge';
import { UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';
import { baseConfig } from './rspack.base.conf';
import metadata from './metadata';
import ExternalFileWatcherPlugin from './plugins/external-file-watcher-plugin';

metadata.name['$'] += ' - Development';
(metadata.require as string[]).push('file://' + join(__dirname, '../dist/trueachievements-extras.debug.js'));

delete metadata.downloadURL;
delete metadata.updateURL;

export const devConfig = merge(baseConfig as never, {
  mode: 'development',
  cache: false,
  entry: {
    debug: baseConfig.entry,
    'dev.user': join(__dirname, './empty.ts')
  },
  output: {
    filename: 'trueachievements-extras.[name].js'
  },
  devtool: 'eval-cheap-module-source-map',
  watch: process.env.watch ? true : false,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: process.env.watch
    ? [
        new UserScriptMetaDataPlugin({
          metadata
        }),
        new ExternalFileWatcherPlugin({
          files: [
            join(__dirname, '../src/**/*.hbs'),
            join(__dirname, '../CHANGELOG.md'),
            join(__dirname, '../CREDITS.md'),
            join(__dirname, '../FEATURE-DOCUMENTATION.md')
          ]
        })
      ]
    : [
        new UserScriptMetaDataPlugin({
          metadata
        })
      ]
});

export default devConfig;
