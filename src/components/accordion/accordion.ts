import { until } from '@ta-x-helpers';
import { waitForElement } from '@ta-x-utilities';
import styles from './styles'
import attributes from './attributes';

const getAccordionContent = async (target: HTMLElement): Promise<HTMLElement> => {
  const targetSelector = target.getAttribute(attributes.accordionTarget);
  const content = document.querySelector(targetSelector) as HTMLElement;

  if (!content.style.maxHeight) {
    content.style.maxHeight = `${content.scrollHeight}px`;

    await until(() => content.style.maxHeight === `${content.scrollHeight}px`, 1000);
  }
    
  return content;
}

export const accordion = async (): Promise<void> => {
  document.addEventListener('click', async ({ target }): Promise<void> => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.classList.contains(styles.jsAccordion)) {
      return;
    }

    target.classList.toggle('expanded');

    const content = await getAccordionContent(target);
    content.style.maxHeight !== '0px'
      ? (content.style.maxHeight = '0px')
      : (content.style.maxHeight = `${content.scrollHeight}px`);
  });

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }

      if (mutation.type === 'childList') {
        if ((!mutation.addedNodes || mutation.addedNodes.length === 0) && (!mutation.removedNodes || mutation.removedNodes.length === 0)) {
          return;
        }
      } else if (mutation.type !== 'attributes') {
        return;
      }

      const content = mutation.target.closest(`.${styles.jsAccordionContent}`) as HTMLElement;
      if (!content) {
        return;
      }

      content.style.maxHeight = `${content.scrollHeight}px`;
    });
  });

  await waitForElement('body');

  observer.observe(document.body, {
    attributes: true,
    attributeFilter : ['class'],
    childList: true,
    subtree: true
  });
};

export default accordion
