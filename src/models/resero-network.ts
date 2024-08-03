import { Constants } from '@ta-x-globals';
import { deleteMemoizedCorsFetch, memoizeCorsFetch, template } from '@ta-x-helpers';
import { waitForElement } from '@ta-x-utilities';
import { ReseroNetworkOptions } from '@ta-x-types';
import templatedAchievementGuideSolution from '@ta-x-views/templates/achievement-guide-solution.html';
import { ImportableGuide } from './importable-guide';

export class ReseroNetwork extends ImportableGuide {
  public constructor(opts: ReseroNetworkOptions) {
    super(opts);
  }

  getAchievementGuide = async (url: string): Promise<void> => {
    const achievementTitle = (
      (await waitForElement('.ach-panel:not([data-secret]) .title')) as HTMLSpanElement
    )?.innerText?.trim();
    const guideResponse = await memoizeCorsFetch(url);
    const guideDocument = new DOMParser().parseFromString(guideResponse, 'text/html');
    const guides = [...guideDocument.querySelectorAll('.achilist .achilist__guide')].map((el: HTMLLIElement) => ({
      title: (el.querySelector('.achilist__title') as HTMLHeadingElement)?.innerText?.trim(),
      href: (el.querySelector('.achilist__header a') as HTMLAnchorElement)?.href?.trim(),
      description: (el.querySelector('.achilist__data > p') as HTMLParagraphElement)?.innerText?.trim(),
      guide: ([...el.querySelectorAll('.text_res')] as HTMLDivElement[]).map((el) => {
        const guide = el.innerHTML.trim();
        return guide;
      })
    }));

    const guide = guides.find((guide) => guide.title === achievementTitle);

    if (!guide) {
      deleteMemoizedCorsFetch(url);
      return;
    }

    const guideText = guide.guide.join('<br>');

    if (guideText.length === 0) {
      return;
    }
    
    const parsedTemplateDocument = new DOMParser().parseFromString(templatedAchievementGuideSolution, 'text/html');
    const parsedSvgDocument = new DOMParser()
      .parseFromString(this.guideIcon, 'text/html')
      .body.firstElementChild.cloneNode(true) as HTMLElement;
    const clonedAchievementGuideSolution = (
      parsedTemplateDocument.querySelector(
        `#${Constants.Templates.GamesImprovements.Achievements.achievementGuideSolution}`
      ) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const achievementGuideSolution = template(clonedAchievementGuideSolution as HTMLElement, {
      achievementGuideSolution: {
        name: this.guideName,
        href: `${new URL(url).origin}${new URL(guide.href).pathname}`,
        guide: guide.guide.join('<br>'),
        info: this.guideInfo
      }
    });

    parsedSvgDocument.classList.add(this.guideIconClass);

    const gamerSideBar = achievementGuideSolution.querySelector('.gamer');
    gamerSideBar.removeChild(gamerSideBar.firstChild);
    gamerSideBar.prepend(parsedSvgDocument);

    let existingGuides = document.querySelector('ul.posts');
    if (!existingGuides) {
      const heading = document.createElement('h2');
      heading.innerText = `How to unlock the ${guide.title} achievement`;
      heading.classList.add('block', 'topmargin');
      heading.id = 'oSolutions';

      const achievementGuides = document.createElement('ul');
      achievementGuides.classList.add('posts');

      const elBeforeUl = document.querySelector('main .nn_player_w');
      elBeforeUl.parentElement.insertBefore(heading, elBeforeUl.nextElementSibling);
      elBeforeUl.parentElement.insertBefore(achievementGuides, heading.nextElementSibling);

      existingGuides = document.querySelector('ul.posts');
    }

    existingGuides.prepend(achievementGuideSolution);
  };
}
