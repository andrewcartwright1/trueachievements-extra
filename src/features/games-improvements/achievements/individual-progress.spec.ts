import fs from 'fs';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-test';
import { gameAchievements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import { individualProgress } from './individual-progress';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));
vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('games-improvements/achievements/individual-progress', () => {
  const getHeaders = () => ({
    baseGame: document.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement,
    dlc: document.querySelector('.pnl-hd.dlc.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') as HTMLElement
  });

  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(false);
    const allConcurrentlySpy = vi.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  test.concurrent.each([
    { view: '@ta-x-test-views/games-improvements/achievements/individual-progress/no-achievements-won-no-dlc.html' },
    { view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-no-dlc.html' }
  ])('should not run if game has no dlc', async ({ view }) => {
    await setHtml(view);

    vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const allConcurrentlySpy = vi.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  test.concurrent.each([
    { view: '@ta-x-test-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html' },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html'
    }
  ])('should memoize fetch if all achievements status is not selected', async ({ view, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/2,611',
      dlcExpected: '0/1,150'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: '376/376'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: '376/376'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: undefined
    }
  ])(
    'should render trueachievement score correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
      const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        .innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/1,000',
      dlcExpected: '0/180'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: '195/195'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: '195/195'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: undefined
    }
  ])('should render gamerscore correctly if enabled', async ({ view, memoizedView, baseExpected, dlcExpected }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    const { baseGame, dlc } = getHeaders();
    const baseGameTrueAchievementScore = (baseGame.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)
      .innerText;
    const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)?.innerText;

    expect(baseGameTrueAchievementScore).toBe(baseExpected);
    expect(dlcTrueAchievementScore).toBe(dlcExpected);

    memoizeFetchSpy.mockRestore();
  });

  test.concurrent.each([
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/24',
      dlcExpected: '0/9'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: '7/7'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: '7/7'
    },
    {
      view: '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-test-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: undefined
    }
  ])('should render achievements correctly if enabled', async ({ view, memoizedView, baseExpected, dlcExpected }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    const { baseGame, dlc } = getHeaders();
    const baseGameTrueAchievementScore = (
      baseGame.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
    ).innerText;
    const dlcTrueAchievementScore = (
      dlc?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
    )?.innerText;

    expect(baseGameTrueAchievementScore).toBe(baseExpected);
    expect(dlcTrueAchievementScore).toBe(dlcExpected);

    memoizeFetchSpy.mockRestore();
  });
});
