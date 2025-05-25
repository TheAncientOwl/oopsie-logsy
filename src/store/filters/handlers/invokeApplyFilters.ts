/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeApplyFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.13
 * @description InvokeApplyFilters handler.
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
import { type TColumnLogs } from '@/store/logs/data';
import { type UUID } from '@/store/common/identifier';

const action = {
  ok: EActionType.InvokeApplyFiltersOK,
  nok: EActionType.InvokeApplyFiltersNOK,
};

export type TPayloadOk = {
  filteredLogs: TColumnLogs;
  filterIDs: Array<UUID>;
  anyActiveFilters: boolean;
};

type TPayloadNok = {
  error: unknown;
};

export type TInvokeApplyFiltersOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeApplyFiltersNOkAction = TStoreAction<typeof action.nok, TPayloadNok>;

export const invokeApplyFilters: IApiCallStoreHandler<
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
      invokeApplyFilters.dispatch.name,
      tabs !== undefined,
      "Received 'undefined' as tabs"
    );
    console.assertX(
      invokeApplyFilters.dispatch.name,
      filters !== undefined,
      "Received 'undefined' as filters"
    );
    console.assertX(
      invokeApplyFilters.dispatch.name,
      components !== undefined,
      "Received 'undefined' as components"
    );

    dispatch({ type: EActionType.Loading, payload: {} });

    try {
      console.verbose(invokeApplyFilters.dispatch, `Sending ${tabs.length} tabs:`, tabs);
      console.verbose(invokeApplyFilters.dispatch, `Sending ${filters.length} filters:`, filters);
      console.verbose(
        invokeApplyFilters.dispatch,
        `Sending ${components.length} components:`,
        components
      );

      if (checkCanSaveData(tabs, filters, components, overAlternatives)) {
        console.info(invokeApplyFilters.dispatch, 'Saving tabs data...');
        const response = await invoke<[TColumnLogs, Array<String>, boolean]>('apply_filters', {
          tabs,
          filters,
          components,
        });
        console.info(invokeApplyFilters.dispatch, 'rust response:', { response });
        dispatch({
          type: EActionType.InvokeApplyFiltersOK,
          payload: {
            filteredLogs: response[0],
            filterIDs: response[1],
            anyActiveFilters: response[2],
          },
        });
      } else {
        console.info(invokeApplyFilters.dispatch, 'Cannot save tabs data', {
          tabs,
          filters,
          components,
          overAlternatives,
        });
      }
    } catch (error) {
      console.error(invokeApplyFilters.dispatch, `error sending tabs to rust: ${error}`);
      dispatch({ type: EActionType.InvokeApplyFiltersNOK, payload: { error } });
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
