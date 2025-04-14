/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description Filters action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';

import { AddNewFilterAction } from './handlers/addNewFilter';
import { AddNewFilterComponentAction } from './handlers/addNewFilterComponent';
import { AddNewFilterTabAction } from './handlers/addNewFilterTab';
import { DeleteAllFiltersAction } from './handlers/deleteAllFilters';
import { DeleteFilterAction } from './handlers/deleteFilter';
import { DeleteFilterComponentAction } from './handlers/deleteFilterComponent';
import { DeleteFilterTabAction } from './handlers/deleteFilterTab';
import { DuplicateFilterAction } from './handlers/duplicateFilter';
import { FocusFilterTabAction } from './handlers/focusFilterTab';
import { InvokeGetTabsNOkAction, InvokeGetTabsOkAction } from './handlers/invokeGetTabs';
import { InvokeSetTabsNOkAction, InvokeSetTabsOkAction } from './handlers/invokeSetTabs';
import { LoadingAction } from './handlers/loading';
import { MuteAllFiltersAction } from './handlers/muteAllFilters';
import { SetComponentDataAction } from './handlers/setComponentData';
import { SetComponentOverAlternativeAction } from './handlers/setComponentOverAlternative';
import { ToggleFilterCollapsedAction } from './handlers/toggleFilterCollapsed';
import { SetFilterNameAction } from './handlers/setFilterName';
import { SetFilterPriorityAction } from './handlers/setFilterPriority';
import { SetFilterTabNameAction } from './handlers/setFilterTabName';
import { ToggleComponentIsEqualsAction } from './handlers/toggleComponentIsEquals';
import { ToggleComponentIsRegexAction } from './handlers/toggleComponentIsRegex';
import { ToggleFilterActiveAction } from './handlers/toggleFilterActive';
import { ToggleFilterHighlightAction } from './handlers/toggleFilterHighlightOnly';
import { ToggleFilterComponentIgnoreCaseAction } from './handlers/toggleFilterIgnoreActive';
import { UnmuteAllFiltersAction } from './handlers/unmuteAllFilters';
import { SetAllFiltersCollapsedAction } from './handlers/setAllFiltersCollapsed';

export enum ActionType {
  Loading = 'Filters__Loading',

  InvokeSetTabsOK = 'Filters__InvokeSetTabsOK',
  InvokeSetTabsNOK = 'Filters__InvokeSetTabsNOK',
  InvokeGetTabsOK = 'Filters__InvokeGetTabsOK',
  InvokeGetTabsNOK = 'Filters__InvokeGetTabsNOK',

  AddNewFilterTab = 'Filters__AddNewFilterTab',
  DeleteFilterTab = 'Filters__DeleteFilterTab',
  FocusFilterTab = 'Filters__FocusFilterTab',
  SetFilterTabName = 'Filters__SetFilterTabName',

  AddNewFilter = 'Filters__AddNewFilter',
  DeleteFilter = 'Filters__DeleteFilter',
  ToggleFilterActive = 'Filters__ToggleFilterActive',
  ToggleFilterHighlightOnly = 'Filters__ToggleFilterHighlightOnly',
  SetFilterName = 'Filters__SetFilterName',
  DuplicateFilter = 'Filters__DuplicateFilter',
  MuteAllFilters = 'Filters__MuteAllFilters',
  UnmuteAllFilters = 'Filters__UnmuteAllFilters',
  DeleteAllFilters = 'Filters__DeleteAllFilters',
  SetFilterFg = 'Filters__SetFilterFg',
  SetFilterBg = 'Filters__SetFilterBg',
  SetFilterPriority = 'Filters__SetFilterPriority',
  ToggleFilterCollapsed = 'Filters__ToggleFilterCollapsed',
  SetAllFiltersCollapsed = 'Filters__SetAllFiltersCollapsed',

  AddNewFilterComponent = 'Filters__AddNewFilterComponent',
  DeleteFilterComponent = 'Filters__DeleteFilterComponent',
  SetFilterComponentOverAlternative = 'Filters__SetFilterComponentOverAlternative',
  ToggleFilterComponentIsRegex = 'Filters__ToggleFilterComponentIsRegex',
  ToggleFilterComponentIsEquals = 'Filters__ToggleFilterComponentIsEquals',
  SetFilterComponentData = 'Filters__SetFilterComponentData',
  ToggleFilterComponentIgnoreCase = 'Filters__ToggleFilterComponentIgnoreCase',
}

export type DispatchTypes =
  | UnknownAction
  | LoadingAction
  | AddNewFilterTabAction
  | DeleteFilterTabAction
  | FocusFilterTabAction
  | AddNewFilterAction
  | DeleteFilterAction
  | DuplicateFilterAction
  | ToggleFilterActiveAction
  | ToggleFilterHighlightAction
  | SetFilterNameAction
  | AddNewFilterComponentAction
  | DeleteFilterComponentAction
  | SetComponentOverAlternativeAction
  | ToggleComponentIsRegexAction
  | ToggleComponentIsEqualsAction
  | SetComponentDataAction
  | MuteAllFiltersAction
  | UnmuteAllFiltersAction
  | DeleteAllFiltersAction
  | InvokeGetTabsOkAction
  | InvokeGetTabsNOkAction
  | InvokeSetTabsOkAction
  | InvokeSetTabsNOkAction
  | SetFilterTabNameAction
  | ToggleFilterComponentIgnoreCaseAction
  | SetFilterPriorityAction
  | ToggleFilterCollapsedAction
  | SetAllFiltersCollapsedAction;

export type Dispatch = ReduxDispatch<DispatchTypes>;
