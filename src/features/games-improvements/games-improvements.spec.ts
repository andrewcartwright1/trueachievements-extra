import { setHtml } from '@ta-x-test';
import { gamesImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import gamesImprovements from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await gamesImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if enabled', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await gamesImprovements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
