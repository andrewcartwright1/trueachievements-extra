import fs from 'fs';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-test';
import { gameDLC as config, GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import { individualProgress } from './individual-progress';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));
vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('games-improvements/dlc/individual-progress', () => {
  const getHeaders = () => ({
    baseGame: document.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement,
    dlc: document.querySelector('.pnl-hd.dlc.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') as HTMLElement
  });

  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(false);
    const allConcurrentlySpy = vi.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  test('should not run if enabled and not on dlc page', async () => {
    vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(true);
    const allConcurrentlySpy = vi.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  test.each([
    { view: '@ta-x-test-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html' },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html'
    }
  ])('should memoize fetch if all achievements status is not selected', async ({ view, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/424'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    }
  ])(
    'should render trueachievement score correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
      vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
      const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/240'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    }
  ])('should render gamerscore correctly if enabled', async ({ view, memoizedView, baseExpected, dlcExpected }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    const { baseGame, dlc } = getHeaders();
    const baseGameTrueAchievementScore = (baseGame?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)
      ?.innerText;
    const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)?.innerText;

    expect(baseGameTrueAchievementScore).toBe(baseExpected);
    expect(dlcTrueAchievementScore).toBe(dlcExpected);

    memoizeFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/10'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    },
    {
      view: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-test-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    }
  ])('should render achievements correctly if enabled', async ({ view, memoizedView, baseExpected, dlcExpected }) => {
    await setHtml(view);
    createInnerTextSpies();

    vi.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView || view), 'utf8'));

    await individualProgress();

    const { baseGame, dlc } = getHeaders();
    const baseGameTrueAchievementScore = (
      baseGame?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
    )?.innerText;
    const dlcTrueAchievementScore = (
      dlc?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
    )?.innerText;

    expect(baseGameTrueAchievementScore).toBe(baseExpected);
    expect(dlcTrueAchievementScore).toBe(dlcExpected);

    memoizeFetchSpy.mockRestore();
  });
});
