/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file types.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Filters action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { type TFilter, type TFilterComponent, type TFilterTab } from './reducer';

export enum ActionType {
  Loading = 'Filters__Loading',

  InvokeGetFiltersOK = 'Filters__InvokeGetFiltersOK',
  InvokeGetFiltersNOK = 'Filters__InvokeGetFiltersNOK',
  InvokeSetFiltersOK = 'Filters__InvokeSetFiltersOK',
  InvokeSetFiltersNOK = 'Filters__InvokeSetFiltersNOK',

  FilterTabAdd = 'Filters__FilterTabAdd',
  FilterTabDelete = 'Filters__FilterTabDelete',
  FilterTabFocus = 'Filters__FilterTabFocus',

  FilterAdd = 'Filters__FilterAdd',
  FilterDelete = 'Filters__FilterDelete',
  FilterToggleActive = 'Filters__FilterToggleActive',
  FilterToggleHighlightOnly = 'Filters__FilterToggleHighlightOnly',
  FilterSetName = 'Filters__FilterSetName',

  FilterComponentAdd = 'Filters__FilterComponentAdd',
  FilterComponentDelete = 'Filters__FilterComponentDelete',
  FilterComponentSetOverAlternative = 'Filters__FilterComponentSetOverAlternative',
  FilterComponentToggleIsRegex = 'Filters__FilterComponentToggleIsRegex',
  FilterComponentToggleIsEquals = 'Filters__FilterComponentToggleIsEquals',
  FilterComponentSetData = 'Filters__FilterComponentSetData',
}

interface ILoading {
  type: typeof ActionType.Loading;
}

interface IInvokeGetFiltersOK {
  type: typeof ActionType.InvokeGetFiltersOK;
}

interface IInvokeGetFiltersNOK {
  type: typeof ActionType.InvokeGetFiltersNOK;
}

interface IInvokeSetFiltersOK {
  type: typeof ActionType.InvokeSetFiltersOK;
}

interface IInvokeSetFiltersNOK {
  type: typeof ActionType.InvokeSetFiltersNOK;
}

export type TFilterTabAddPayload = {
  tab: TFilterTab;
};
interface IFilterTabAdd {
  type: typeof ActionType.FilterTabAdd;
  payload: TFilterAddPayload;
}

export type TFilterTabDeletePayload = {
  targetId: string;
};
interface IFilterTabDelete {
  type: typeof ActionType.FilterTabDelete;
  payload: TFilterTabDeletePayload;
}

export type TFilterTabFocusPayload = {
  targetId: string;
};
interface IFilterTabFocusPayload {
  type: typeof ActionType.FilterTabFocus;
  payload: TFilterTabFocusPayload;
}

export type TFilterAddPayload = {
  targetTabId: string;
  filter: TFilter;
};
interface IFilterAdd {
  type: typeof ActionType.FilterAdd;
  payload: TFilterAddPayload;
}

type TTargetedFilterPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export type TFilterDeletePayload = TTargetedFilterPayload;
interface IFilterDelete {
  type: typeof ActionType.FilterDelete;
  payload: TFilterDeletePayload;
}

export type TFilterToggleActivePayload = TTargetedFilterPayload;
interface IFilterToggleActive {
  type: typeof ActionType.FilterToggleActive;
  payload: TFilterToggleActivePayload;
}

export type TFilterToggleHighlightOnlyPayload = TTargetedFilterPayload;
interface IFilterToggleHighlightOnly {
  type: typeof ActionType.FilterToggleHighlightOnly;
  payload: TFilterToggleHighlightOnlyPayload;
}

export type TFilterSetNamePayload = TTargetedFilterPayload & {
  name: string;
};
interface IFilterSetName {
  type: typeof ActionType.FilterSetName;
  payload: TFilterSetNamePayload;
}

export type TFilterComponentAddPayload = TTargetedFilterPayload & {
  component: TFilterComponent;
};
interface IFilterComponentAdd {
  type: typeof ActionType.FilterComponentAdd;
  payload: TFilterComponentAddPayload;
}

type TTargetedFilterComponentPayload = TTargetedFilterPayload & {
  targetComponentId: string;
};

export type TFilterComponentDeletePayload = TTargetedFilterComponentPayload;
interface IFilterComponentDelete {
  type: typeof ActionType.FilterComponentDelete;
  payload: TFilterComponentDeletePayload;
}

export type TSetOverAlternativePayload = TTargetedFilterComponentPayload & {
  overAlternative: string;
};
interface IFilterComponentSetOverAlternative {
  type: typeof ActionType.FilterComponentSetOverAlternative;
  payload: TSetOverAlternativePayload;
}

export type TFilterComponentToggleIsRegexPayload = TTargetedFilterComponentPayload;
interface IFilterComponentToggleIsRegex {
  type: typeof ActionType.FilterComponentToggleIsRegex;
  payload: TFilterComponentToggleIsRegexPayload;
}

export type TFilterComponentToggleIsEqualsPayload = TTargetedFilterComponentPayload;
interface IFilterComponentToggleIsEquals {
  type: typeof ActionType.FilterComponentToggleIsEquals;
  payload: TFilterComponentToggleIsEqualsPayload;
}

export type TFilterComponentSetDataPayload = TTargetedFilterComponentPayload & {
  data: string;
};
interface IFilterComponentSetData {
  type: typeof ActionType.FilterComponentSetData;
  payload: TFilterComponentSetDataPayload;
}

export type DispatchTypes =
  | UnknownAction
  | ILoading
  | IInvokeGetFiltersOK
  | IInvokeGetFiltersNOK
  | IInvokeSetFiltersOK
  | IInvokeSetFiltersNOK
  | IFilterTabAdd
  | IFilterTabDelete
  | IFilterTabFocusPayload
  | IFilterAdd
  | IFilterDelete
  | IFilterToggleActive
  | IFilterToggleHighlightOnly
  | IFilterSetName
  | IFilterComponentAdd
  | IFilterComponentDelete
  | IFilterComponentSetOverAlternative
  | IFilterComponentToggleIsRegex
  | IFilterComponentToggleIsEquals
  | IFilterComponentSetData;

export type TDispatch = ReduxDispatch<DispatchTypes>;
