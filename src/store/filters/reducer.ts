/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Filters data reducer.
 */

import { makeReducer, ReducerMap } from '../common/reducer';
import { ActionType, DispatchTypes } from './actions';
import { defaultState, IDefaultState } from './data';

import * as handlers from './handlers';

const reducerMap: ReducerMap<ActionType, IDefaultState> = {
  [ActionType.Loading]: handlers.loading.reduce,
  [ActionType.AddNewFilterTab]: handlers.addNewFilterTab.reduce,
  [ActionType.DeleteFilterTab]: handlers.deleteFilterTab.reduce,
  [ActionType.DuplicateFilter]: handlers.duplicateFilter.reduce,
  [ActionType.FocusFilterTab]: handlers.focusFilterTab.reduce,
  [ActionType.AddNewFilter]: handlers.addNewFilter.reduce,
  [ActionType.DeleteFilter]: handlers.deleteFilter.reduce,
  [ActionType.ToggleFilterActive]: handlers.toggleFilterActive.reduce,
  [ActionType.ToggleFilterHighlightOnly]: handlers.toggleFilterHighlightOnly.reduce,
  [ActionType.SetFilterName]: handlers.setFilterName.reduce,
  [ActionType.AddNewFilterComponent]: handlers.addNewFilterComponent.reduce,
  [ActionType.DeleteFilterComponent]: handlers.deleteFilterComponent.reduce,
  [ActionType.SetFilterComponentOverAlternative]: handlers.setComponentOverAlternative.reduce,
  [ActionType.ToggleFilterComponentIsRegex]: handlers.toggleComponentIsRegex.reduce,
  [ActionType.ToggleFilterComponentIsEquals]: handlers.toggleComponentIsEquals.reduce,
  [ActionType.SetFilterComponentData]: handlers.setComponentData.reduce,
};

export const filtersTagsReducer = makeReducer<IDefaultState, ActionType, DispatchTypes>(
  defaultState,
  reducerMap
);
