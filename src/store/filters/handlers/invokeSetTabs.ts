/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description InvokeSetTabs handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { EFiltersAction, type TFiltersDispatch } from '../actions';
import {
  type TFilter,
  type TFilterComponent,
  type TFiltersStoreState,
  type TFilterTab,
} from '../data';

type TInvokeSetTabsOkPayload = {};

export type TInvokeSetTabsOkAction = {
  type: typeof EFiltersAction.InvokeSetTabsOK;
  payload: TInvokeSetTabsOkPayload;
};

type TInvokeSetTabsNOkPayload = {
  error: unknown;
};

export type TInvokeSetTabsNOkAction = {
  type: typeof EFiltersAction.InvokeSetTabsNOK;
  payload: TInvokeSetTabsNOkPayload;
};

export const invokeSetTabs: IApiCallStoreHandler<
  TFiltersStoreState,
  TFiltersDispatch,
  TInvokeSetTabsOkPayload,
  TInvokeSetTabsNOkPayload,
  [tabs: Array<TFilterTab>, filters: Array<TFilter>, components: Array<TFilterComponent>]
> = {
  dispatch: (tabs, filters, components) => async (dispatch: TFiltersDispatch) => {
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

    dispatch({ type: EFiltersAction.Loading, payload: {} });

    try {
      console.verboseX(invokeSetTabs.dispatch.name, `Sending ${tabs.length} tabs:`, tabs);
      console.verboseX(invokeSetTabs.dispatch.name, `Sending ${filters.length} filters:`, filters);
      console.verboseX(
        invokeSetTabs.dispatch.name,
        `Sending ${components.length} components:`,
        components
      );

      const response = await invoke('set_filter_tabs', { tabs, filters, components });
      console.infoX(invokeSetTabs.dispatch.name, `rust response: ${response}`);
      dispatch({ type: EFiltersAction.InvokeSetTabsOK, payload: {} });
    } catch (error) {
      console.errorX(invokeSetTabs.dispatch.name, `error sending tabs to rust: ${error}`);
      dispatch({ type: EFiltersAction.InvokeSetTabsNOK, payload: { error } });
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
