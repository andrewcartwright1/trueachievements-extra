export const isSelectElement = (el: HTMLElement): boolean => el.nodeName === 'SELECT';
export const isCheckboxElement = (el: HTMLElement): boolean =>
  el.nodeName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';

export const classListContains = (element: HTMLElement, classes: string | string[]): boolean => {
  const classArray = Array.isArray(classes) ? classes : [classes];
  return classArray.some((className: string) => element.classList.contains(className));
};

export const waitForElement = (
  selector: string,
  element: Document | HTMLElement | Element = document.documentElement,
  timeoutMS = 10000
): Promise<HTMLElement> =>
  new Promise((resolve) => {
    if (!element) {
      return resolve(null);
    }

    const foundElement = element.querySelector(selector);
    if (foundElement) {
      return resolve(foundElement as HTMLElement);
    }

    let observer: MutationObserver;

    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMS);

    observer = new MutationObserver(() => {
      const foundElement = element.querySelector(selector);
      if (foundElement) {
        observer.disconnect();
        clearTimeout(timeout);
        resolve(foundElement as HTMLElement);
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });
  });

export const waitForElements = (
  selector: string,
  element: Document | HTMLElement | Element = document.documentElement,
  timeoutMS = 10000
): Promise<HTMLElement[]> =>
  new Promise((resolve) => {
    if (!element) {
      return resolve(null);
    }

    const elements = element.querySelectorAll(selector);
    if (elements.length > 0) {
      return resolve(Array.from(elements) as HTMLElement[]);
    }

    let observer: MutationObserver;

    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMS);

    observer = new MutationObserver(() => {
      const elements = element.querySelectorAll(selector);
      if (elements.length > 0) {
        observer.disconnect();
        clearTimeout(timeout);
        resolve(Array.from(elements) as HTMLElement[]);
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });
  });

export const getElementCoordinates = (element: HTMLElement): { top: number; left: number } => {
  const box = element.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
};

export const removeAllChildren = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};

export const waitForImages = (el: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    const allImgs: { src: string; element: HTMLImageElement }[] = [];
    const filtered = ([...el.querySelectorAll('img')] as HTMLImageElement[]).filter((imgEl: HTMLImageElement) => {
      if (imgEl.src === '') {
        return false;
      }

      const img = new Image();
      img.src = imgEl.src;
      return !img.complete;
    });

    filtered.forEach((item: HTMLImageElement) => {
      allImgs.push({
        src: item.src,
        element: item
      });
    });

    const allImgsLength = allImgs.length;
    let allImgsLoaded = 0;

    if (allImgsLength === 0) {
      resolve();
    }

    allImgs.forEach((img) => {
      const image = new Image();
      const resolveIfLoaded = () => {
        allImgsLoaded++;

        if (allImgsLoaded === allImgsLength) {
          resolve();
        }
      };

      image.addEventListener('load', resolveIfLoaded);
      image.addEventListener('error', resolveIfLoaded);

      image.src = img.src;
    });
  });

export const extractText = (element: HTMLElement): string[] =>
  [...element.childNodes]
    .filter((child) => (child.nodeType === 3 || child.nodeName === 'STRONG') && child.parentNode === element)
    .filter((child) => child.textContent.trim())
    .map((textNode) => textNode.textContent.trim());

// TA-X Elements

export const isTAXListElement = (el: HTMLElement): boolean => {
  if (el.nodeName !== 'DIV' || !el.classList.contains('.frm-lst')) {
    return false;
  }

  return el.querySelector(`#${el.getAttribute('data-list-id')}`) !== null;
};

export const isTAXChildListElement = (el: HTMLElement): boolean => {
  if (!el.getAttribute('data-for-list')) {
    return false;
  }

  const parent = el.closest('.frm-lst');
  if (parent === null) {
    return false;
  }

  return parent.querySelector(`#${parent.getAttribute('data-list-id')}`) !== null;
};
