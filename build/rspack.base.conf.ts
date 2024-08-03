import { join } from 'path';
import { defineConfig } from '@rspack/cli';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import htmlPreprocessor from './processors/html-preprocessor';

const loaderDirectory = join(__dirname, './loaders');

export const baseConfig = defineConfig({
  resolve: {
    extensions: ['.js', '.ts'],
    tsConfig: {
      configFile: join(__dirname, '../tsconfig.app.json')
    }
  },
  optimization: {
    minimize: false,
    moduleIds: 'named'
  },
  entry: './src/index.ts',
  output: {
    path: join(__dirname, '../dist')
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i,
        use: [
          {
            loader: join(loaderDirectory, 'sass-to-string-loader.ts')
          },
          {
            loader: 'builtin:lightningcss-loader',
            options: {
              minify: true
            },
          },
          'sass-loader'
        ]
      },
      {
        test: require.resolve('emoji.json'),
        use: [
          {
            loader: join(loaderDirectory, 'emoji-loader.ts'),
            options: {
              compress: true
            }
          }
        ]
      },
      {
        test: /\.html$|\.hbs$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          preprocessor: htmlPreprocessor,
        }
      },
      {
        test: /\.m?ts$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'ES2020'
            }
          },
          {
            loader: join(loaderDirectory, 'inline-javascript-loader.ts'),
            options: {
              compress: true,
              includedPaths: [/staff-walkthrough-improvements\\edit-walkthrough\\tinymce\\.*\.ts$/]
            }
          }
        ]
      }
    ]
  },
  plugins: process.env.analyse
    ? [new RsdoctorRspackPlugin()]
    : []
});
