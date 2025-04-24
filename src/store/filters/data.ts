/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.15
 * @description Filters data structures.
 */

import { uuid, type UUID } from '../common/identifier';
import { getStaticDefaultTags, type TRegexTag } from '../log-regex-tags/data';

// <types>
export type TOverAlternative = {
  label: string;
  value: string;
};

export type TOverAlternatives = Array<TOverAlternative>;

export type TFilterComponent = {
  id: UUID;
  overAlternativeId: string;
  data: string;
  isRegex: boolean;
  isEquals: boolean;
  ignoreCase: boolean;
};

export type TFilterColors = {
  fg: string;
  bg: string;
};

export type TFilter = {
  id: UUID;
  name: string;
  isActive: boolean;
  isHighlightOnly: boolean;
  componentIDs: Array<UUID>;
  colors: TFilterColors;
  priority: number;
  collapsed: boolean;
};

export type TFilterTab = {
  id: string;
  name: string;
  filterIDs: Array<UUID>;
};

export type TFiltersStoreState = {
  loading: boolean;
  focusedTabId: string;
  canSaveData: boolean;

  tabs: Array<TFilterTab>;
  filters: Array<TFilter>;
  components: Array<TFilterComponent>;
  overAlternatives: TOverAlternatives;
};
// </types>

// <helpers>
export const makeOverAlternatives = (regexTags: Array<TRegexTag>): TOverAlternatives => {
  return regexTags
    .filter(tag => tag.displayed)
    .map(tag => ({
      label: tag.name,
      value: tag.id,
    }));
};

export const checkCanSaveData = (
  tabs: Array<TFilterTab>,
  filters: Array<TFilter>,
  components: Array<TFilterComponent>,
  overAlternatives: TOverAlternatives
) => {
  const overAlternativesSet = new Set(overAlternatives.map(alternative => alternative.value));
  return components.every(component => overAlternativesSet.has(component.overAlternativeId));
};

export const DefaultFactory = {
  makeFilterComponent: (overAlternativeId = 'Choose Tag'): TFilterComponent => ({
    id: uuid(),
    overAlternativeId: overAlternativeId,
    data: '',
    isRegex: false,
    isEquals: true,
    ignoreCase: true,
  }),

  makeFilter: (components: Array<TFilterComponent>): TFilter => ({
    id: uuid(),
    name: 'NewFilter',
    isActive: true,
    isHighlightOnly: false,
    componentIDs: components.map(component => component.id),
    colors: {
      fg: 'rgb(255, 255, 255)',
      bg: 'rgba(0, 0, 0, 0)',
    },
    priority: 1,
    collapsed: false,
  }),

  makeFilterTab: (filters: Array<TFilter>): TFilterTab => ({
    id: uuid(),
    name: 'NewFilterTab',
    filterIDs: filters.map(filter => filter.id),
  }),
};

export const getTabById = (caller: string, tabs: Array<TFilterTab>, id: UUID): TFilterTab => {
  const tab = tabs.find(tab => tab.id === id);
  console.assertX(caller, tab !== undefined, `Tab with ID ${id} missing in store`);
  return tab as TFilterTab;
};

export const getFilterById = (caller: string, filters: Array<TFilter>, id: UUID): TFilter => {
  const filter = filters.find(filter => filter.id === id);
  console.assertX(caller, filter !== undefined, `Filter with ID ${id} missing in store`);
  return filter as TFilter;
};

export const getFilterComponentById = (
  caller: string,
  components: Array<TFilterComponent>,
  id: UUID
): TFilterComponent => {
  const component = components.find(component => component.id === id);
  console.assertX(
    caller,
    component !== undefined,
    `FilterComponent with ID ${id} missing in store`
  );
  return component as TFilterComponent;
};
// </helpers>

// <data>
const defaultComponent = DefaultFactory.makeFilterComponent();
const defaultFilter = DefaultFactory.makeFilter([defaultComponent]);
const defaultTab = DefaultFactory.makeFilterTab([defaultFilter]);

const defaultComponents = [defaultComponent];
const defaultFilters = [defaultFilter];
const defaultTabs = [defaultTab];

export const defaultState: TFiltersStoreState = {
  loading: false,
  focusedTabId: defaultTabs[0].id,
  canSaveData: false,

  tabs: defaultTabs,
  filters: defaultFilters,
  components: defaultComponents,
  overAlternatives: makeOverAlternatives(getStaticDefaultTags()),
};
// </data>
