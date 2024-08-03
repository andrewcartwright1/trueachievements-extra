import { JSDOM, FileOptions } from 'jsdom';
import { getPath } from '@ta-x-build-helpers';

const polyFill = (jsdom: JSDOM): void => {
  const { window } = jsdom;

  Object.assign(global, {
    window: window as unknown as Window & typeof globalThis,
    document: window.document,
    HTMLElement: window.HTMLElement,
    HTMLInputElement: window.HTMLInputElement,
    HTMLFormElement: window.HTMLFormElement,
    HTMLAnchorElement: window.HTMLAnchorElement,
    MutationObserver: window.MutationObserver,
    FormData: window.FormData,
    Event: window.Event,
    CustomEvent: window.CustomEvent,
    Node: window.Node,
    DOMParser: window.DOMParser
  });

  class MockImage extends window.Image {
    constructor(width?: number, height?: number) {
      super(width, height);

      Object.defineProperties(this, {
        complete: {
          get: () => (this && this._complete) ?? true,
          set: (value: boolean) => (this._complete = value),
          configurable: true,
          enumerable: true
        },
        src: {
          get: () => (this && this._src) ?? '',
          set: (value: string) => {
            this._src = value;

            if (value === 'load-image.jpg' || value === 'error-image.jpg') {
              this.complete = false;

              const eventName = value === 'load-image.jpg' ? 'load' : 'error';

              setTimeout(() => {
                this.dispatchEvent(new Event(eventName));
              }, 250);
            } else {
              this.complete = true;
            }
          },
          configurable: true,
          enumerable: true
        }
      })
    }
  }

  vi.stubGlobal('Image', MockImage);
};

export const setHtml = async (path: string, opts?: FileOptions): Promise<void> => {
  const jsdom = await JSDOM.fromFile(getPath(path), opts);
  polyFill(jsdom);
};

polyFill(new JSDOM());
