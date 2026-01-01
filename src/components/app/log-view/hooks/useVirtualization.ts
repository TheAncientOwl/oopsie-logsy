/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useVirtualization.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Bounds math of table virtualization.
 */

import { useState } from 'react';
import { ITEM_HEIGHT, ITEMS_OVERSCAN } from '../LogView';

export const useVirtualization = (
  totalNumberOfItems: number,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const innerRef = ref as React.RefObject<HTMLDivElement>;
  const windowHeight = innerRef.current ? innerRef.current.offsetHeight : 300;

  const rawIndex = Math.floor(scrollTop / ITEM_HEIGHT) - ITEMS_OVERSCAN;
  const startIndex = Math.max(0, Math.min(rawIndex, totalNumberOfItems - 1));

  const renderedNodesCount = Math.min(
    totalNumberOfItems - startIndex,
    Math.floor(windowHeight / ITEM_HEIGHT) + 2 * ITEMS_OVERSCAN
  );
  const endIndex = startIndex + renderedNodesCount;

  return { scrollTop, setScrollTop, startIndex, renderedNodesCount, endIndex };
};
