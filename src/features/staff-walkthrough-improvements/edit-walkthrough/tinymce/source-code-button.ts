import { TinyMCEScript } from '@ta-x-models';
import svg from '@ta-x-svgs/code.hbs';
import { waitForElement } from '@ta-x-utilities';

class SourceCodeScript extends TinyMCEScript {
  constructor() {
    super('ta-x-staff-walkthrough-improvements-add-code-editor-command');
  }

  buildScript = (): HTMLScriptElement => {
    const script = `
    ((editor) => {
      console.debug('Adding Source Code Button');

      editor.addButton('sourceCode', {
        tooltip: 'Source Code',
        onclick: function () {
          var dialog = editor.windowManager.open({
            title: 'Source code',
            body: {
              type: 'textbox',
              name: 'code',
              multiline: true,
              minWidth: editor.getParam('code_dialog_width', 600),
              minHeight: editor.getParam('code_dialog_height', Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
              spellcheck: false,
              style: 'direction: ltr; text-align: left'
            },
            onSubmit: function (dialog) {
              editor.focus();
              editor.undoManager.transact(function () {
                editor.setContent(dialog.data.code);
              });
              editor.selection.setCursorLocation();
              editor.nodeChanged();
            }
          });

          dialog.find('#code').value(editor.getContent({ source_view: true }));
        }
      });

      var sourceCodeButton = editor.buttons['sourceCode'];
      var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg.settings.name === 'ta-x-group';
      })[0];

      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.append(sourceCodeButton);

      const button = document.querySelector('[aria-label="Source Code"] button');
      button.classList.add('ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button');

      console.debug('Added Source Code Button');
    })(tinymce.activeEditor);
  `;

    return this.createScript(script);
  };

  afterScript = async (): Promise<void> => {
    const button = await waitForElement('.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button');
    button.innerHTML = svg;
  }
}

export const addSourceCodeButton = new SourceCodeScript().injectScript;
