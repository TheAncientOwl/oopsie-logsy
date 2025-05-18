/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetCurrentLogPaths.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description InvokeSetCurrentLogPaths handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TDispatch, EActionType } from '../actions';
import { type TStoreState } from '../data';

const action = {
  ok: EActionType.InvokeSetCurrentLogPathsOK,
  nok: EActionType.InvokeSetCurrentLogPathsNOK,
};

type TPayloadOk = {};
type TPayloadNOk = {};

export type TInvokeSetCurrentLogPathsOk = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeSetCurrentLogPathsNOk = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeSetCurrentLogPaths: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [paths: string[]]
> = {
  dispatch: paths => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.Loading, payload: {} });

    await Promise.resolve();

    try {
      const response = await invoke('set_current_log_paths', { paths });
      console.info(invokeSetCurrentLogPaths.dispatch, `rust response: ${response}`);
      dispatch({ type: EActionType.InvokeSetCurrentLogPathsOK, payload: {} });
    } catch (error) {
      console.error(
        invokeSetCurrentLogPaths.dispatch,
        `error sending current log paths to rust: ${error}`
      );
      dispatch({ type: EActionType.InvokeSetCurrentLogPathsNOK, payload: { error } });
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
