import { ONE_SECOND } from '@workspace/shared';

export interface DelayOptions {
  signal?: AbortSignal;
}

/**
 * @param ms {number} Defaults to one second
 * @param options
 * @returns
 */
export const delay = (
  ms: number = ONE_SECOND,
  options?: DelayOptions,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve();
    }, ms);

    options?.signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};
