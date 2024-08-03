import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { addAchievementLeaderboardLink } from '../shared';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';
import importGuides from './import-guides';
import { collapsibleGroups } from './collapsible-groups';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.achievementsUrl()) {
    return;
  }

  changeToDefaultStatus();

  allConcurrently('Games Achievements', [
    { name: 'games-achievements-individual-progress', task: individualProgress },
    { name: 'games-achievements-import-guides', task: importGuides },
    { name: 'games-achievements-achievement-leaderboard-link', task: addAchievementLeaderboardLink },
    { name: 'games-achievements-collapsible-groups', task: collapsibleGroups }
  ]);
};
