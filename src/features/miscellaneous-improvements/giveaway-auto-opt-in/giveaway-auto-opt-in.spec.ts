import { setHtml } from '@ta-x-test';
import { miscellaneousImprovements as config } from '@ta-x-globals';
import * as taxHelpers from '@ta-x-helpers';
import giveawayAutoOptIn from '.';
import { getPath } from '@ta-x-build-helpers';
import fs from 'fs';

vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('giveaway-auto-opt-in', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'giveawayAutoOptIn', 'get').mockReturnValueOnce(false);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    
    await giveawayAutoOptIn();

    expect(memoizeFetchSpy).not.toHaveBeenCalled();
  });

  test('should not opt in no competition', async () => {
    vi.spyOn(config, 'giveawayAutoOptIn', 'get').mockReturnValueOnce(true);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath('@ta-x-test-views/miscellaneous-improvements/giveaway-auto-opt-in/no-competition.html'), 'utf8'));

    await giveawayAutoOptIn();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  test('should not opt in if already entered competition', async () => {
    vi.spyOn(config, 'giveawayAutoOptIn', 'get').mockReturnValueOnce(true);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath('@ta-x-test-views/miscellaneous-improvements/giveaway-auto-opt-in/entered-competition.html'), 'utf8'));

    await giveawayAutoOptIn();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  test('should opt in if not already entered competition', async () => {
    vi.spyOn(config, 'giveawayAutoOptIn', 'get').mockReturnValueOnce(true);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath('@ta-x-test-views/miscellaneous-improvements/giveaway-auto-opt-in/active-competition.html'), 'utf8'));

    const fetchSpy = vi.spyOn(taxHelpers, 'fetch');
    fetchSpy.mockResolvedValueOnce(new Response(fs.readFileSync(getPath('@ta-x-test-views/miscellaneous-improvements/giveaway-auto-opt-in/entered-competition.html'), 'utf8'), { status: 200 }));

    await giveawayAutoOptIn();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();

    expect(fetchSpy).toHaveBeenCalled();

    fetchSpy.mockRestore();
  });
});
