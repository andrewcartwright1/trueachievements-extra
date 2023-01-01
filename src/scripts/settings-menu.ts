import * as fs from 'fs';
import { log } from 'missionlog';
import { Constants } from '@ta-x-globals';
import { ConditionalRender } from '@ta-x-models';
import { waitForElement } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import config from '../config';

// Elements -------
let extensionBody: HTMLElement;
let extensionTrigger: HTMLElement;

const isSelectElement = (el: HTMLElement): boolean => el.nodeName === 'SELECT';
const isCheckboxElement = (el: HTMLElement): boolean => el.nodeName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';

const applyBody = async(): Promise<void> => {
  log.debug('Settings-Menu', 'Starting - applyBody');

  const html = fs.readFileSync('./src/views/settings-menu.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling);

  extensionTrigger = document.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`);

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);

  ([...extensionBody.querySelectorAll('input, select')] as HTMLElement[]).forEach(setting => {
    const configObject = setting.dataset.configArea;
    const configSettings = setting.dataset.configSetting;

    if (!configObject || !configSettings) return;
    if (isCheckboxElement(setting)) (setting as HTMLInputElement).checked = config[configObject][configSettings];
    else if (isSelectElement(setting)) (setting as HTMLSelectElement).value = config[configObject][configSettings];
  });

  ([...extensionBody.querySelectorAll('[data-render-condition]')] as HTMLElement[]).forEach(hiddenSetting => {
    const condition = new ConditionalRender(hiddenSetting.dataset.renderCondition);

    if (!condition.isValid()) return;

    const settingInput = document.querySelector(condition.selector) as HTMLInputElement;

    if (settingInput.type === 'checkbox') {
      hiddenSetting.classList[(settingInput.checked === condition.value)
        ? 'remove'
        : 'add'](Constants.Styles.Base.hide);
    }
  });

  log.debug('Settings-Menu', 'Finished - applyBody');
};

const listen = (): void => {
  log.debug('Settings-Menu', 'Starting - listen');

  extensionTrigger.addEventListener('click', () => {
    extensionTrigger.classList.add('active');
    extensionBody.classList.add('nav-gamer');
    extensionBody.classList.remove(Constants.Styles.Base.hide);
    extensionBody.classList.add('open');
  });

  extensionBody.addEventListener('click', ({ target }) => {
    if (!(target as HTMLElement)?.classList.contains(Constants.Styles.SettingsMenu.closeJs)) return;

    extensionBody.classList.remove('open');
    extensionBody.classList.add(Constants.Styles.Base.hide);
    extensionBody.classList.remove('nav-gamer');
    extensionTrigger.classList.remove('active');
  });

  extensionBody.addEventListener('change', ({ target }) => {
    const htmlTarget = target as HTMLElement;
    const inputTarget = target as HTMLInputElement;
    const configObject = htmlTarget?.dataset.configArea;
    const configSettings = htmlTarget?.dataset.configSetting;

    if (isSelectElement(htmlTarget)) config[configObject][configSettings] = (htmlTarget as HTMLSelectElement).value;
    else if (isCheckboxElement(htmlTarget)) config[configObject][configSettings] = inputTarget?.checked;

    ([...extensionBody.querySelectorAll(`[data-render-condition*="#${htmlTarget.id}"]`)] as HTMLElement[]).forEach(hiddenSetting => {
      const condition = new ConditionalRender(hiddenSetting.dataset.renderCondition);

      if (!condition.isValid()) return;

      if (inputTarget.type === 'checkbox') {
        hiddenSetting.classList[(inputTarget.checked === condition.value)
          ? 'remove'
          : 'add'](Constants.Styles.Base.hide);
      }
    });
  });

  log.debug('Settings-Menu', 'Finished - listen');
};

export default async (): Promise<void> => {
  log.debug('Settings-Menu', 'Starting');
  
  await applyBody();
  listen();

  log.debug('Settings-Menu', 'Finished');
};
