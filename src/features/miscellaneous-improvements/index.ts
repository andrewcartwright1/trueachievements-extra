import { allConcurrently } from '@ta-x-utilities';
import stickyHeader from './sticky-header';
import emojis from './emojis';
import giveawayAutoOptIn from './giveaway-auto-opt-in';

export default async (): Promise<void> => {
  allConcurrently('Miscellaneous Improvements', [
    { name: 'miscellaneous-improvements-sticky-header', task: stickyHeader },
    { name: 'miscellaneous-improvements-emojis', task: emojis },
    { name: 'miscellaneous-improvements-giveaway-auto-opt-in', task: giveawayAutoOptIn }
  ]);
};
