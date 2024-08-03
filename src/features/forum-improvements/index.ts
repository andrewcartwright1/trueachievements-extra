import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants, ForumRegex } from '@ta-x-globals';
import myThreads from './my-threads';
import viewBoard from './view-board';
import walkthroughs from './walkthroughs';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.all()) {
    return;
  }
  if (!(await waitForElement('body'))) {
    return;
  }

  document.body.classList.add(
    Constants.Styles.ForumImprovements.featureJs,
    Constants.Styles.ForumImprovements.featureStyle
  );

  allConcurrently('Forum Improvements', [
    { name: 'forum-improvements-myThreads', task: myThreads },
    { name: 'forum-improvements-viewBoard', task: viewBoard },
    { name: 'forum-improvements-walkthroughs', task: walkthroughs }
  ]);
};
