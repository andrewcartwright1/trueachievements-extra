import { Constants } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';

export const addAchievementLeaderboardLink = async (): Promise<void> => {
  const dlcAchievementHeaders = [...document.querySelectorAll('main ul.ach-panels li:not(.heading)')] as HTMLElement[];

  await allConcurrently(
    'addAchievementLeaderboard - Achievements',
    dlcAchievementHeaders.map((achievement: HTMLLIElement) => ({
      name: 'add-achievement-leaderboard-achievement',
      task: async (): Promise<void> => {
        const title = await waitForElement('.title', achievement) as HTMLAnchorElement;
        const progress = achievement.querySelector('.progress-bar') as HTMLDivElement;
        const progressAnchor = document.createElement('a');

        progress.classList.add(Constants.Styles.GamesImprovements.Achievements.showAchievementLeaderboardLinksStyle);

        for (const attr of progress.attributes) {
          progressAnchor.setAttributeNS(null, attr.name, attr.value);
        }

        [...progress.children].forEach((child: HTMLElement) => progressAnchor.appendChild(child.cloneNode(true)));
        progressAnchor.innerHTML = progress.innerHTML;
        progressAnchor.href = `${new URL(title.href).pathname}/gamers`;

        achievement.insertBefore(progressAnchor, progress.nextElementSibling);
      }
    })),
    5
  );
};

export default { addAchievementLeaderboardLink };
