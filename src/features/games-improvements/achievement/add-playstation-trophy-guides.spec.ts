import fs from 'fs';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-test';
import { Cache, Constants, AchievementsRegex, gameAchievements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import addPlaystationTrophyGuides from './import-guides';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));
vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('games-improvements/achievement/add-playstation-trophy-guides', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if game heading does not load', async () => {
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);

    await addPlaystationTrophyGuides();

    expect(
      document.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`)
    ).toBe(null);
    expect(
      document.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesStyle}`)
    ).toBe(null);
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html'
    }
  ])('should not display if not enabled', async ({ view }) => {
    await setHtml(view);
    vi.spyOn(config, 'gameAchievementsShowPlaystationTrophyGuides', 'get').mockReturnValueOnce(false);

    await addPlaystationTrophyGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html'
    }
  ])('should ask for url if no url is configured', async ({ view }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsShowPlaystationTrophyGuides', 'get').mockReturnValueOnce(true);

    await addPlaystationTrophyGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html',
      inputValue: ''
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html',
      inputValue: 'invalid-url'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html',
      inputValue: 'invalid-url'
    }
  ])('should ignore invalid urls when url is asked for', async ({ view, inputValue }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsShowPlaystationTrophyGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');

    await addPlaystationTrophyGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = document.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new window.Event('input', { bubbles: true, cancelable: false }));

    const button = document.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
    button.dispatchEvent(
      new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    memoizeCorsFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html',
      inputValue: 'https://www.playstationtrophies.org/game/g-force/guide/',
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/gforce.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html',
      inputValue: 'https://www.playstationtrophies.org/game/g-force/guide/',
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/gforce.html'
    }
  ])('should fetch valid url when url is asked for', async ({ view, inputValue, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsShowPlaystationTrophyGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await addPlaystationTrophyGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeCorsFetchSpy).not.toHaveBeenCalled();

    const input = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;
    input.value = inputValue;
    input.dispatchEvent(new window.Event('input', { bubbles: true, cancelable: false }));

    const button = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
    button.dispatchEvent(
      new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    );

    await taxHelpers.wait(1);

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(memoizeCorsFetchSpy).toHaveBeenCalled();

    const guide = document.querySelector('.ta-x-games-improvements-achievements-achievement-guide');

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.playstationtrophies.org/game/g-force/guide/']]),
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/gforce.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/achievement-with-no-guide.html',
      cachedGuide: new Map([['GForce', 'https://www.playstationtrophies.org/game/g-force/guide/']]),
      memoizedView: '@ta-x-test-views/games-improvements/achievement/add-playstation-trophy-guides/gforce.html'
    }
  ])('should display guide for achievement', async ({ view, cachedGuide, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsShowPlaystationTrophyGuides', 'get').mockReturnValueOnce(true);
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);
    vi.spyOn(Cache, 'gameAchievementsPlaystationTrophiesGuideUrl', 'get').mockReturnValueOnce(cachedGuide);

    const memoizeCorsFetchSpy = vi.spyOn(taxHelpers, 'memoizeCorsFetch');
    memoizeCorsFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await addPlaystationTrophyGuides();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`
    );

    const guide = document.querySelector('.ta-x-games-improvements-achievements-achievement-guide');

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(true);
    expect(guide).not.toBe(null);
    expect((guide.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeCorsFetchSpy.mockRestore();
  });
});
