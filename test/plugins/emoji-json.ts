import path from 'path';
import fs from 'fs';
import { compress } from 'compress-json';
import { groupEmojis } from '../../build/helpers';

export default () => {
  const emojiJsonModule = 'emoji.json';
  const resolvedVirtualEmojiJsonModule = '\0' + emojiJsonModule;

  return {
    name: 'vitest-emoji-json',

    resolveId(id: string) {
      if (id.endsWith(emojiJsonModule)) {
        return resolvedVirtualEmojiJsonModule;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualEmojiJsonModule) {
        const emojis = fs.readFileSync(path.resolve('node_modules/emoji.json/emoji.json'), 'utf-8');
        const mappedEmojis = groupEmojis(emojis);
        const compressedEmojis = compress(mappedEmojis);

        return JSON.stringify(compressedEmojis);
      }
    }
  };
};
