import { setHtml } from '@ta-x-test';
import { Constants, StaffRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import staffWalkthroughImprovements from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('staff-walkthrough-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on a staff walkthrough page', async () => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on a staff walkthrough page and body has not loaded', async () => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on a staff walkthrough page and body has loaded', async () => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(true);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
