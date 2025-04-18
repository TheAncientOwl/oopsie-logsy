/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description InvokeGetTabs handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { ActionType, Dispatch } from '../actions';
import { DefaultFactory, IDefaultState, TFilter, TFilterComponent, TFilterTab } from '../data';
import { invokeSetTabs } from './invokeSetTabs';

type InvokeGetTabsOkPayload = {
  tabs: Array<TFilterTab>;
  filters: Array<TFilter>;
  components: Array<TFilterComponent>;
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
      const [tabs, filters, components] = await invoke<
        [Array<TFilterTab>, Array<TFilter>, Array<TFilterComponent>]
      >('get_filter_tabs');
      if (tabs.length !== 0) {
        console.traceX(
          `invokeGetTabs::dispatch`,
          `Received ${tabs.length} tabs: ${JSON.stringify(tabs)}`
        );

        console.traceX(
          `invokeGetTabs::dispatch`,
          `Received ${filters.length} filters: ${JSON.stringify(filters)}`
        );

        console.traceX(
          `invokeGetTabs::dispatch`,
          `Received ${components.length} components: ${JSON.stringify(components)}`
        );

        dispatch({ type: ActionType.InvokeGetTabsOK, payload: { tabs, filters, components } });
      } else {
        console.infoX(`invokeGetTabs::dispatch`, `Setting default Tabs`);

        const defaultComponents = [DefaultFactory.makeFilterComponent()];
        const defaultFilters = [DefaultFactory.makeFilter(defaultComponents)];
        const defaultTabs = [DefaultFactory.makeFilterTab(defaultFilters)];

        await invokeSetTabs.dispatch(defaultTabs, defaultFilters, defaultComponents)(dispatch);
        dispatch({
          type: ActionType.InvokeGetTabsOK,
          payload: { tabs: defaultTabs, filters: defaultFilters, components: defaultComponents },
        });
      }
    } catch (error) {
      console.errorX(`invokeGetTabs::dispatch`, `error getting tabs from rust: ${error}`);
      dispatch({ type: ActionType.InvokeGetTabsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      console.traceX(
        `invokeGetTabs::ok::reduce`,
        `Setting ${payload.tabs.length} tabs: ${JSON.stringify(payload.tabs)}`
      );

      console.traceX(
        `invokeGetTabs::ok::reduce`,
        `Setting ${payload.filters.length} filters: ${JSON.stringify(payload.filters)}`
      );

      console.traceX(
        `invokeGetTabs::ok::reduce`,
        `Setting ${payload.components.length} components: ${JSON.stringify(payload.components)}`
      );

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
