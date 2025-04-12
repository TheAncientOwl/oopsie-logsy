/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Filters data structures.
 */

import { v7 as uuidv7 } from 'uuid';
import { TRegexTag } from '../log-regex-tags/data';

// <types>
export type TOverAlternative = {
  label: string;
  value: string;
};

export type TOverAlternatives = {
  data: Array<TOverAlternative>;
};

export type TFilterComponent = {
  id: string;
  overAlternativeId: string;
  data: string;
  isRegex: boolean;
  isEquals: boolean;
};

export type TFilter = {
  id: string;
  name: string;
  isActive: boolean;
  isHighlightOnly: boolean;
  components: Array<TFilterComponent>;
};

export type TFilterTab = {
  id: string;
  name: string;
  filters: Array<TFilter>;
};

export interface IDefaultState {
  loading: boolean;
  filterTabs: Array<TFilterTab>;
  focusedTabId: string;
  canSaveTabs: boolean;
}
// </types>

// <helpers>
export const makeOverAlternatives = (regexTags: Array<TRegexTag>): TOverAlternatives => {
  return {
    data: regexTags.map(tag => ({
      label: tag.name,
      value: tag.id,
    })),
  };
};

export const checkCanSaveTabs = (tabs: Array<TFilterTab>) => {
  // TODO: do actual checking...
  return true;
};

export const DefaultFactory = {
  makeFilterComponent: (overAlternativeId = ''): TFilterComponent => ({
    id: uuidv7(),
    overAlternativeId: overAlternativeId,
    data: '',
    isRegex: false,
    isEquals: true,
  }),

  makeFilter: (overAlternativeId = ''): TFilter => ({
    id: uuidv7(),
    name: 'NewFilter',
    isActive: true,
    isHighlightOnly: false,
    components: [DefaultFactory.makeFilterComponent(overAlternativeId)],
  }),

  makeFilterTab: (overAlternativeId = ''): TFilterTab => ({
    id: uuidv7(),
    name: 'NewFilterTab',
    filters: [DefaultFactory.makeFilter(overAlternativeId)],
  }),
};
// </helpers>

// <data>
export const defaultFilterTabs = [DefaultFactory.makeFilterTab()];

export const defaultState: IDefaultState = {
  loading: false,
  filterTabs: defaultFilterTabs,
  focusedTabId: defaultFilterTabs[0].id,
  canSaveTabs: false,
};
// </data>
