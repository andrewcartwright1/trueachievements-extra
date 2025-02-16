import { pubSub } from '@ta-x-components';
import { Constants } from '@ta-x-globals';
import { getElementCoordinates, waitForElement } from '@ta-x-utilities';

let tinymceToolbar: HTMLElement;
const variableProperty =
  Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu;

const setTopPosition = (): void => {
  const actualTopPosition = getElementCoordinates(tinymceToolbar);

  document.documentElement.style.setProperty(
    variableProperty,
    `${tinymceToolbar.offsetHeight + actualTopPosition.top}px`
  );
};

const listen = async (): Promise<void> => {
  const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;

  iframe.addEventListener('load', () => {
    setTopPosition();

    window.addEventListener('scroll', setTopPosition);
    pubSub.subscribe('tinymce:repositionFloatingMenus', setTopPosition);
    iframe.removeEventListener('load', this);
  });
};

export const fixFloatingMenus = async (container: HTMLElement): Promise<void> => {
  tinymceToolbar = await waitForElement('.mce-container-body .mce-toolbar-grp', container);

  if (!tinymceToolbar) {
    return;
  }

  await listen();
};

export default { fixFloatingMenus };
