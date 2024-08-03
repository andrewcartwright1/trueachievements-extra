import { allConcurrently } from '@ta-x-utilities';
import { CollapsibleGroups } from './collapsible-groups';
import autoSortBy from './auto-sort-by';
import hideOwnedItems from './hide-owned-items';

export default async (): Promise<void> => {
  allConcurrently('Sales News', [
    { name: 'sales-auto-sort-by', task: autoSortBy },
    { name: 'sales-hide-owned-items', task: hideOwnedItems },
    { name: 'sales-collapsible-groups', task: CollapsibleGroups }
  ]);
};
