import { gameDLC, GamesRegex } from '@ta-x-globals';
import { applyCollapsibleGroups } from '../shared';

export const collapsibleGroups = async (): Promise<void> => {
  if (!gameDLC.gameDLCCollapsibleGroups) {
    return;
  }

  if (GamesRegex.Test.individualDlcUrl()) {
    return;
  }

  await applyCollapsibleGroups();
};

export default { collapsibleGroups };
