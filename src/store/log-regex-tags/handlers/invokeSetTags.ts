/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description InvokeSetTags handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TDispatch, EActionType } from '../actions';
import { type TStoreState, type TRegexTag } from '../data';

const action = {
  ok: EActionType.InvokeSetTagsOK,
  nok: EActionType.InvokeSetTagsNOK,
};

export type TPayloadOk = {
  tags: Array<TRegexTag>;
};

type TPayloadNOk = {
  error: any;
};

export type TInvokeSetTagsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeSetTagsNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeSetTags: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  [tags: Array<TRegexTag>]
> = {
  dispatch: tags => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.Loading, payload: {} });

    try {
      const response = await invoke('set_regex_tags', { tags });
      console.info(invokeSetTags.dispatch, `rust response: ${response}`);
      dispatch({ type: EActionType.InvokeSetTagsOK, payload: { tags } });
    } catch (error) {
      console.error(invokeSetTags.dispatch, `error sending tags to rust: ${error}`);
      dispatch({ type: EActionType.InvokeSetTagsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: state => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
      };
    },
  },

  action,
};
