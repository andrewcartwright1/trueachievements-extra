const promisify =
  <T>(fn: (...args: unknown[]) => T) =>
  async (...args: unknown[]) =>
    fn(args);

const needsPromisifying = (fn: () => unknown): boolean => fn.constructor.name === 'AsyncFunction';

export const allSequentially = async <T>(
  name: string,
  arr: { name: string; task: () => T | Promise<T> }[]
): Promise<T[]> => {
  let index = 0;
  const result = [];

  while (index < arr.length) {
    const curIndex = index++;
    const task = needsPromisifying(arr[curIndex].task) ? promisify(arr[curIndex].task) : arr[curIndex].task;
    result[curIndex] = await task(curIndex);
  }

  return result;
};

export const allConcurrently = async <T>(
  name: string,
  arr: { name: string; task: (index?: number) => T | Promise<T> }[],
  max = 3
): Promise<T[]> => {
  if (arr.length === 0) {
    return Promise.resolve([]);
  }

  let index = 0;
  const results = [];

  const execThread = async () => {
    while (index < arr.length) {
      const curIndex = index++;
      const task = needsPromisifying(arr[curIndex].task) ? promisify(arr[curIndex].task) : arr[curIndex].task;
      results[curIndex] = await task(curIndex);
    }
  };

  const threads = [];

  for (let thread = 0; thread < max; thread++) {
    threads.push(execThread());
  }

  await Promise.all(threads);

  return results;
};
