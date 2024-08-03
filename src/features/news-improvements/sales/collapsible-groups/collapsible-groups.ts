import { newsImprovements } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { AccordionStyles, AccordionAttributes } from '@ta-x-components';
import html from './collapsible-groups.hbs';
import styles from './styles';

const applyBody = (index: number): HTMLElement => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  parsedDocument.body
    .querySelector(`.${AccordionStyles.jsAccordion}`)
    .setAttribute(AccordionAttributes.accordionTarget, `.${styles.jsCollapsibleGroupsGrouping}-${index}`);
  
  return parsedDocument.body.firstElementChild as HTMLElement;
};

const applyCollapsibleGroups = async (): Promise<void> => {
  const saleTables = [...document.querySelectorAll('table.sale')] as HTMLElement[];

  await allConcurrently(
    'CollapsibleGroups',
    saleTables.map((saleTable: HTMLElement) => ({
      name: 'collapsible-groups',
      task: async (index: number): Promise<void> => {
        let header = applyBody(index);
        const parentElement = saleTable.parentElement;
        header = parentElement.parentNode.insertBefore(header, parentElement);

        let currentElement = header.previousElementSibling;
        header.firstChild.appendChild(currentElement);

        while (
          currentElement && currentElement.matches('h2, h3')
        ) {
          const previousElement = header.previousElementSibling as HTMLElement;
          header.firstChild.insertBefore(currentElement, header.firstChild.firstChild);
          currentElement = previousElement;
        }

        const accordionContent = document.createElement('div');
        accordionContent.className = `${AccordionStyles.accordionContent} ${styles.jsCollapsibleGroupsGrouping}-${index}`;

        parentElement.parentNode.insertBefore(accordionContent, parentElement);
        accordionContent.appendChild(parentElement);
      }
    }))
  );
};

export default async (): Promise<void> => {
  if (!newsImprovements.sales.collapsibleGroups) {
    return;
  }

  const salesTable = await waitForElement('.newsitem .sale [data-sort]');
  if (!salesTable) {
    return;
  }

  await waitForElement('.author');

  await applyCollapsibleGroups();
};
