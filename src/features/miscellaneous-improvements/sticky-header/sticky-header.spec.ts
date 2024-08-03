import { setHtml } from '@ta-x-test';
import { Constants, stickyHeader as config } from '@ta-x-globals';
import stickyHeader from '.';

describe('sticky-header', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);

    await stickyHeader();

    expect(document.body.classList.contains(Constants.Styles.StickyHeader.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StickyHeader.featureStyle)).toBe(false);
  });
});
