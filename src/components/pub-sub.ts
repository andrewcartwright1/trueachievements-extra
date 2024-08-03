import { PubSubType } from '@ta-x-types';

type Events = {
  'ajaxIntercept:request': XMLHttpRequest;
  'ajaxIntercept:response': XMLHttpRequest;
  'snackbar:show': { text: string; type: string; timeoutMS?: number };
  'hideableRow:hide': { element: HTMLElement; method: 'forum' | 'table'; filterText?: string };
  'accordion:setMaxHeight': HTMLElement;
  'accordion:toggleState': HTMLElement;
  'tabs:set': HTMLElement;
  'tabs:hide': HTMLElement;
  'tabs:delete': HTMLElement;
  'tinymce:repositionFloatingMenus': null;
  'walkthroughPreview:removeAside': null;
  'test:subscribeEvent': string;
  'test:unsubscribeEvent': string;
};

function PubSub<E>(): PubSubType<E> {
  const handlers: { [key: string]: any[] } = {};

  return {
    publish: (event, msg) => {
      (handlers[event] ?? []).forEach((h) => h(msg));
    },

    subscribe: (event, callback) => {
      const list = handlers[event] ?? [];
      list.push(callback);
      handlers[event] = list;

      return callback;
    },

    unsubscribe: (event, callback) => {
      let list = handlers[event] ?? [];
      list = list.filter((h) => h !== callback);
      handlers[event] = list;
    }
  };
}

export default PubSub<Events>();
