/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description Filters action types.
 */

import { Dispatch as ReduxDispatch } from '@reduxjs/toolkit';

import { AddNewFilterAction } from './handlers/addNewFilter';
import { AddNewFilterComponentAction } from './handlers/addNewFilterComponent';
import { AddNewFilterTabAction } from './handlers/addNewFilterTab';
import { DeleteFilterAction } from './handlers/deleteFilter';
import { DeleteFilterComponentAction } from './handlers/deleteFilterComponent';
import { DeleteFilterTabAction } from './handlers/deleteFilterTab';
import { DuplicateFilterAction } from './handlers/duplicateFilter';
import { FocusFilterTabAction } from './handlers/focusFilterTab';
import { LoadingAction } from './handlers/loading';
import { MuteAllFiltersAction } from './handlers/muteAllFilters';
import { SetComponentDataAction } from './handlers/setComponentData';
import { SetComponentOverAlternativeAction } from './handlers/setComponentOverAlternative';
import { SetFilterNameAction } from './handlers/setFilterName';
import { ToggleComponentIsEqualsAction } from './handlers/toggleComponentIsEquals';
import { ToggleComponentIsRegexAction } from './handlers/toggleComponentIsRegex';
import { ToggleFilterActiveAction } from './handlers/toggleFilterActive';
import { ToggleFilterHighlightAction } from './handlers/toggleFilterHighlightOnly';
import { UnmuteAllFiltersAction } from './handlers/unmuteAllFilters';
import { DeleteAllFiltersAction } from './handlers/deleteAllFilters';
import { InvokeGetTabsNOkAction, InvokeGetTabsOkAction } from './handlers/invokeGetTabs';
import { InvokeSetTabsNOkAction, InvokeSetTabsOkAction } from './handlers/invokeSetTabs';

export enum ActionType {
  Loading = 'Filters__Loading',

  InvokeSetTabsOK = 'Filters__InvokeSetTabsOK',
  InvokeSetTabsNOK = 'Filters__InvokeSetTabsNOK',
  InvokeGetTabsOK = 'Filters__InvokeGetTabsOK',
  InvokeGetTabsNOK = 'Filters__InvokeGetTabsNOK',

  AddNewFilterTab = 'Filters__AddNewFilterTab',
  DeleteFilterTab = 'Filters__DeleteFilterTab',
  FocusFilterTab = 'Filters__FocusFilterTab',

  AddNewFilter = 'Filters__AddNewFilter',
  DeleteFilter = 'Filters__DeleteFilter',
  ToggleFilterActive = 'Filters__ToggleFilterActive',
  ToggleFilterHighlightOnly = 'Filters__ToggleFilterHighlightOnly',
  SetFilterName = 'Filters__SetFilterName',
  DuplicateFilter = 'Filters__DuplicateFilter',
  MuteAllFilters = 'Filters__MuteAllFilters',
  UnmuteAllFilters = 'Filters__UnmuteAllFilters',
  DeleteAllFilters = 'Filters__DeleteAllFilters',

  AddNewFilterComponent = 'Filters__AddNewFilterComponent',
  DeleteFilterComponent = 'Filters__DeleteFilterComponent',
  SetFilterComponentOverAlternative = 'Filters__SetFilterComponentOverAlternative',
  ToggleFilterComponentIsRegex = 'Filters__ToggleFilterComponentIsRegex',
  ToggleFilterComponentIsEquals = 'Filters__ToggleFilterComponentIsEquals',
  SetFilterComponentData = 'Filters__SetFilterComponentData',
}

export type DispatchTypes =
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
  | InvokeSetTabsNOkAction;

export type Dispatch = ReduxDispatch<DispatchTypes>;
