/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Filters data reducer.
 */

import { Reducer } from '@reduxjs/toolkit';
import { v7 as uuidv7 } from 'uuid';
import {
  ActionType,
  TFilterDuplicatePayload,
  TFilterTabFocusPayload,
  type DispatchTypes,
  type TFilterAddPayload,
  type TFilterComponentAddPayload,
  type TFilterComponentDeletePayload,
  type TFilterComponentSetDataPayload,
  type TFilterComponentToggleIsEqualsPayload,
  type TFilterComponentToggleIsRegexPayload,
  type TFilterDeletePayload,
  type TFilterSetNamePayload,
  type TFilterTabAddPayload,
  type TFilterTabDeletePayload,
  type TFilterToggleActivePayload,
  type TFilterToggleHighlightOnlyPayload,
  type TSetOverAlternativePayload,
} from './types';

import { TRegexTag } from '../log-regex-tags/reducer';

export type TOverAlternative = {
  label: string;
  value: string;
};

export type TOverAlternatives = {
  data: Array<TOverAlternative>;
};

export const makeOverAlternatives = (regexTags: Array<TRegexTag>): TOverAlternatives => {
  return {
    data: regexTags.map(tag => ({
      label: tag.name,
      value: tag.id,
    })),
  };
};

export type TFilterComponent = {
  id: string;
  over: string;
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

interface IDefaultState {
  loading: boolean;
  filterTabs: Array<TFilterTab>;
  focusedTabId: string;
}

const DummyFilterMaker = {
  makeDummyFilterComponent: (): TFilterComponent => {
    const id = uuidv7();
    return {
      id: id,
      over: 'Payload',
      data: '.*',
      isRegex: false,
      isEquals: true,
    };
  },

  makeDummyFilter: (): TFilter => {
    const id = uuidv7();
    return {
      id: id,
      name: `Filter~${id}`,
      isActive: true,
      isHighlightOnly: false,
      components: [
        DummyFilterMaker.makeDummyFilterComponent(),
        DummyFilterMaker.makeDummyFilterComponent(),
        DummyFilterMaker.makeDummyFilterComponent(),
      ],
    };
  },

  filterTabs: 0,

  makeDummyTab: (): TFilterTab => {
    const id = uuidv7();
    DummyFilterMaker.filterTabs += 1;
    return {
      id: id,
      name: `FilterTab~${DummyFilterMaker.filterTabs}`,
      filters: [DummyFilterMaker.makeDummyFilter(), DummyFilterMaker.makeDummyFilter()],
    };
  },
};

const dummyTabs = [DummyFilterMaker.makeDummyTab(), DummyFilterMaker.makeDummyTab()];

const defaultState: IDefaultState = {
  loading: false,
  filterTabs: dummyTabs,
  focusedTabId: dummyTabs[0].id,
};

export const filtersTagsReducer: Reducer<IDefaultState, DispatchTypes> = (
  state: IDefaultState = defaultState,
  action: DispatchTypes
): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading: {
      return {
        ...state,
        loading: true,
      };
    }

    case ActionType.InvokeGetFiltersOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.InvokeGetFiltersNOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.InvokeSetFiltersOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.InvokeSetFiltersNOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.FilterTabAdd: {
      const { tab } = action.payload as TFilterTabAddPayload;
      return {
        ...state,
        filterTabs: [...state.filterTabs, tab],
        focusedTabId: tab.id,
      };
    }

    case ActionType.FilterTabDelete: {
      const { targetId } = action.payload as TFilterTabDeletePayload;

      let newFocusIndex = 0;
      const newTabs = state.filterTabs.filter((tab, idx) => {
        if (tab.id === targetId) {
          newFocusIndex = idx;
        }
        return tab.id !== targetId;
      });
      newFocusIndex = Math.min(newFocusIndex, newTabs.length - 1);

      return {
        ...state,
        filterTabs: newTabs,
        focusedTabId: newFocusIndex >= 0 ? newTabs[newFocusIndex].id : '',
      };
    }

    case ActionType.FilterDuplicate: {
      const { targetTabId, targetFilterId } = action.payload as TFilterDuplicatePayload;

      const handleDuplication = (filters: Array<TFilter>): Array<TFilter> => {
        const newArr = [] as Array<TFilter>;

        filters.forEach(filter => {
          newArr.push(filter);
          if (filter.id === targetFilterId) {
            newArr.push({ ...filter, id: uuidv7() });
          }
        });

        return newArr;
      };

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: handleDuplication(tab.filters),
              }
        ),
      };
    }

    case ActionType.FilterTabFocus: {
      const { targetId } = action.payload as TFilterTabFocusPayload;

      return {
        ...state,
        focusedTabId: targetId,
      };
    }

    case ActionType.FilterAdd: {
      const { targetTabId, filter } = action.payload as TFilterAddPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: [...tab.filters, filter],
              }
        ),
      };
    }

    case ActionType.FilterDelete: {
      const { targetTabId, targetFilterId } = action.payload as TFilterDeletePayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.filter(filter => filter.id !== targetFilterId),
              }
        ),
      };
    }

    case ActionType.FilterToggleActive: {
      const { targetTabId, targetFilterId } = action.payload as TFilterToggleActivePayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        isActive: !filter.isActive,
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterToggleHighlightOnly: {
      const { targetTabId, targetFilterId } = action.payload as TFilterToggleHighlightOnlyPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        isHighlightOnly: !filter.isHighlightOnly,
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterSetName: {
      const { targetTabId, targetFilterId, name } = action.payload as TFilterSetNamePayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        name,
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentAdd: {
      const { targetTabId, targetFilterId, component } =
        action.payload as TFilterComponentAddPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: [...filter.components, component],
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentDelete: {
      const { targetTabId, targetFilterId, targetComponentId } =
        action.payload as TFilterComponentDeletePayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: filter.components.filter(
                          component => component.id !== targetComponentId
                        ),
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentSetOverAlternative: {
      const { targetTabId, targetFilterId, targetComponentId, overAlternative } =
        action.payload as TSetOverAlternativePayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: filter.components.map(component =>
                          component.id !== targetComponentId
                            ? component
                            : { ...component, over: overAlternative }
                        ),
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentToggleIsRegex: {
      const { targetTabId, targetFilterId, targetComponentId } =
        action.payload as TFilterComponentToggleIsRegexPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: filter.components.map(component =>
                          component.id !== targetComponentId
                            ? component
                            : { ...component, isRegex: !component.isRegex }
                        ),
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentToggleIsEquals: {
      const { targetTabId, targetFilterId, targetComponentId } =
        action.payload as TFilterComponentToggleIsEqualsPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: filter.components.map(component =>
                          component.id !== targetComponentId
                            ? component
                            : { ...component, isEquals: !component.isEquals }
                        ),
                      }
                ),
              }
        ),
      };
    }

    case ActionType.FilterComponentSetData: {
      const { targetTabId, targetFilterId, targetComponentId, data } =
        action.payload as TFilterComponentSetDataPayload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter =>
                  filter.id !== targetFilterId
                    ? filter
                    : {
                        ...filter,
                        components: filter.components.map(component =>
                          component.id !== targetComponentId ? component : { ...component, data }
                        ),
                      }
                ),
              }
        ),
      };
    }
  }

  return state;
};
