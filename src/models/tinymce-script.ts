import { waitForElement } from '@ta-x-utilities';

export class TinyMCEScript {
  private id: string;

  public constructor(id: string) {
    this.id = id;
  }

  createScript = (innerHtml: string): HTMLScriptElement => {
    const script = document.createElement('script');
    script.id = this.id;
    script.innerHTML = innerHtml;

    return script;
  };

  buildScript = (): HTMLScriptElement | Promise<HTMLScriptElement> => {
    throw 'Not Implemented';
  };

  afterScript = async (): Promise<void> => {
  };

  injectScript = async (): Promise<void> => {
    await waitForElement('.mce-ta-x-tinymce-group');
    document.body.appendChild(await this.buildScript());
    await this.afterScript();
  };
}
