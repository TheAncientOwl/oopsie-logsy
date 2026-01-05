/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file InvokeSearchGetActiveData.ts
 * @author Alexandru Delegeanu
 * @version 0.17
 * @description InvokeSearchGetActiveData handler.
 */

import { ipcInvokeGetSearchActiveData, TActiveDataResult } from '@/commands/oopsie';
import {
  TNoDispatcherArgs,
  type IApiCallStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType, type TDispatch } from '../actions';
import { TStoreState } from '../data';

const action = {
  ok: EActionType.GetActiveDataOK,
  nok: EActionType.GetActiveDataNOK,
};

export type TPayloadOk = {
  result: TActiveDataResult;
};

type TPayloadNOk = {
  error: any;
};

export type TInvokeSearchGetActiveDataOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeSearchGetActiveDataNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeSearchGetActiveData: IApiCallStoreHandler<
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
      const response = await ipcInvokeGetSearchActiveData();

      console.info(invokeSearchGetActiveData.dispatch, 'rust response:', { logs: response });

      dispatch({
        type: EActionType.GetActiveDataOK,
        payload: { result: response },
      });
    } catch (error) {
      console.error(invokeSearchGetActiveData.dispatch, 'error during global search:', { error });
      dispatch({ type: EActionType.GetActiveDataNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        searchResult: payload.result.result,
        alternativeId: payload.result.alternativeId,
        searchPattern: payload.result.pattern,
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
