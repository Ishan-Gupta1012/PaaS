/**
 * Wraps a promise with a timeout. If the promise does not resolve within the specified
 * timeout, it resolves with the fallback value or rejects if no fallback is provided.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
  fallback?: T
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      const errorMsg = `[Timeout] ${label} exceeded ${timeoutMs}ms limit.`;
      console.warn(errorMsg);
      if (fallback !== undefined) {
        resolve(fallback);
      } else {
        reject(new Error(errorMsg));
      }
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      promise.then((val) => {
        if (timeoutId) clearTimeout(timeoutId);
        return val;
      }),
      timeoutPromise,
    ]);
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}
