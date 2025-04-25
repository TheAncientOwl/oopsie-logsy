/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.18
 * @description Filters data reducer.
 */

import { makeReducer, type TReducerMap } from '../common/reducer';
import { ELogRegexTagsAction } from '../log-regex-tags/actions';
import { EFiltersAction, type TFiltersDispatchTypes } from './actions';
import { defaultState, type TFiltersStoreState } from './data';

import * as handlers from './handlers';
import * as listeners from './listeners';

type TCompoundActionType = EFiltersAction | ELogRegexTagsAction;

const reducerMap: TReducerMap<TCompoundActionType, TFiltersStoreState> = {
  [EFiltersAction.Loading]: handlers.loading.reduce,
  [EFiltersAction.AddNewFilterTab]: handlers.addNewFilterTab.reduce,
  [EFiltersAction.DeleteFilterTab]: handlers.deleteFilterTab.reduce,
  [EFiltersAction.DuplicateFilter]: handlers.duplicateFilter.reduce,
  [EFiltersAction.FocusFilterTab]: handlers.focusFilterTab.reduce,
  [EFiltersAction.AddNewFilter]: handlers.addNewFilter.reduce,
  [EFiltersAction.DeleteFilter]: handlers.deleteFilter.reduce,
  [EFiltersAction.ToggleFilterActive]: handlers.toggleFilterActive.reduce,
  [EFiltersAction.ToggleFilterHighlightOnly]: handlers.toggleFilterHighlightOnly.reduce,
  [EFiltersAction.SetFilterName]: handlers.setFilterName.reduce,
  [EFiltersAction.AddNewFilterComponent]: handlers.addNewFilterComponent.reduce,
  [EFiltersAction.DeleteFilterComponent]: handlers.deleteFilterComponent.reduce,
  [EFiltersAction.SetFilterComponentOverAlternative]: handlers.setComponentOverAlternative.reduce,
  [EFiltersAction.ToggleFilterComponentIsRegex]: handlers.toggleComponentIsRegex.reduce,
  [EFiltersAction.ToggleFilterComponentIsEquals]: handlers.toggleComponentIsEquals.reduce,
  [EFiltersAction.SetFilterComponentData]: handlers.setComponentData.reduce,
  [EFiltersAction.MuteAllFilters]: handlers.muteAllFilters.reduce,
  [EFiltersAction.UnmuteAllFilters]: handlers.unmuteAllFilters.reduce,
  [EFiltersAction.DeleteAllFilters]: handlers.deleteAllFilters.reduce,
  [EFiltersAction.InvokeGetTabsOK]: handlers.invokeGetTabs.reduce.ok,
  [EFiltersAction.InvokeGetTabsNOK]: handlers.invokeGetTabs.reduce.nok,
  [EFiltersAction.InvokeSetTabsOK]: handlers.invokeSetTabs.reduce.ok,
  [EFiltersAction.InvokeSetTabsNOK]: handlers.invokeSetTabs.reduce.nok,
  [EFiltersAction.SetFilterTabName]: handlers.setFilterTabName.reduce,
  [EFiltersAction.SetFilterFg]: handlers.setFilterFg.reduce,
  [EFiltersAction.SetFilterBg]: handlers.setFilterBg.reduce,
  [EFiltersAction.ToggleFilterComponentIgnoreCase]: handlers.toggleFilterComponentIgnoreCase.reduce,
  [EFiltersAction.SetFilterPriority]: handlers.setFilterPriority.reduce,
  [EFiltersAction.ToggleFilterCollapsed]: handlers.toggleFilterCollapsed.reduce,
  [EFiltersAction.SetAllFiltersCollapsed]: handlers.setAllFiltersCollapsed.reduce,
  [EFiltersAction.DuplicateFiltersTab]: handlers.duplicateFiltersTab.reduce,
  [EFiltersAction.ReorderFilters]: handlers.reorderFilters.reduce,
  [EFiltersAction.ReorderFilterComponents]: handlers.reorderFilterComponents.reduce,
  [EFiltersAction.ReorderFilterTabs]: handlers.reorderTabs.reduce,

  [ELogRegexTagsAction.InvokeGetTagsOK]: listeners.onLogRegexTagsGet.reduce,
  [ELogRegexTagsAction.InvokeSetTagsOK]: listeners.onLogRegexTagsSet.reduce,
};

export const filtersTagsReducer = makeReducer<
  TFiltersStoreState,
  TCompoundActionType,
  TFiltersDispatchTypes
>(defaultState, reducerMap);
