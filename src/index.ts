import { default as ajaxInterceptor } from 'ajax-interceptor';
import { Cache, clearLegacy } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion, pubSub, snackbar, tabs, hideableRow } from '@ta-x-components';
import {
  SettingsMenu,
  MiscellaneousImprovements,
  StaffWalkthroughImprovements,
  ForumImprovements,
  NewsImprovements,
  GamesImprovements,
  GamerImprovements,
  Styles
} from '@ta-x-features';

ajaxInterceptor.addRequestCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:request', xhr));
ajaxInterceptor.addResponseCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:response', xhr));
ajaxInterceptor.wire();

(async () => {
  allConcurrently('Components', [
    { name: 'component:snackbar', task: snackbar },
    { name: 'component:accordion', task: accordion },
    { name: 'component:tabs', task: tabs },
    { name: 'component:hideable-row', task: hideableRow }
  ]);

  allConcurrently(
    'Features',
    [
      { name: 'feature:styles', task: Styles },
      { name: 'feature:settings-menu', task: SettingsMenu },
      { name: 'feature:miscellaneous-improvements', task: MiscellaneousImprovements },
      { name: 'feature:staff-walkthrough-improvements', task: StaffWalkthroughImprovements },
      { name: 'feature:forum-improvements', task: ForumImprovements },
      { name: 'feature:news-improvements', task: NewsImprovements },
      { name: 'feature:games-improvements', task: GamesImprovements },
      { name: 'feature:gamer-improvements', task: GamerImprovements }
    ],
    4
  );

  allConcurrently('Cache', [
    { name: 'cache:expired', task: Cache.clearExpired.bind(Cache) },
    { name: 'cache:legacy', task: Cache.clearLegacy.bind(Cache) }
  ]);

  allConcurrently('Config', [
    { name: 'config:legacy', task: clearLegacy }
  ]);
})();
