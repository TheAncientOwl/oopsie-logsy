/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Filters action types.
 */

import { Dispatch as ReduxDispatch } from '@reduxjs/toolkit';

import { LoadingAction } from './handlers/loading';
import { AddNewFilterTabAction } from './handlers/addNewFilterTab';
import { DeleteFilterTabAction } from './handlers/deleteFilterTab';
import { FocusFilterTabAction } from './handlers/focusFilterTab';
import { AddNewFilterAction } from './handlers/addNewFilter';
import { DeleteFilterAction } from './handlers/deleteFilter';
import { DuplicateFilterAction } from './handlers/duplicateFilter';
import { ToggleFilterActiveAction } from './handlers/toggleFilterActive';
import { ToggleFilterHighlightAction } from './handlers/toggleFilterHighlightOnly';
import { SetFilterNameAction } from './handlers/setFilterName';
import { AddNewFilterComponentAction } from './handlers/addNewFilterComponent';
import { DeleteFilterComponentAction } from './handlers/deleteFilterComponent';
import { SetComponentOverAlternativeAction } from './handlers/setComponentOverAlternative';
import { ToggleComponentIsRegexAction } from './handlers/toggleComponentIsRegex';
import { ToggleComponentIsEqualsAction } from './handlers/toggleComponentIsEquals';
import { SetComponentDataAction } from './handlers/setComponentData';

export enum ActionType {
  Loading = 'Filters__Loading',

  AddNewFilterTab = 'Filters__AddNewFilterTab',
  DeleteFilterTab = 'Filters__DeleteFilterTab',
  FocusFilterTab = 'Filters__FocusFilterTab',

  AddNewFilter = 'Filters__AddNewFilter',
  DeleteFilter = 'Filters__DeleteFilter',
  ToggleFilterActive = 'Filters__ToggleFilterActive',
  ToggleFilterHighlightOnly = 'Filters__ToggleFilterHighlightOnly',
  SetFilterName = 'Filters__SetFilterName',
  DuplicateFilter = 'Filters__DuplicateFilter',

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
  | SetComponentDataAction;

export type Dispatch = ReduxDispatch<DispatchTypes>;
