/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Filters action types.
 */

import { UnknownAction } from '@reduxjs/toolkit';
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

  AddNewFilterTab = 'Filters__FilterTabAdd',
  FilterTabDelete = 'Filters__FilterTabDelete',
  FilterTabFocus = 'Filters__FilterTabFocus',

  FilterAdd = 'Filters__FilterAdd',
  FilterDelete = 'Filters__FilterDelete',
  FilterToggleActive = 'Filters__FilterToggleActive',
  FilterToggleHighlightOnly = 'Filters__FilterToggleHighlightOnly',
  FilterSetName = 'Filters__FilterSetName',
  FilterDuplicate = 'Filters__FilterDuplicate',

  FilterComponentAdd = 'Filters__FilterComponentAdd',
  FilterComponentDelete = 'Filters__FilterComponentDelete',
  FilterComponentSetOverAlternative = 'Filters__FilterComponentSetOverAlternative',
  FilterComponentToggleIsRegex = 'Filters__FilterComponentToggleIsRegex',
  FilterComponentToggleIsEquals = 'Filters__FilterComponentToggleIsEquals',
  FilterComponentSetData = 'Filters__FilterComponentSetData',
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
  | SetComponentDataAction;
