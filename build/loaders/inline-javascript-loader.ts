import { LoaderContext } from '@rspack/core';
import TerserPlugin from 'terser-webpack-plugin';

interface InlineJavascriptLoaderOptions {
  compress: boolean;
  includedPaths?: Array<string | RegExp>;
}

const isPathIncluded = (path: string, includedPaths?: Array<string | RegExp>): boolean =>
  includedPaths?.some((included) => {
    if (typeof included === 'string') return path === included;
    if (included instanceof RegExp) return included.test(path);
    return false;
  }) ?? false;

export default async function (this: LoaderContext<InlineJavascriptLoaderOptions>, source: string): Promise<string> {
  const options = this.getOptions();
  
  if (!options.compress || !isPathIncluded(this.resourcePath, options.includedPaths)) {
    return source;
  }
  
  const regex = /buildScript\s*=\s*\(\)\s*:\s*HTMLScriptElement\s*=>\s*{[^}]*?`([^`]+)`/g;
  let result: RegExpExecArray | null;
  let modifiedSource = source;

  while ((result = regex.exec(source)) !== null) {
    const originalString = result[1];

    const minifiedResult = await TerserPlugin.terserMinify(
      { inlineScript: originalString }, 
      undefined,
      { compress: true, mangle: true },
      false
    );

    const minifiedString = minifiedResult.code;
    modifiedSource = modifiedSource.replace(originalString, minifiedString);
  }

  return modifiedSource;
}
