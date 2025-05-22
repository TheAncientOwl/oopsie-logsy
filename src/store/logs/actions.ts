/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Logs action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TInvokeImportLogsNOk, TInvokeImportLogsOk } from './handlers/invokeImportLogs';
import { TLoadingAction } from './handlers/loading';

export enum EActionType {
  Loading = 'Logs__Loading',
  InvokeImportLogsOK = 'Logs__ImportLogsOK',
  InvokeImportLogsNOK = 'Logs__ImportLogsNOK',
}

export type TDispatchTypes =
  | UnknownAction
  | TLoadingAction
  | TInvokeImportLogsOk
  | TInvokeImportLogsNOk;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
