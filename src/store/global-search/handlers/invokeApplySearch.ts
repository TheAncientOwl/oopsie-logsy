/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeApplySearch.ts
 * @author Alexandru Delegeanu
 * @version 0.17
 * @description InvokeApplySearch handler.
 */

import { ipcInvokeApplySearch, TSearchResult } from '@/commands/oopsie';
import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { type TDispatch, EActionType } from '../actions';
import { TStoreState } from '../data';

const action = {
  ok: EActionType.SearchFinishedOK,
  nok: EActionType.SearchFinishedNOK,
};

export type TPayloadOk = {
  result: TSearchResult;
};

type TPayloadNOk = {
  error: any;
};

export type TInvokeApplySearchOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeApplySearchNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeApplySearch: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [alternative: string, pattern: string]
> = {
  dispatch: (alternative, pattern) => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.SearchLoading, payload: {} });

    try {
      const response = await ipcInvokeApplySearch(alternative, pattern);

      console.info(invokeApplySearch.dispatch, 'rust response:', { logs: response });

      dispatch({
        type: EActionType.SearchFinishedOK,
        payload: { result: response },
      });
    } catch (error) {
      console.error(invokeApplySearch.dispatch, 'error during global search:', { error });
      dispatch({ type: EActionType.SearchFinishedNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        searchResult: payload.result,
        searchLoading: false,
      };
    },

    nok: state => {
      return {
        ...state,
        searchLoading: false,
        searchResult: {
          hasPrev: false,
          hasNext: false,
          rowIndex: undefined,
          searchIndex: undefined,
          searchTotal: undefined,
        },
      };
    },
  },

  action,
};
