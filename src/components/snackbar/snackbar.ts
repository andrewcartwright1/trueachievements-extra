import { waitForElement } from '@ta-x-utilities';
import html from '@ta-x-views/components/snackbar.html';
import pubSub from '../pub-sub';
import styles from './styles';

export const snackbar = async (): Promise<void> => {
  if (!(await waitForElement('body'))) {
    return;
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  document.body.appendChild(parsedDocument.querySelector(`.${styles.jsSnackbar}`));

  const snackbar = document.querySelector(`.${styles.jsSnackbar}`) as HTMLElement;
  const textContainer = snackbar.querySelector('h2');

  pubSub.subscribe('snackbar:show', ({ text, type, timeoutMS = 3000 }) => {
    if (!snackbar) {
      return;
    }
    
    textContainer.innerHTML = text;
    textContainer.classList.add(type);
    snackbar.classList.toggle(styles.showSnackbar);

    setTimeout(() => {
      snackbar.classList.toggle(styles.showSnackbar);
      textContainer.classList.remove(type);
    }, timeoutMS);
  });
};

export default snackbar;
