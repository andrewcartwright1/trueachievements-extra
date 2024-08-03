import { pubSub } from '@ta-x-components';
import { toBool } from '@ta-x-utilities';
import showSvg from '@ta-x-svgs/show.hbs';
import hideSvg from '@ta-x-svgs/hide.hbs';
import styles from './styles';
import attributes from './attributes';

export const hideableRow = async (): Promise<void> => {
  const createIcon = (icon: string, classes: string[]): HTMLElement => {
    const parsedSvgDocument = new DOMParser()
      .parseFromString(icon, 'text/html')
      .body.firstElementChild.cloneNode(true) as HTMLElement;

    parsedSvgDocument.classList.add(...classes);

    return parsedSvgDocument;
  };

  const createVisibilityElement = (): HTMLDivElement => {
    const el = document.createElement('div') as HTMLDivElement;
    el.classList.add(styles.jsHideableRow, styles.hideableRow);
    el.appendChild(createIcon(showSvg, [styles.jsShowIcon, styles.showIcon]));
    el.appendChild(createIcon(hideSvg, [styles.jsHideIcon, styles.hideIcon]));

    return el;
  };

    const createFilterTextElement = (filterText: string): HTMLParagraphElement => {
      const filterTextElement = document.createElement('p') as HTMLParagraphElement;
      filterTextElement.classList.add(styles.filterText);
      filterTextElement.innerText = filterText;

      return filterTextElement;
    };

  const hideTableElement = (element: HTMLElement, filterText: string) => {
    const row = element.closest('tr') as HTMLTableRowElement;
    row.setAttribute(attributes.rowHidden, 'true');
    row.lastElementChild.appendChild(createVisibilityElement());
    
    if (filterText) {
      const cell = element.closest('td') as HTMLTableCellElement;
      cell.appendChild(createFilterTextElement(filterText));
    }
  };

  const hideForumElement = (element: HTMLElement, filterText: string) => {
    element.closest('div').appendChild(createFilterTextElement(filterText));
    
    const li = element.closest('li') as HTMLLIElement;
    li.setAttribute(attributes.rowHidden, 'true');
    li.lastElementChild.appendChild(createVisibilityElement());
  };

  document.addEventListener('click', (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    if (!e.target.classList.contains(styles.jsHideableRow)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const el = e.target.closest(`[${attributes.rowHidden}]`) as HTMLElement;
    const currentValue = toBool(el.getAttribute(attributes.rowHidden));
    el.setAttribute(attributes.rowHidden, (!currentValue).toString());
  });

  pubSub.subscribe('hideableRow:hide', ({ element, method, filterText }) => {
    switch(method) {
      case 'forum':
        hideForumElement(element, filterText);
        break;
      case 'table':
        hideTableElement(element, filterText);
        break;
    }
  });
};

export default hideableRow;
