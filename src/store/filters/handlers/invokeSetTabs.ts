/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description InvokeSetTabs handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { ActionType, Dispatch } from '../actions';
import { IDefaultState, TFilterTab } from '../data';
import { invoke } from '@tauri-apps/api/core';

type InvokeSetTabsOkPayload = {};

export interface InvokeSetTabsOkAction {
  type: typeof ActionType.InvokeSetTabsOK;
  payload: InvokeSetTabsOkPayload;
}

type InvokeSetTabsNOkPayload = {
  error: unknown;
};

export interface InvokeSetTabsNOkAction {
  type: typeof ActionType.InvokeSetTabsNOK;
  payload: InvokeSetTabsNOkPayload;
}

export const invokeSetTabs: IApiCallStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeSetTabsOkPayload,
  InvokeSetTabsNOkPayload
> = {
  dispatch: (tabs: Array<TFilterTab>) => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading, payload: {} });

    try {
      const response = await invoke('set_filter_tabs', { tabs });
      console.logX(`invokeSetTabs::dispatch`, `rust response: ${response}`);
      dispatch({ type: ActionType.InvokeSetTabsOK, payload: {} });
    } catch (error) {
      console.errorX(`invokeSetTabs::dispatch`, `error sending tabs to rust: ${error}`);
      dispatch({ type: ActionType.InvokeSetTabsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: state => {
      return {
        ...state,
        loading: false,
        canSaveTabs: false,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
      };
    },
  },
};
