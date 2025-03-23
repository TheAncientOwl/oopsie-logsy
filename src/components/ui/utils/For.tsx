/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file For.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Simple utility to mask Array.map usage.
 */

interface ForProps<T> {
  each: Array<T>;
  children: (obj: T, index: number) => React.ReactNode;
}

export const For = <T,>({ each, children }: ForProps<T>) => {
  return <>{each.map(children)}</>;
};
