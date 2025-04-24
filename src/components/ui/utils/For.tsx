/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file For.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Simple utility to mask Array.map usage.
 */

import React from 'react';

type TForProps<T> = {
  each: Array<T>;
  children: (obj: T, index: number) => React.ReactNode;
};

export const For = <T,>({ each, children }: TForProps<T>) => {
  return (
    <>
      {each.map((item, index) => (
        <React.Fragment key={(item as any)?.key ?? index}>{children(item, index)}</React.Fragment>
      ))}
    </>
  );
};
