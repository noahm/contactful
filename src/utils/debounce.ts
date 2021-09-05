/**
 * Debounce coalesces multiple calls to the same function in a short
 * period of time into one call, by cancelling subsequent calls within
 * a given timeframe.
 */
export function debounce<F extends Function>(fn: F, delayMillis: number): F {
  let lastRun = 0;
  let to: number | undefined;
  return ((...args: any[]) => {
    clearTimeout(to);
    const now = Date.now();
    const dfn = () => {
      lastRun = now;
      fn(...args);
    };
    if (now - lastRun > delayMillis) {
      dfn();
    } else {
      to = window.setTimeout(dfn, delayMillis);
    }
  }) as any;
}
