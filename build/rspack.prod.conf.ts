import { Configuration } from '@rspack/core';
import { merge } from 'webpack-merge';
import { UserScriptMetaDataPlugin } from 'userscript-metadata-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { baseConfig } from './rspack.base.conf';
import metadata from './metadata';

const filename = process.env.minimize ? 'trueachievements-extras.min.user.js' : 'trueachievements-extras.user.js';

metadata.updateURL += filename;
metadata.downloadURL += filename;

export const prodConfig: Configuration = merge(baseConfig as never, {
  mode: 'production',
  output: {
    filename: filename
  },
  optimization: {
    minimize: process.env.minimize ? true : false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@.* [\w|\d].*|==\/?UserScript==/i
          },
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  devtool: false,
  cache: false,
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata
    })
  ]
});

module.exports = prodConfig;
