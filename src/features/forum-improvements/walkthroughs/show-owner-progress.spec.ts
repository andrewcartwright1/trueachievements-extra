import fs from 'fs';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-test';
import { Cache, Constants, ForumRegex, forumImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import showOwnerProgress from './show-owner-progress';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));
vi.mock('@ta-x-helpers', async () => await vi.importActual('@ta-x-helpers'));

describe('forum-improvements/walkthroughs/show-owner-progress', () => {
  const createTitleElement = (title: string): HTMLElement => {
    const titleElement = document.createElement('p');
    const node = document.createTextNode(title);
    titleElement.appendChild(node);

    return titleElement;
  };

  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(false);
    const walkthroughForumOwnerProgressUrlSpy = vi.spyOn(Cache, 'walkthroughForumOwnerProgressUrl', 'get');

    await showOwnerProgress();

    expect(walkthroughForumOwnerProgressUrlSpy).not.toHaveBeenCalled();
    walkthroughForumOwnerProgressUrlSpy.mockRestore();
  });

  test('should not run if not on a thread with a thread id', async () => {
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(false);
    const walkthroughForumOwnerProgressUrlSpy = vi.spyOn(Cache, 'walkthroughForumOwnerProgressUrl', 'get');

    await showOwnerProgress();

    expect(walkthroughForumOwnerProgressUrlSpy).not.toHaveBeenCalled();
    walkthroughForumOwnerProgressUrlSpy.mockRestore();
  });

  test('should not run if page title heading does not load', async () => {
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const walkthroughForumOwnerProgressUrlSpy = vi.spyOn(Cache, 'walkthroughForumOwnerProgressUrl', 'get');

    await showOwnerProgress();

    expect(walkthroughForumOwnerProgressUrlSpy).not.toHaveBeenCalled();
    walkthroughForumOwnerProgressUrlSpy.mockRestore();
  });

  test('should not run if page title heading is not walkthroughs', async () => {
    const titleElement = createTitleElement('Not the right title');

    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const walkthroughForumOwnerProgressUrlSpy = vi.spyOn(Cache, 'walkthroughForumOwnerProgressUrl', 'get');

    await showOwnerProgress();

    expect(walkthroughForumOwnerProgressUrlSpy).not.toHaveBeenCalled();
    walkthroughForumOwnerProgressUrlSpy.mockRestore();
  });

  test('should run if page title heading is walkthroughs', async () => {
    const titleElement = createTitleElement('Walkthroughs');

    await setHtml(
      '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-no-link-first-message.html',
      { url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321' }
    );
    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const walkthroughForumOwnerProgressUrlSpy = vi.spyOn(Cache, 'walkthroughForumOwnerProgressUrl', 'get');

    await showOwnerProgress();

    expect(walkthroughForumOwnerProgressUrlSpy).toHaveBeenCalled();
    walkthroughForumOwnerProgressUrlSpy.mockRestore();
  });

  test('should ask for url if no url is configured', async () => {
    const titleElement = createTitleElement('Walkthroughs');

    await setHtml(
      '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-no-link-first-message.html',
      { url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321' }
    );
    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);

    await showOwnerProgress();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
  });

  test.each([
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-no-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321',
      inputValue: ''
    },
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-no-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321',
      inputValue: 'invalid-url'
    }
  ])('should ignore invalid urls when url is asked for', async ({ view, inputValue, url }) => {
    const titleElement = createTitleElement('Walkthroughs');

    await setHtml(view, { url });
    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');

    await showOwnerProgress();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeFetchSpy).not.toHaveBeenCalled();

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
    expect(memoizeFetchSpy).not.toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-no-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321',
      inputValue: 'https://www.trueachievements.com/game/Crash-Bandicoot-N-Sane-Trilogy/walkthrough',
      memoizedView:
        '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/crash-bandicoot-n-sane-trilogy.html',
      expectedClass: '.walthroughprogress'
    },
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-published-no-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1028321',
      inputValue: 'https://www.trueachievements.com/game/Jumper/walkthrough',
      memoizedView: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/jumper-griffins-story.html',
      expectedClass: '.thanks'
    }
  ])('should fetch valid url when url is asked for', async ({ view, url, inputValue, memoizedView, expectedClass }) => {
    const titleElement = createTitleElement('Walkthroughs');

    await setHtml(view, { url });
    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await showOwnerProgress();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`
    );

    expect(extensionBody.classList.contains(Constants.Styles.Base.hide)).toBe(false);
    expect(extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`)).not.toBe(null);
    expect(memoizeFetchSpy).not.toHaveBeenCalled();

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

    await taxHelpers.wait(1);

    expect(memoizeFetchSpy).toHaveBeenCalled();

    const walkthroughProgress = extensionBody.querySelector(expectedClass);

    expect(walkthroughProgress).not.toBe(null);
    expect((walkthroughProgress.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeFetchSpy.mockRestore();
  });

  test.each([
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-not-published-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1513751',
      memoizedView: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/paper-ghost-stories-7pm.html',
      expectedClass: '.walthroughprogress'
    },
    {
      view: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/walkthrough-published-link-first-message.html',
      url: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1416296',
      memoizedView: '@ta-x-test-views/forum-improvements/walkthroughs/show-owner-progress/digimon-survive.html',
      expectedClass: '.thanks'
    }
  ])('should fetch valid url when url is found for', async ({ view, url, memoizedView, expectedClass }) => {
    const titleElement = createTitleElement('Walkthroughs');

    await setHtml(view, { url });
    createInnerTextSpies();
    vi.spyOn(config.walkthroughs, 'showOwnerProgress', 'get').mockReturnValueOnce(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);

    const memoizeFetchSpy = vi.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(fs.readFileSync(getPath(memoizedView), 'utf8'));

    await showOwnerProgress();

    const extensionBody = document.querySelector(
      `.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`
    );

    expect(memoizeFetchSpy).toHaveBeenCalled();

    const walkthroughElement = extensionBody.querySelector(expectedClass);

    expect(walkthroughElement).not.toBe(null);
    expect((walkthroughElement.querySelector('.body') as HTMLElement)?.innerText).not.toBe('');

    memoizeFetchSpy.mockRestore();
  });
});
