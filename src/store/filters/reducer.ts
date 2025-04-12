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

import { Reducer, Dispatch as ReduxDispatch } from '@reduxjs/toolkit';

import { ActionType, DispatchTypes } from './actions';
import { defaultState, IDefaultState } from './data';
import { deleteFilter, duplicateFilter, toggleComponentIsRegex } from './handlers';
import {
  addNewFilterComponent,
  AddNewFilterComponentPayload,
} from './handlers/addNewFilterComponent';
import { addNewFilter, AddNewFilterPayload } from './handlers/addNewFilter';
import { addNewFilterTab, AddNewFilterTabPayload } from './handlers/addNewFilterTab';
import { DeleteFilterPayload } from './handlers/deleteFilter';
import {
  deleteFilterComponent,
  DeleteFilterComponentPayload,
} from './handlers/deleteFilterComponent';
import { deleteFilterTab, DeleteFilterTabPayload } from './handlers/deleteFilterTab';
import { DuplicateFilterPayload } from './handlers/duplicateFilter';
import { focusFilterTab, FocusFilterTabPayload } from './handlers/focusFilterTab';
import { loading, LoadingPayload } from './handlers/loading';
import { setComponentData, SetComponentDataPayload } from './handlers/setComponentData';
import {
  setComponentOverAlternative,
  SetComponentOverAlternativePayload,
} from './handlers/setComponentOverAlternative';
import { setFilterName, SetFilterNamePayload } from './handlers/setFilterName';
import {
  toggleComponentIsEquals,
  ToggleComponentIsEqualsPayload,
} from './handlers/toggleComponentIsEquals';
import { ToggleComponentIsRegexPayload } from './handlers/toggleComponentIsRegex';
import { toggleFilterActive, ToggleFilterActivePayload } from './handlers/toggleFilterActive';
import {
  toggleFilterHighlightOnly,
  ToggleFilterHighlightPayload,
} from './handlers/toggleFilterHighlightOnly';

export type Dispatch = ReduxDispatch<DispatchTypes>;

export const filtersTagsReducer: Reducer<IDefaultState, DispatchTypes> = (
  state: IDefaultState = defaultState,
  action: DispatchTypes
): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading:
      return loading.reduce(state, action.payload as LoadingPayload);
    case ActionType.AddNewFilterTab:
      return addNewFilterTab.reduce(state, action.payload as AddNewFilterTabPayload);
    case ActionType.FilterTabDelete:
      return deleteFilterTab.reduce(state, action.payload as DeleteFilterTabPayload);
    case ActionType.FilterDuplicate:
      return duplicateFilter.reduce(state, action.payload as DuplicateFilterPayload);
    case ActionType.FilterTabFocus:
      return focusFilterTab.reduce(state, action.payload as FocusFilterTabPayload);
    case ActionType.FilterAdd:
      return addNewFilter.reduce(state, action.payload as AddNewFilterPayload);
    case ActionType.FilterDelete:
      return deleteFilter.reduce(state, action.payload as DeleteFilterPayload);
    case ActionType.FilterToggleActive:
      return toggleFilterActive.reduce(state, action.payload as ToggleFilterActivePayload);
    case ActionType.FilterToggleHighlightOnly:
      return toggleFilterHighlightOnly.reduce(
        state,
        action.payload as ToggleFilterHighlightPayload
      );
    case ActionType.FilterSetName:
      return setFilterName.reduce(state, action.payload as SetFilterNamePayload);
    case ActionType.FilterComponentAdd:
      return addNewFilterComponent.reduce(state, action.payload as AddNewFilterComponentPayload);
    case ActionType.FilterComponentDelete:
      return deleteFilterComponent.reduce(state, action.payload as DeleteFilterComponentPayload);
    case ActionType.FilterComponentSetOverAlternative:
      return setComponentOverAlternative.reduce(
        state,
        action.payload as SetComponentOverAlternativePayload
      );
    case ActionType.FilterComponentToggleIsRegex:
      return toggleComponentIsRegex.reduce(state, action.payload as ToggleComponentIsRegexPayload);
    case ActionType.FilterComponentToggleIsEquals:
      return toggleComponentIsEquals.reduce(
        state,
        action.payload as ToggleComponentIsEqualsPayload
      );
    case ActionType.FilterComponentSetData:
      return setComponentData.reduce(state, action.payload as SetComponentDataPayload);
    default:
      return state;
  }
};
