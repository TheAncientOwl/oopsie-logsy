/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description InvokeSetTabs handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { ActionType, Dispatch } from '../actions';
import { IDefaultState, TFilter, TFilterComponent, TFilterTab } from '../data';
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
  dispatch:
    (tabs: Array<TFilterTab>, filters: Array<TFilter>, components: Array<TFilterComponent>) =>
    async (dispatch: Dispatch) => {
      console.assertX(
        `invokeSetTabs::dispatch`,
        tabs !== undefined,
        "Received 'undefined' as tabs"
      );
      console.assertX(
        `invokeSetTabs::dispatch`,
        filters !== undefined,
        "Received 'undefined' as filters"
      );
      console.assertX(
        `invokeSetTabs::dispatch`,
        components !== undefined,
        "Received 'undefined' as components"
      );

      dispatch({ type: ActionType.Loading, payload: {} });

      try {
        console.traceX(`invokeSetTabs::dispatch`, `Sending ${tabs.length} tabs:`, tabs);

        console.traceX(`invokeSetTabs::dispatch`, `Sending ${filters.length} filters:`, filters);

        console.traceX(
          `invokeSetTabs::dispatch`,
          `Sending ${components.length} components:`,
          components
        );

        const response = await invoke('set_filter_tabs', { tabs, filters, components });
        console.traceX(`invokeSetTabs::dispatch`, `rust response: ${response}`);
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
        canSaveData: false,
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
