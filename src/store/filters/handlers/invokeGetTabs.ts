/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description InvokeGetTabs handler.
 */

import { IApiCallStoreHandler, type TNoDispatcherArgs } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { EFiltersAction, type TFiltersDispatch } from '../actions';
import {
  DefaultFactory,
  type TFilter,
  type TFilterComponent,
  type TFiltersStoreState,
  type TFilterTab,
} from '../data';
import { invokeSetTabs } from './invokeSetTabs';

type TInvokeGetTabsOkPayload = {
  tabs: Array<TFilterTab>;
  filters: Array<TFilter>;
  components: Array<TFilterComponent>;
};

export type TInvokeGetTabsOkAction = {
  type: typeof EFiltersAction.InvokeGetTabsOK;
  payload: TInvokeGetTabsOkPayload;
};

type TInvokeGetTabsNOkPayload = {
  error: unknown;
};

export type TInvokeGetTabsNOkAction = {
  type: typeof EFiltersAction.InvokeGetTabsNOK;
  payload: TInvokeGetTabsNOkPayload;
};

export const invokeGetTabs: IApiCallStoreHandler<
  TFiltersStoreState,
  TFiltersDispatch,
  TInvokeGetTabsOkPayload,
  TInvokeGetTabsNOkPayload,
  TNoDispatcherArgs
> = {
  dispatch: () => async (dispatch: TFiltersDispatch) => {
    dispatch({ type: EFiltersAction.Loading, payload: {} });

    try {
      const [tabs, filters, components] =
        await invoke<[Array<TFilterTab>, Array<TFilter>, Array<TFilterComponent>]>(
          'get_filter_tabs'
        );
      if (tabs.length !== 0) {
        console.verbose(invokeGetTabs.dispatch, `Received ${tabs.length} tabs:`, tabs);
        console.verbose(invokeGetTabs.dispatch, `Received ${filters.length} filters:`, filters);
        console.verbose(
          invokeGetTabs.dispatch,
          `Received ${components.length} components:`,
          components
        );

        dispatch({
          type: EFiltersAction.InvokeGetTabsOK,
          payload: { tabs, filters, components },
        });
      } else {
        console.info(invokeGetTabs.dispatch, `Setting default Tabs`);

        const defaultComponents = [DefaultFactory.makeFilterComponent()];
        const defaultFilters = [DefaultFactory.makeFilter(defaultComponents)];
        const defaultTabs = [DefaultFactory.makeFilterTab(defaultFilters)];

        await invokeSetTabs.dispatch(defaultTabs, defaultFilters, defaultComponents)(dispatch);
        dispatch({
          type: EFiltersAction.InvokeGetTabsOK,
          payload: { tabs: defaultTabs, filters: defaultFilters, components: defaultComponents },
        });
      }
    } catch (error) {
      console.error(invokeGetTabs.dispatch, `error getting tabs from rust: ${error}`);
      dispatch({ type: EFiltersAction.InvokeGetTabsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        components: payload.components,
        filters: payload.filters,
        tabs: payload.tabs,
        canSaveData: false,
        focusedTabId: payload.tabs[0].id,
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
