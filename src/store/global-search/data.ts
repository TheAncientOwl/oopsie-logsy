/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Global Search data structures.
 */

import { TSearchResult } from '@/commands/oopsie';
import { getStaticDefaultTags } from '../regex-tags/data';

// <types>
export type TStoreState = {
  alternativeId: string;
  searchPattern: string;
  searchLoading: boolean;
  searchResult: TSearchResult;
};
// </types>

// <data>
export const defaultState: TStoreState = {
  alternativeId: getStaticDefaultTags()[0].id,
  searchPattern: '',
  searchLoading: false,
  searchResult: {
    hasPrev: false,
    hasNext: false,
    rowIndex: undefined,
    searchIndex: undefined,
    searchTotal: undefined,
  },
};
// </data>
