import { isCheckboxElement, isSelectElement } from '../utilities/html-element-util';
import { toBool } from '../utilities/string-util';

export class ConditionalRender {
  public conditions: ConditionalRender[];
  public selector: string;
  public checked: boolean;
  public value: string[];

  static fromString(json: string): ConditionalRender {
    if (!json || json.length === 0) {
      return null;
    }

    const parsedObj = JSON.parse(json);

    if (Array.isArray(parsedObj)) {
      const conditionalRender = new ConditionalRender();
      conditionalRender.conditions = parsedObj.map((cdr) => ConditionalRender.fromObject(cdr));

      return conditionalRender;
    } else {
      return ConditionalRender.fromObject(parsedObj);
    }
  }

  static fromObject(obj: { selector: string; checked: boolean; value: string }): ConditionalRender {
    const conditionalRender = new ConditionalRender();

    try {
      conditionalRender.conditions = null;
      conditionalRender.selector = obj.selector;
      conditionalRender.checked = toBool(obj.checked);
      conditionalRender.value = obj.value ? obj.value.split(',') : null;
    } catch {
      conditionalRender.conditions = null;
      conditionalRender.selector = null;
      conditionalRender.checked = null;
      conditionalRender.value = null;
    }

    return conditionalRender;
  }

  isValid(): boolean {
    return this.conditions ? true : this.selector !== null && (this.checked !== null || this.value !== null);
  }

  toString(): string {
    return JSON.stringify(this);
  }

  test(el: HTMLElement): string {
    let method: string = null;

    if (!this.isValid()) {
      return method;
    }
    if (this.conditions) {
      return this.conditions.every((cdr) => cdr.test(el) === 'remove') ? 'remove' : 'add';
    } else {
      const setting = el.querySelector(this.selector) as HTMLElement;

      if (isCheckboxElement(setting)) {
        method = (setting as HTMLInputElement).checked === this.checked ? 'remove' : 'add';
      } else if (isSelectElement(setting)) {
        if (toBool(setting.getAttribute('data-is-array'))) {
          method = this.value.some((val) =>
            (setting as HTMLSelectElement).value.split(setting.getAttribute('data-array-split')).includes(val)
          )
            ? 'remove'
            : 'add';
        } else {
          method = this.value.includes((setting as HTMLSelectElement).value) ? 'remove' : 'add';
        }
      }

      return method;
    }
  }
}
