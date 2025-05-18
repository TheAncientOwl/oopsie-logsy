/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Logs action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TLoadingAction } from './handlers/loading';
import {
  TInvokeSetCurrentLogPathsNOk,
  TInvokeSetCurrentLogPathsOk,
} from './handlers/invokeSetCurrentLogPaths';

export enum EActionType {
  Loading = 'Logs__Loading',
  InvokeSetCurrentLogPathsOK = 'Logs__InvokeSetCurrentLogPathsOK',
  InvokeSetCurrentLogPathsNOK = 'Logs__InvokeSetCurrentLogPathsNOK',
}

export type TDispatchTypes =
  | UnknownAction
  | TLoadingAction
  | TInvokeSetCurrentLogPathsOk
  | TInvokeSetCurrentLogPathsNOk;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
