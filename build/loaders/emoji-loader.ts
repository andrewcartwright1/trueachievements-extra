import { LoaderContext } from '@rspack/core';
import { compress } from 'compress-json';
import groupEmojis from '../helpers/group-emojis';

interface EmojiLoaderOptions {
  compress: boolean;
}

export default function (this: LoaderContext<EmojiLoaderOptions>, source: string) {
  const options = this.getOptions();
  let emojis = groupEmojis(source);

  if (options.compress) {
    emojis = compress(emojis);
  }

  return JSON.stringify(emojis);
}
