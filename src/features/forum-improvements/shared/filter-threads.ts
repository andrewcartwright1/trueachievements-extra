import { pubSub } from '@ta-x-components';
import { waitForElement } from '@ta-x-utilities';

export const applyThreadFilters = async (filters: string[]) => {
  if (!filters.length) {
    return;
  }

  const board = await waitForElement('main .view-board, main .messageboard-index');
  ([...board.querySelectorAll('li:not(.header)')] as HTMLElement[]).forEach((thread: HTMLElement) => {
    const threadTitleAnchor = thread.querySelector('.topic a, .read a') as HTMLAnchorElement;
    let activeFilter: string = null;

    filters.forEach((filter: string) => {
      if (activeFilter != null) {
        return;
      }
      
      if (!threadTitleAnchor.innerText.trim().toLowerCase().includes(filter.toLowerCase())) {
        return;
      }

      activeFilter = filter;
    });

    if (!activeFilter) {
      return;
    }

    pubSub.publish('hideableRow:hide', {
      element: threadTitleAnchor,
      method: 'forum',
      filterText: `Hidden by filter "${activeFilter}"`
    });
  });
};

export default { applyThreadFilters };
