/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetCurrentLogPaths.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description InvokeSetCurrentLogPaths handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TDispatch, EActionType } from '../actions';
import { type TStoreState } from '../data';

const action = {
  ok: EActionType.InvokeImportLogsOK,
  nok: EActionType.InvokeImportLogsNOK,
};

type TPayloadOk = {};
type TPayloadNOk = {};

export type TInvokeImportLogsOk = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeImportLogsNOk = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeImportLogs: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [paths: string[]]
> = {
  dispatch: paths => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.Loading, payload: {} });

    try {
      const response = await invoke<string[][]>('import_logs', { paths });
      console.info(invokeImportLogs.dispatch, 'rust response:', response);
      dispatch({ type: EActionType.InvokeImportLogsOK, payload: {} });
    } catch (error) {
      console.error(invokeImportLogs.dispatch, `error sending current log paths to rust: ${error}`);
      dispatch({ type: EActionType.InvokeImportLogsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: state => {
      return {
        ...state,
        loading: false,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
      };
    },
  },

  action,
};
