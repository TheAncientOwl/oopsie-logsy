/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useVirtualization.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Bounds math of table virtualization.
 */

import { useCallback, useRef, useState } from 'react';
import { ITEM_HEIGHT, ITEMS_OVERSCAN } from '../LogView';

export enum EScrollDirection {
  None = 'None',
  Up = 'Up',
  Down = 'Down',
}

export const useVirtualization = (
  totalNumberOfItems: number,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const scrollDirection = useRef(EScrollDirection.None);
  const [scrollTop, setScrollTopState] = useState(0);

  const innerRef = ref as React.RefObject<HTMLDivElement>;
  const windowHeight = innerRef.current ? innerRef.current.offsetHeight : 300;

  const rawIndex = Math.floor(scrollTop / ITEM_HEIGHT) - ITEMS_OVERSCAN;
  const startIndex = Math.max(0, Math.min(rawIndex, totalNumberOfItems - 1));

  const renderedNodesCount = Math.min(
    totalNumberOfItems - startIndex,
    Math.floor(windowHeight / ITEM_HEIGHT) + 2 * ITEMS_OVERSCAN
  );
  const endIndex = startIndex + renderedNodesCount;

  const setScrollTop = useCallback(
    (newScrollTop: number) => {
      let diff = scrollTop - newScrollTop;

      if (diff > 0) {
        scrollDirection.current = EScrollDirection.Up;
      } else if (diff < 0) {
        scrollDirection.current = EScrollDirection.Down;
      } else {
        scrollDirection.current = EScrollDirection.None;
      }

      if (diff == 0) {
        scrollDirection.current = EScrollDirection.None;
      } else if (diff) setScrollTopState(newScrollTop);
    },
    [setScrollTopState, scrollTop, scrollDirection]
  );

  return {
    scrollTop,
    setScrollTop,
    scrollDirection: scrollDirection.current,
    startIndex,
    renderedNodesCount,
    endIndex,
  };
};
