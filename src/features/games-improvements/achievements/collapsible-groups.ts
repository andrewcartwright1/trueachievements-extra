import { gameAchievements } from '@ta-x-globals';
import { applyCollapsibleGroups } from '../shared';

export const collapsibleGroups = async (): Promise<void> => {
  if (!gameAchievements.gameAchievementsCollapsibleGroups) {
    return;
  }

  const hasDlc = document.querySelector('.pnl-hd.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') != null;
  if (!hasDlc) {
    return;
  }

  await applyCollapsibleGroups();
};

export default { collapsibleGroups };
