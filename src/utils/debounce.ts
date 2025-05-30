/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file debounce.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Used to avoid excessive recalculations on rapid fired events.
 */

export const debounce = (fn: () => void, delay = 100) => {
  let timer: number | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
};
