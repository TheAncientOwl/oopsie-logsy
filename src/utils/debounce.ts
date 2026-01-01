/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file debounce.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Used to avoid excessive recalculations on rapid fired events.
 */

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 100) => {
  let timer: number | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};
