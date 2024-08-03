import fs from 'fs';
import { dirname, } from 'path';
import Handlebars from 'handlebars';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { mangle } from 'marked-mangle';
import sanitizeHtml from 'sanitize-html';
import { url } from '../../package.json';
import { default as getPath } from '../helpers/get-path-by-alias';

export const includes = (): void => {
  const minifyJson = (json: string): string => {
    const parsedCondition = JSON.parse(json);
    return JSON.stringify(parsedCondition);
  }

  Handlebars.registerHelper('includes', (filePath: string, options) => {
    if (!filePath) {
      return;
    }

    const actualPath = getPath(filePath, options.data?.parentPartialDirectory);
    const includedFiles = fs.readFileSync(actualPath, 'utf8');
    const dom = new JSDOM(includedFiles);
    const domContent = dom.window.document.body.innerHTML || dom.window.document.head.innerHTML;
    const domTemplate = Handlebars.compile(domContent);

    if (options.hash['render-condition']) {
      options.hash['render-condition'] = minifyJson(options.hash['render-condition']);
    }

    if (options.hash['helper-render-condition']) {
      options.hash['helper-render-condition'] = minifyJson(options.hash['helper-render-condition']);
    }

    const customContext = {
      ...options.hash,
      partialContent: options.fn ? options.fn(this) : undefined
    };

    return new Handlebars.SafeString(
      domTemplate(customContext, { data: { parentPartialDirectory: dirname(actualPath) } })
    );
  });
};

export const markdown = (): void => {
  Handlebars.registerHelper('markdown', (filePath: string, render: boolean, wrapperClass: string, options) => {
    if (!filePath) {
      return;
    }

    marked.use({}, mangle());

    const actualPath = getPath(filePath, options.data?.parentPartialDirectory);
    const includedFiles = fs.readFileSync(actualPath, 'utf8');
    const htmlString = sanitizeHtml(marked.parse(includedFiles, { async: false }) as string);
    const dom = new JSDOM(`<div class="${wrapperClass}">${htmlString}</div`);
    const domContent = dom.window.document.body;

    [...domContent.querySelectorAll('ul')].forEach((ul) => {
      [...ul.querySelectorAll('li')].forEach(
        (el) => (el.innerHTML = `<span class="ta-x-markdown-marker">➤</span><p>${el.innerHTML}</p>`)
      );
    });

    if (render) {
      const domTemplate = Handlebars.compile(domContent.innerHTML);

      return new Handlebars.SafeString(
        domTemplate(options.hash, { data: { parentPartialDirectory: dirname(actualPath) } })
      );
    } else {
      options.data.root.markdown = domContent.outerHTML;
    }
  });
};

export const changelog = (): void => {
  Handlebars.registerHelper('changelog', (_, options) => {
    const dom = new JSDOM(options.data.root.markdown);
    const changelogDocument = dom.window.document;
    const wrapperBody = changelogDocument.body.firstElementChild;
    const changelogElement = wrapperBody.querySelector('ul');

    while (changelogElement.nextElementSibling) {
      wrapperBody.removeChild(changelogElement.nextElementSibling);
    }

    const changelogLink = changelogDocument.createElement('a');
    changelogLink.classList.add('ta-x-settings-menu-changelog-link');
    changelogLink.href = `${url}/blob/main/CHANGELOG.md`;
    changelogLink.textContent = 'See the full changelog here';

    wrapperBody.appendChild(changelogLink);
    const domTemplate = Handlebars.compile(changelogDocument.body.innerHTML);

    return new Handlebars.SafeString(domTemplate(options.hash));
  });
};

export default { includes, markdown, changelog };
