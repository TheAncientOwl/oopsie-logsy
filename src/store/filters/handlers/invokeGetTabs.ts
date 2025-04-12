/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description InvokeGetTabs handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { ActionType, Dispatch } from '../actions';
import { DefaultFactory, IDefaultState, TFilterTab } from '../data';
import { invoke } from '@tauri-apps/api/core';
import { invokeSetTabs } from './invokeSetTabs';

type InvokeGetTabsOkPayload = {
  tabs: Array<TFilterTab>;
};

export interface InvokeGetTabsOkAction {
  type: typeof ActionType.InvokeGetTabsOK;
  payload: InvokeGetTabsOkPayload;
}

type InvokeGetTabsNOkPayload = {
  error: unknown;
};

export interface InvokeGetTabsNOkAction {
  type: typeof ActionType.InvokeGetTabsNOK;
  payload: InvokeGetTabsNOkPayload;
}

export const invokeGetTabs: IApiCallStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeGetTabsOkPayload,
  InvokeGetTabsNOkPayload
> = {
  dispatch: () => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading, payload: {} });

    try {
      const tabs = await invoke<Array<TFilterTab>>('get_filter_tabs');
      console.infoX(`invokeGetTabs::dispatch`, `received ${tabs.length} tabs`);

      const finalTabs = tabs.length === 0 ? [DefaultFactory.makeFilterTab()] : tabs;

      if (tabs.length === 0) {
        console.infoX(`invokeGetTabs::dispatch`, `Setting default Tabs`);
        await invokeSetTabs.dispatch(finalTabs)(dispatch);
      }

      dispatch({ type: ActionType.InvokeGetTabsOK, payload: { tabs: finalTabs } });
    } catch (error) {
      console.errorX(`invokeGetTabs::dispatch`, `error getting tabs from rust: ${error}`);
      dispatch({ type: ActionType.InvokeGetTabsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        canApplyTabs: false,
        filterTabs: payload.tabs,
        focusedTabId: payload.tabs[0]?.id,
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
