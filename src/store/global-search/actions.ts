/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Global Search action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import {
  TInvokeApplySearchNOkAction,
  TInvokeApplySearchOkAction,
} from './handlers/invokeApplySearch';
import { TInvokeNextSearchNOkAction, TInvokeNextSearchOkAction } from './handlers/invokeNextSearch';
import { TSetAlternativeTagIdAction } from './handlers/setSearchAlternativeId';
import { TSetSearchPatternTagAction } from './handlers/setSearchPattern';
import {
  TInvokeSearchGetActiveDataNOkAction,
  TInvokeSearchGetActiveDataOkAction,
} from './handlers/invokeGetSearchActiveData';
import { TSearchLoadingAction } from './handlers/searchLoading';

export enum EActionType {
  SetAlternativeID = 'GlobalSearch__SetAlternativeID',
  SetSearchPattern = 'GlobalSearch__SetSearchPattern',

  SearchLoading = 'GlobalSearch__SearchLoading',

  GetActiveDataOK = 'GlobalSearch__GetActiveDataOK',
  GetActiveDataNOK = 'GlobalSearch__GetActiveDataNOK',

  SearchFinishedOK = 'GlobalSearch__SearchFinishedOK',
  SearchFinishedNOK = 'GlobalSearch__SearchFinishedNOK',

  GetPrevOK = 'GlobalSearch__GetPrevOK',
  GetPrevNOK = 'GlobalSearch__GetPrevNOK',

  GetNextOK = 'GlobalSearch__GetNextOK',
  GetNextNOK = 'GlobalSearch__GetNextNOK',
}

export type TDispatchTypes =
  | UnknownAction
  | TSetAlternativeTagIdAction
  | TSetSearchPatternTagAction
  | TInvokeApplySearchOkAction
  | TInvokeApplySearchNOkAction
  | TInvokeNextSearchOkAction
  | TInvokeNextSearchNOkAction
  | TInvokeSearchGetActiveDataOkAction
  | TInvokeSearchGetActiveDataNOkAction
  | TSearchLoadingAction;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
