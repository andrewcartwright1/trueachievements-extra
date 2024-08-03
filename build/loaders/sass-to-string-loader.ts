import { LoaderContext } from '@rspack/core';

export default async function (this: LoaderContext<unknown>, content: string) {
  return `
    const styles = \`${content}\`;
    export default styles;
  `;
}