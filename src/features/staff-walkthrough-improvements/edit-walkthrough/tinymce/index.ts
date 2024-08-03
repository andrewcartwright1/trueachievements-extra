import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { addToggleThemeButton } from './toggle-theme-button';
import { setFullWidthToolbar } from './set-fullwidth-toolbar';
import { fixFloatingMenus } from './fix-floating-menus';
import { addSourceCodeButton } from './source-code-button';
import { addTextColorButtons } from './text-color-buttons';
import { appendColorPicker } from './append-color-picker';
import { addInsertXboxImageButton } from './insert-xbox-images';
import { addControllerButtonsButton } from './add-controller-buttons';

const createButtonGroup = async () => {
  const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;
  const iframeLoadHandler = () => {
    const script = document.createElement('script');
    script.id = 'ta-x-staff-walkthrough-improvements-tinymce-button-grup';
    script.innerHTML = `
    ((editor) => {
      console.debug('Creating TA-X TinyMCE Group');

      var taxGroup = tinymce.ui.Factory.create({
        type: 'buttongroup',
        name: 'ta-x-group',
        items: []
      });

      taxGroup.addClass('ta-x-tinymce-group');

      editor.theme.panel.find('toolbar')[1].append(taxGroup);
      
      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.renderTo();

      console.debug('Created TA-X TinyMCE Group');
    })(tinymce.activeEditor);
  `;

    document.body.appendChild(script);
    iframe.removeEventListener('load', iframeLoadHandler);
  };

  iframe.addEventListener('load', iframeLoadHandler);
};

export const tinymce = async (): Promise<void> => {
  if (!(await waitForElement('[href*="skin.min.css"]', document.head))) {
    return;
  }

  const container = await waitForElement('.mce-tinymce');
  if (!container) {
    return;
  }

  allConcurrently('Edit Walkthrough', [
    { name: 'tinymce-set-full-width-toolbar', task: async (): Promise<void> => await setFullWidthToolbar(container) },
    { name: 'tinymce-add-fix-floating-menus', task: async (): Promise<void> => await fixFloatingMenus(container) },
    { name: 'tinymce-append-color-picker', task: appendColorPicker }
  ]);

  allConcurrently('Edit Walkthrough - TinyMCE Buttons', [
    { name: 'tinymce-create-button-group', task: createButtonGroup },
    { name: 'tinymce-add-toggle-theme-button', task: addTextColorButtons },
    { name: 'tinymce-add-source-code-button', task: addSourceCodeButton },
    { name: 'tinymce-add-toggle-theme-button', task: addToggleThemeButton },
    { name: 'tinymce-add-insert-xbox-image-button', task: addInsertXboxImageButton },
    { name: 'tinymce-add-controller-buttons-button', task: addControllerButtonsButton }
  ]);
};

export default { tinymce };
