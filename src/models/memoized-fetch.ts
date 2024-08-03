import { MemoizedFetchOptions } from '@ta-x-types';

export class MemoizedFetch {
  public expiryTime: Date;
  public response: string;

  public constructor(opts?: MemoizedFetchOptions) {
    opts = opts ? opts : { deleteAfter: { value: 7, period: 'days' } };

    const now = new Date();

    switch (opts.deleteAfter.period) {
      case 'seconds':
        this.expiryTime = new Date(now.setSeconds(now.getSeconds() + opts.deleteAfter.value));
        break;

      case 'minutes':
        this.expiryTime = new Date(now.setMinutes(now.getMinutes() + opts.deleteAfter.value));
        break;

      case 'hours':
        this.expiryTime = new Date(now.setHours(now.getHours() + opts.deleteAfter.value));
        break;

      case 'days':
        this.expiryTime = new Date(now.setDate(now.getDate() + opts.deleteAfter.value));
        break;
    }
  }

  setResponse(response: string): MemoizedFetch {
    this.response = response;
    return this;
  }

  fromString(json: string): void {
    try {
      const parsedObj = JSON.parse(json) as MemoizedFetch;

      this.expiryTime = parsedObj.expiryTime;
      this.response = parsedObj.response;
    } catch {
      // Do nothing
    }
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
