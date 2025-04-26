/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description InvokeGetTabs handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { EActionType, type TDispatch } from '../actions';
import {
  DefaultFactory,
  type TFilter,
  type TFilterComponent,
  type TStoreState,
  type TFilterTab,
  type TOverAlternatives,
} from '../data';
import { invokeSetTabs } from './invokeSetTabs';

const action = {
  ok: EActionType.InvokeGetTabsOK,
  nok: EActionType.InvokeGetTabsNOK,
};

type TPayloadOk = {
  tabs: Array<TFilterTab>;
  filters: Array<TFilter>;
  components: Array<TFilterComponent>;
};

type TPayloadNOk = {
  error: unknown;
};

export type TInvokeGetTabsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeGetTabsNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeGetTabs: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [overAlternatives: TOverAlternatives]
> = {
  dispatch: overAlternatives => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.Loading, payload: {} });

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
          type: EActionType.InvokeGetTabsOK,
          payload: { tabs, filters, components },
        });
      } else {
        console.info(invokeGetTabs.dispatch, `Setting default Tabs`);

        const defaultComponents = [DefaultFactory.makeFilterComponent()];
        const defaultFilters = [DefaultFactory.makeFilter(defaultComponents)];
        const defaultTabs = [DefaultFactory.makeFilterTab(defaultFilters)];

        await invokeSetTabs.dispatch(
          defaultTabs,
          defaultFilters,
          defaultComponents,
          overAlternatives
        )(dispatch);
        dispatch({
          type: EActionType.InvokeGetTabsOK,
          payload: { tabs: defaultTabs, filters: defaultFilters, components: defaultComponents },
        });
      }
    } catch (error) {
      console.error(invokeGetTabs.dispatch, `error getting tabs from rust: ${error}`);
      dispatch({ type: EActionType.InvokeGetTabsNOK, payload: { error } });
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

  action,
};
