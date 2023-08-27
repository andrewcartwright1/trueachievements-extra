import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.reviewsUrl()) {
    return;
  }

  allConcurrently('Games Reviews', []);
};
