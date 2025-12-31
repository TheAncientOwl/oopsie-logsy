/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetCurrentLogPaths.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description InvokeSetCurrentLogPaths handler.
 */

import { ipcInvokeImportLogs } from '@/commands/oopsie';
import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { EActionType, type TDispatch } from '../actions';
import { type TStoreState } from '../data';

const action = {
  ok: EActionType.InvokeImportLogsOK,
  nok: EActionType.InvokeImportLogsNOK,
};

type TPayloadOk = {
  activeLogsChangedTime: string;
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
      const response = await ipcInvokeImportLogs(paths);

      console.info(invokeImportLogs.dispatch, 'rust response:', response);

      dispatch({
        type: EActionType.InvokeImportLogsOK,
        payload: { activeLogsChangedTime: response } as TPayloadOk,
      });
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
        activeLogsChangedTime: payload.activeLogsChangedTime,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
        chunkData: {
          data: [],
          totalLogs: 0,
          filterIds: [],
        },
        filterIDs: [],
        totalLogs: 0,
      };
    },
  },

  action,
};
