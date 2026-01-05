/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Handlers index file.
 */

import { invokeApplySearch } from './invokeApplySearch';
import { invokeSearchGetActiveData } from './invokeGetSearchActiveData';
import { invokeNextSearch } from './invokeNextSearch';
import { invokePrevSearch } from './invokePrevSearch';
import { searchLoading } from './searchLoading';
import { setSearchAlternativeId } from './setSearchAlternativeId';
import { setSearchPattern } from './setSearchPattern';

const basicHandlers = [setSearchAlternativeId, setSearchPattern, searchLoading];

const apiCallHandlers = [
  invokeApplySearch,
  invokeNextSearch,
  invokePrevSearch,
  invokeSearchGetActiveData,
];

export {
  apiCallHandlers,
  basicHandlers,
  invokeApplySearch,
  invokeNextSearch,
  invokePrevSearch,
  setSearchAlternativeId,
  setSearchPattern,
  invokeSearchGetActiveData,
  searchLoading,
};
