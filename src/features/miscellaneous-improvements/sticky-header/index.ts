import { Constants, miscellaneousImprovements } from '@ta-x-globals';
import { toBool, waitForElement } from '@ta-x-utilities';

let extensionBody: HTMLElement;
let fakeElement: HTMLElement;
let previousScrollTop: number;
let previousMenuOpen: boolean;

const atTopOfPage = (): boolean => window.pageYOffset <= extensionBody.offsetTop;

const applyBody = async (): Promise<void> => {
  extensionBody = await waitForElement('header');

  fakeElement = document.createElement('div');
  fakeElement.style.height = `${extensionBody.offsetHeight}px`;

  extensionBody.parentNode.insertBefore(fakeElement, extensionBody);
  extensionBody.classList.add(Constants.Styles.StickyHeader.featureJs, Constants.Styles.StickyHeader.featureStyle);

  document.documentElement.style.setProperty(
    Constants.Styles.Variables.StickyHeader.height,
    `${extensionBody.offsetHeight}px`
  );

  if (!miscellaneousImprovements.stickyHeader.remainStuck && !atTopOfPage()) {
    extensionBody.classList.add(Constants.Styles.Animations.yHideNoTransition);
  }
};

const listen = async (): Promise<void> => {
  if (miscellaneousImprovements.stickyHeader.remainStuck) {
    return;
  }

  const navGamer = await waitForElement(`.nav-gamer:not(.${Constants.Styles.SettingsMenu.featureJs})`);
  const taxSettingsMenu = await waitForElement(`.${Constants.Styles.SettingsMenu.featureJs}`);
  previousMenuOpen = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');

  window.addEventListener('scroll', () => {
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (atTopOfPage()) {
      extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
    } else {
      const searchElement = extensionBody.querySelector('#divtxtSearchContainer') as HTMLElement;

      if (searchElement.style.display !== 'inline' && !toBool(extensionBody.dataset.menuOpen)) {
        if (previousScrollTop > currentScrollTop) {
          extensionBody.classList.remove(
            Constants.Styles.Animations.yHide,
            Constants.Styles.Animations.yHideNoTransition
          );
          extensionBody.classList.add(Constants.Styles.Animations.yShow);
        } else if (previousScrollTop < currentScrollTop) {
          extensionBody.classList.remove(Constants.Styles.Animations.yShow);
          extensionBody.classList.add(Constants.Styles.Animations.yHide);
        }
      }
    }

    previousScrollTop = currentScrollTop;
  });

  window.addEventListener('resize', () => {
    if (fakeElement.style.height !== `${extensionBody.offsetHeight}px`) {
      fakeElement.style.height = `${extensionBody.offsetHeight}px`;
    }
  });

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach(({ target, attributeName }) => {
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (attributeName === 'class') {
        const currentMenuOpen = target.classList.contains('open');

        if (previousMenuOpen !== currentMenuOpen) {
          previousMenuOpen = currentMenuOpen;
          extensionBody.setAttribute('data-menu-open', currentMenuOpen.toString());
        }
      }
    });
  });

  observer.observe(navGamer, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  observer.observe(taxSettingsMenu, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });
};

export default async (): Promise<void> => {
  if (!miscellaneousImprovements.stickyHeader.enabled) {
    return;
  }

  await applyBody();
  await listen();
};
