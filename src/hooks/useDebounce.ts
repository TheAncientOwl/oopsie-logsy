/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useDebounce.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Hook for @see utils/debounce.ts.
 */

import { debounce } from '@/utils/debounce';
import { useRef } from 'react';

export const useDebounce = (fn: () => void, delay = 100) => {
  const ref = useRef(debounce(fn, delay));
  return ref.current;
};
