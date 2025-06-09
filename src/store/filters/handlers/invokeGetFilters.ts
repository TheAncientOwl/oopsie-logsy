/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description InvokeGetFilters handler.
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
import { invokeApplyFilters } from './invokeApplyFilters';

const action = {
  ok: EActionType.InvokeGetFiltersOK,
  nok: EActionType.InvokeGetFiltersNOK,
};

type TPayloadOk = {
  tabs: Array<TFilterTab>;
  filters: Array<TFilter>;
  components: Array<TFilterComponent>;
};

type TPayloadNOk = {
  error: unknown;
};

export type TInvokeGetFiltersOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeGetFiltersNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeGetFilters: IApiCallStoreHandler<
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
        await invoke<[Array<TFilterTab>, Array<TFilter>, Array<TFilterComponent>]>('get_filters');
      if (tabs.length !== 0) {
        console.trace(invokeGetFilters.dispatch, `Received ${tabs.length} tabs:`, tabs);
        console.trace(invokeGetFilters.dispatch, `Received ${filters.length} filters:`, filters);
        console.trace(
          invokeGetFilters.dispatch,
          `Received ${components.length} components:`,
          components
        );

        dispatch({
          type: EActionType.InvokeGetFiltersOK,
          payload: { tabs, filters, components },
        });
      } else {
        console.info(invokeGetFilters.dispatch, `Setting default Tabs`);

        const defaultComponents = [DefaultFactory.makeFilterComponent()];
        const defaultFilters = [DefaultFactory.makeFilter(defaultComponents)];
        const defaultTabs = [DefaultFactory.makeFilterTab(defaultFilters)];

        await invokeApplyFilters.dispatch(
          defaultTabs,
          defaultFilters,
          defaultComponents,
          overAlternatives
        )(dispatch);
        dispatch({
          type: EActionType.InvokeGetFiltersOK,
          payload: { tabs: defaultTabs, filters: defaultFilters, components: defaultComponents },
        });
      }
    } catch (error) {
      console.error(invokeGetFilters.dispatch, `error getting tabs from rust: ${error}`);
      dispatch({ type: EActionType.InvokeGetFiltersNOK, payload: { error } });
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
