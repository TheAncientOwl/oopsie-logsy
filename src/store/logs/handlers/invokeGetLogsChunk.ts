/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetLogsChunk.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description InvokeGetChunk handler.
 */

import { IApiCallStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { EActionType, TDispatch } from '../actions';
import { TColumnLogsChunk, TStoreState } from '../data';
import { invoke } from '@tauri-apps/api/core';

const action = {
  ok: EActionType.InokeGetChunkOK,
  nok: EActionType.InokeGetChunkNOK,
};

export type TPayloadOk = {
  chunkData: TColumnLogsChunk;
  chunk: {
    begin: number;
    end: number;
  };
};

type TPayloadNOk = {
  error: any;
};

export type TInvokeGetChunkOk = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeGetChunkNOk = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeGetLogsChunk: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [begin: number, end: number]
> = {
  dispatch: (begin, end) => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.OnChunkRequested, payload: {} });

    try {
      console.trace(invokeGetLogsChunk.dispatch, `Requesting logs chunk [${begin}, ${end}]`);

      const response = await invoke<TColumnLogsChunk>('get_logs_chunk', {
        desiredRange: { begin, end },
      });

      console.info(invokeGetLogsChunk.dispatch, 'rust response:', response);

      dispatch({
        type: EActionType.InokeGetChunkOK,
        payload: {
          chunkData: response,
          chunk: {
            begin,
            end,
          },
        } as TPayloadOk,
      });
    } catch (error) {
      console.error(
        invokeGetLogsChunk.dispatch,
        `error getting logs chunk[${begin} : ${end}]: ${error}`
      );
      dispatch({ type: EActionType.InokeGetChunkNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        chunkData: payload.chunkData,
        chunk: {
          begin: payload.chunk.begin,
          end: payload.chunk.end,
        },
        requested_chunk: false,
      };
    },
    nok: state => {
      return {
        ...state,
        requested_chunk: false,
      };
    },
  },

  action,
};
