/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokePrevSearch.ts
 * @author Alexandru Delegeanu
 * @version 0.17
 * @description InvokePrevSearch handler.
 */

import { ipcInvokePrevSearch, TSearchResult } from '@/commands/oopsie';
import {
  TNoDispatcherArgs,
  type IApiCallStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType, type TDispatch } from '../actions';
import { TStoreState } from '../data';

const action = {
  ok: EActionType.GetPrevOK,
  nok: EActionType.GetPrevNOK,
};

export type TPayloadOk = {
  result: TSearchResult;
};

type TPayloadNOk = {
  error: any;
};

export type TInvokePrevSearchOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokePrevSearchNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokePrevSearch: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  TNoDispatcherArgs
> = {
  dispatch: () => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.SearchLoading, payload: {} });

    try {
      const response = await ipcInvokePrevSearch();

      console.info(invokePrevSearch.dispatch, 'rust response:', { logs: response });

      dispatch({
        type: EActionType.SearchFinishedOK,
        payload: { result: response },
      });
    } catch (error) {
      console.error(invokePrevSearch.dispatch, 'error during global search:', { error });
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
