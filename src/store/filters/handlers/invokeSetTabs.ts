/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description InvokeSetTabs handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { EActionType, type TDispatch } from '../actions';
import {
  checkCanSaveData,
  type TFilter,
  type TFilterComponent,
  type TStoreState,
  type TFilterTab,
  type TOverAlternatives,
} from '../data';

const action = {
  ok: EActionType.InvokeSetTabsOK,
  nok: EActionType.InvokeSetTabsNOK,
};

type TPayloadOk = {};

type TPayloadNok = {
  error: unknown;
};

export type TInvokeSetTabsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeSetTabsNOkAction = TStoreAction<typeof action.nok, TPayloadNok>;

export const invokeSetTabs: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNok,
  [
    tabs: Array<TFilterTab>,
    filters: Array<TFilter>,
    components: Array<TFilterComponent>,
    overAlternatives: TOverAlternatives,
  ]
> = {
  dispatch: (tabs, filters, components, overAlternatives) => async (dispatch: TDispatch) => {
    console.assertX(
      invokeSetTabs.dispatch.name,
      tabs !== undefined,
      "Received 'undefined' as tabs"
    );
    console.assertX(
      invokeSetTabs.dispatch.name,
      filters !== undefined,
      "Received 'undefined' as filters"
    );
    console.assertX(
      invokeSetTabs.dispatch.name,
      components !== undefined,
      "Received 'undefined' as components"
    );

    dispatch({ type: EActionType.Loading, payload: {} });

    try {
      console.verbose(invokeSetTabs.dispatch, `Sending ${tabs.length} tabs:`, tabs);
      console.verbose(invokeSetTabs.dispatch, `Sending ${filters.length} filters:`, filters);
      console.verbose(
        invokeSetTabs.dispatch,
        `Sending ${components.length} components:`,
        components
      );

      if (checkCanSaveData(tabs, filters, components, overAlternatives)) {
        console.info(invokeSetTabs.dispatch, 'Saving tabs data...');
        const response = await invoke('set_filter_tabs', { tabs, filters, components });
        console.info(invokeSetTabs.dispatch, `rust response: ${response}`);
        dispatch({ type: EActionType.InvokeSetTabsOK, payload: {} });
      } else {
        console.info(invokeSetTabs.dispatch, 'Cannot save tabs data', {
          tabs,
          filters,
          components,
          overAlternatives,
        });
      }
    } catch (error) {
      console.error(invokeSetTabs.dispatch, `error sending tabs to rust: ${error}`);
      dispatch({ type: EActionType.InvokeSetTabsNOK, payload: { error } });
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

  action,
};
