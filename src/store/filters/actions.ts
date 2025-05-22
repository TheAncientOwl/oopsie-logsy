/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.21
 * @description Filters action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';

import { type TAddNewFilterAction } from './handlers/addNewFilter';
import { type TAddNewFilterComponentAction } from './handlers/addNewFilterComponent';
import { type TAddNewFilterTabAction } from './handlers/addNewFilterTab';
import { type TDeleteAllFiltersAction } from './handlers/deleteAllFilters';
import { type TDeleteFilterAction } from './handlers/deleteFilter';
import { type TDeleteFilterComponentAction } from './handlers/deleteFilterComponent';
import { type TDeleteFilterTabAction } from './handlers/deleteFilterTab';
import { type TDuplicateFilterAction } from './handlers/duplicateFilter';
import { type TDuplicateFiltersTabAction } from './handlers/duplicateFiltersTab';
import { type TFocusFilterTabAction } from './handlers/focusFilterTab';
import {
  type TInvokeApplyFiltersNOkAction,
  type TInvokeApplyFiltersOkAction,
} from './handlers/invokeApplyFilters';
import {
  type TInvokeGetFiltersNOkAction,
  type TInvokeGetFiltersOkAction,
} from './handlers/invokeGetFilters';
import { type TLoadingAction } from './handlers/loading';
import { type TMuteAllFiltersAction } from './handlers/muteAllFilters';
import { TPrepareFiltersForDragAction } from './handlers/prepareFiltersForDrag';
import { type TReorderFilterComponentsAction } from './handlers/reorderFilterComponents';
import { type TReorderFiltersAction } from './handlers/reorderFilters';
import { TReorderTabsAction } from './handlers/reorderTabs';
import { type TSetAllFiltersCollapsedAction } from './handlers/setAllFiltersCollapsed';
import { type TSetComponentDataAction } from './handlers/setComponentData';
import { type TSetComponentOverAlternativeAction } from './handlers/setComponentOverAlternative';
import { type TSetFilterNameAction } from './handlers/setFilterName';
import { type TSetFilterPriorityAction } from './handlers/setFilterPriority';
import { type TSetFilterTabNameAction } from './handlers/setFilterTabName';
import { type TToggleComponentIsEqualsAction } from './handlers/toggleComponentIsEquals';
import { type TToggleComponentIsRegexAction } from './handlers/toggleComponentIsRegex';
import { type TToggleFilterActiveAction } from './handlers/toggleFilterActive';
import { type TToggleFilterCollapsedAction } from './handlers/toggleFilterCollapsed';
import { type TToggleFilterComponentIgnoreCaseAction } from './handlers/toggleFilterComponentIgnoreCase';
import { type TPayload } from './handlers/toggleFilterHighlightOnly';
import { type TUnmuteAllFiltersAction } from './handlers/unmuteAllFilters';

export enum EActionType {
  Loading = 'Filters__Loading',

  InvokeApplyFiltersOK = 'Filters__ApplyFiltersOK',
  InvokeApplyFiltersNOK = 'Filters__ApplyFiltersNOK',
  InvokeGetFiltersOK = 'Filters__InvokeGetTabsOK',
  InvokeGetFiltersNOK = 'Filters__InvokeGetTabsNOK',

  AddNewFilterTab = 'Filters__AddNewFilterTab',
  DeleteFilterTab = 'Filters__DeleteFilterTab',
  FocusFilterTab = 'Filters__FocusFilterTab',
  SetFilterTabName = 'Filters__SetFilterTabName',
  DuplicateFiltersTab = 'Filters__DuplicateFiltersTab',
  ReorderFilterTabs = 'Filters__ReorderFilterTabs',

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
  ReorderFilters = 'Filters__Reorder',
  PrepareFiltersForDrag = 'Filters__PrepareFiltersForDrag',

  AddNewFilterComponent = 'Filters__AddNewFilterComponent',
  DeleteFilterComponent = 'Filters__DeleteFilterComponent',
  SetFilterComponentOverAlternative = 'Filters__SetFilterComponentOverAlternative',
  ToggleFilterComponentIsRegex = 'Filters__ToggleFilterComponentIsRegex',
  ToggleFilterComponentIsEquals = 'Filters__ToggleFilterComponentIsEquals',
  SetFilterComponentData = 'Filters__SetFilterComponentData',
  ToggleFilterComponentIgnoreCase = 'Filters__ToggleFilterComponentIgnoreCase',
  ReorderFilterComponents = 'Filters__ReorderFilterComponents',
}

export type TDispatchTypes =
  | UnknownAction
  | TLoadingAction
  | TAddNewFilterTabAction
  | TDeleteFilterTabAction
  | TFocusFilterTabAction
  | TAddNewFilterAction
  | TDeleteFilterAction
  | TDuplicateFilterAction
  | TToggleFilterActiveAction
  | TPayload
  | TSetFilterNameAction
  | TAddNewFilterComponentAction
  | TDeleteFilterComponentAction
  | TSetComponentOverAlternativeAction
  | TToggleComponentIsRegexAction
  | TToggleComponentIsEqualsAction
  | TSetComponentDataAction
  | TMuteAllFiltersAction
  | TUnmuteAllFiltersAction
  | TDeleteAllFiltersAction
  | TInvokeGetFiltersOkAction
  | TInvokeGetFiltersNOkAction
  | TInvokeApplyFiltersOkAction
  | TInvokeApplyFiltersNOkAction
  | TSetFilterTabNameAction
  | TToggleFilterComponentIgnoreCaseAction
  | TSetFilterPriorityAction
  | TToggleFilterCollapsedAction
  | TSetAllFiltersCollapsedAction
  | TDuplicateFiltersTabAction
  | TReorderFiltersAction
  | TReorderFilterComponentsAction
  | TReorderTabsAction
  | TPrepareFiltersForDragAction
  | TPrepareFiltersForDragAction;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
