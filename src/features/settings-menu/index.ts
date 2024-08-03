import { Constants, config } from '@ta-x-globals';
import { ConditionalRender, ListSetting } from '@ta-x-models';
import {
  waitForElement,
  getValue,
  isCheckboxElement,
  isSelectElement,
  setValue,
  toBool,
  isTAXChildListElement
} from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import html from './body.hbs';

// Elements -------
let extensionBody: HTMLElement;

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(
    parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling
  );

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  addSettings();
};

const addSettings = (): void => {
  extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);

  ([...extensionBody.querySelectorAll('input, select')] as HTMLElement[]).forEach((setting) => {
    const configPath = setting.getAttribute('data-config-path');

    if (!configPath) {
      return;
    }
    if (isCheckboxElement(setting)) {
      (setting as HTMLInputElement).checked = getValue(config, configPath, false);
    } else if (isSelectElement(setting)) {
      if (toBool(setting.getAttribute('data-is-array'))) {
        (setting as HTMLSelectElement).value = getValue<string[]>(config, configPath, []).join(
          setting.getAttribute('data-array-split')
        );
      } else {
        (setting as HTMLSelectElement).value = getValue(config, configPath, '');
      }
    } else if (isTAXChildListElement(setting)) {
      const listElement = new ListSetting(setting);
      let values: string[];

      if (toBool(setting.getAttribute('data-is-array'))) {
        values = getValue<string[]>(config, configPath, []);
      } else {
        values = [getValue(config, configPath, '')];
      }

      values.forEach((value) => {
        listElement.list.appendChild(createListElement(listElement, value));
      });
    }
  });

  checkRenderConditions();
};

const checkRenderConditions = (el?: HTMLElement): void => {
  const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';

  ([...extensionBody.querySelectorAll(querySelector)] as HTMLElement[]).forEach((hiddenSetting) => {
    const condition = ConditionalRender.fromString(hiddenSetting.getAttribute('data-render-condition'));
    const method = condition?.test(extensionBody);

    if (method) {
      hiddenSetting.classList[method](Constants.Styles.Base.hide);
    }
  });
};

const createListElement = (listSetting: ListSetting, value: string): HTMLElement => {
  const templateListItem = listSetting.parent.querySelector(
    listSetting.parent.getAttribute('data-template-id')
  ) as HTMLTemplateElement;
  const templatedListItem = template(templateListItem.content.firstElementChild.cloneNode(true), {
    listSetting: {
      id: listSetting.listId,
      value: value
    }
  });

  return templatedListItem;
};

const listen = (): void => {
  const extensionTrigger = document.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`);

  extensionTrigger.addEventListener('click', (): void => {
    extensionTrigger.classList.add('active');
    extensionBody.classList.add('nav-gamer');
    extensionBody.classList.remove(Constants.Styles.Base.hide);
    extensionBody.classList.add('open');
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!isTAXChildListElement(target)) {
      return;
    }

    const listElement = new ListSetting(target);
    const configPath = (listElement.parent.querySelector('[data-config-path]') as HTMLElement).getAttribute(
      'data-config-path'
    );

    if (target.hasAttribute('data-add')) {
      if (listElement.input.value === '') {
        return;
      }

      listElement.list.appendChild(createListElement(listElement, listElement.input.value));
      listElement.input.value = '';
    } else if (target.hasAttribute('data-remove')) {
      listElement.list.removeChild(target.closest('li'));
    }

    setValue(
      config,
      configPath,
      ([...listElement.list.querySelectorAll('[data-value]')] as HTMLElement[]).map((val: HTMLElement) =>
        val.getAttribute('data-value')
      )
    );
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.classList.contains(Constants.Styles.SettingsMenu.closeJs)) {
      return;
    }

    extensionBody.classList.remove('open');
    extensionBody.classList.add(Constants.Styles.Base.hide);
    extensionBody.classList.remove('nav-gamer');
    extensionTrigger.classList.remove('active');
  });

  extensionBody.addEventListener('click', (ev: MouseEvent): void => {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (
      !target.classList.contains(Constants.Styles.SettingsMenu.versionLink) &&
      !target.classList.contains(Constants.Styles.SettingsMenu.documentationLink) &&
      !target.classList.contains(Constants.Styles.Components.Tab.tabLink)
    ) {
      return;
    }

    ev.preventDefault();

    const changelogView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.changelogView}`);
    const documentationView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.featureDocumentationView}`);
    const settingsView = extensionBody.querySelector('[data-previous-tab-visible], [data-tab-visible]');
    const currentView = extensionBody.querySelector('[data-tab-visible]');
    const nextView = target.classList.contains(Constants.Styles.SettingsMenu.versionLink)
      ? changelogView
      : documentationView;

    if (target.classList.contains(Constants.Styles.Components.Tab.tabLink)) {
      if (!settingsView.hasAttribute('data-previous-tab-visible')) {
        return;
      }

      currentView.removeAttribute('data-tab-visible');
      settingsView.removeAttribute('data-previous-tab-visible');
      settingsView.setAttribute('data-tab-visible', '');
      extensionBody.querySelector(`[data-tab-id="#${settingsView.id}"`).classList.add(Constants.Styles.Components.Tab.tabSelected);
    } else if (currentView === nextView) {
      nextView.removeAttribute('data-tab-visible');
      settingsView.removeAttribute('data-previous-tab-visible');
      settingsView.setAttribute('data-tab-visible', '');
      extensionBody.querySelector(`[data-tab-id="#${settingsView.id}"`).classList.add(Constants.Styles.Components.Tab.tabSelected);
    } else {
      if (!settingsView.hasAttribute('data-previous-tab-visible')) {
        settingsView.setAttribute('data-previous-tab-visible', '');
        extensionBody.querySelector(`[data-tab-id="#${settingsView.id}"`).classList.remove(Constants.Styles.Components.Tab.tabSelected);
      }

      currentView.removeAttribute('data-tab-visible');
      nextView.setAttribute('data-tab-visible', '');
    }
  });

  extensionBody.addEventListener('change', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const configPath = target.getAttribute('data-config-path');

    if (isSelectElement(target)) {
      if (toBool(target.getAttribute('data-is-array'))) {
        setValue(
          config,
          configPath,
          (target as HTMLSelectElement).value.split(target.getAttribute('data-array-split'))
        );
      } else {
        setValue(config, configPath, (target as HTMLSelectElement).value);
      }
    } else if (isCheckboxElement(target)) {
      setValue(config, configPath, (target as HTMLInputElement).checked);
    }

    checkRenderConditions(target);
  });
};

export default async (): Promise<void> => {
  await applyBody();
  listen();
};
