/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Logs action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TInvokeGetChunkNOk, TInvokeGetChunkOk } from './handlers/invokeGetLogsChunk';
import { TInvokeImportLogsNOk, TInvokeImportLogsOk } from './handlers/invokeImportLogs';
import { TLoadingAction } from './handlers/loading';
import { TOnChunkRequested } from './listeners/onChunkRequested';

export enum EActionType {
  Loading = 'Logs__Loading',
  InvokeImportLogsOK = 'Logs__ImportLogsOK',
  InvokeImportLogsNOK = 'Logs__ImportLogsNOK',
  InokeGetChunkOK = 'Logs__InokeGetChunkOK',
  InokeGetChunkNOK = 'Logs__InokeGetChunkNOK',
  OnChunkRequested = 'Logs__OnChunkRequested',
}

export type TDispatchTypes =
  | UnknownAction
  | TLoadingAction
  | TInvokeImportLogsOk
  | TInvokeImportLogsNOk
  | TInvokeGetChunkOk
  | TInvokeGetChunkNOk
  | TOnChunkRequested;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
