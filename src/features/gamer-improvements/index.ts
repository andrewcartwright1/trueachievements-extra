import { GamerRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { addGroupByGameButton } from './add-group-by-game-button';

export default async (): Promise<void> => {
  if (!GamerRegex.Test.all()) {
    return;
  }

  allConcurrently('Gamer Improvements', [
    { name: 'gamer-improvments-add-group-by-game-button', task: addGroupByGameButton }
  ]);
};
