/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetCurrentLogPaths.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description InvokeSetCurrentLogPaths handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TDispatch, EActionType } from '../actions';
import { TColumnLogs, type TStoreState } from '../data';

const action = {
  ok: EActionType.InvokeImportLogsOK,
  nok: EActionType.InvokeImportLogsNOK,
};

export type TPayloadOk = {
  logs: TColumnLogs;
};
type TPayloadNOk = {
  error: any;
};

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
      const response = await invoke<TColumnLogs>('import_logs', { paths });
      console.info(invokeImportLogs.dispatch, 'rust response:', response);
      dispatch({ type: EActionType.InvokeImportLogsOK, payload: { logs: response } });
    } catch (error) {
      console.error(invokeImportLogs.dispatch, `error sending current log paths to rust: ${error}`);
      dispatch({ type: EActionType.InvokeImportLogsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        logs: payload.logs,
        filterIDs: [],
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
        logs: [],
        filterIDs: [],
      };
    },
  },

  action,
};
