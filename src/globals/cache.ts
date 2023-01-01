import { isBeforeNow } from '../utilities/date-util';
import { MemoizedFetch } from '../models/memoized-fetch';

export class Cache {
  static get memoize(): Map<string, MemoizedFetch> { 
    const value = GM_getValue('trueachievements-extra-memoized', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  }
  
  static set memoize(value: Map<string, MemoizedFetch>) {
    GM_setValue('trueachievements-extra-memoized', JSON.stringify(Array.from(value.entries())));
  }
  
  static forceClear(): void {
    GM_deleteValue('trueachievements-extra-memoized');
  }

  static clearExpired(): void {
    const updatedCache = Array.from(this.memoize.entries()).filter(item => isBeforeNow(item[1].expiryTime));
    this.memoize = new Map(updatedCache);
  }
}