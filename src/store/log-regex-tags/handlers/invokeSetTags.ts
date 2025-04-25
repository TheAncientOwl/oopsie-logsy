/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description InvokeSetTags handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TLogRegexTagsDispatch, ELogRegexTagsAction } from '../actions';
import { type TLogRegexTagsStoreState, type TRegexTag } from '../data';

export type TInvokeSetTagsOkPayload = {
  tags: Array<TRegexTag>;
};

export type TInvokeSetTagsOkAction = {
  type: typeof ELogRegexTagsAction.InvokeSetTagsOK;
  payload: TInvokeSetTagsOkPayload;
};

type TInvokeSetTagsNOkPayload = {
  error: any;
};

export type TInvokeSetTagsNOkAction = {
  type: typeof ELogRegexTagsAction.InvokeSetTagsNOK;
  payload: TInvokeSetTagsNOkPayload;
};

export const invokeSetTags: IApiCallStoreHandler<
  TLogRegexTagsStoreState,
  TLogRegexTagsDispatch,
  TInvokeSetTagsOkPayload,
  TInvokeSetTagsNOkPayload,
  [tags: Array<TRegexTag>]
> = {
  dispatch: tags => async (dispatch: TLogRegexTagsDispatch) => {
    dispatch({ type: ELogRegexTagsAction.Loading, payload: {} });

    try {
      const response = await invoke('set_regex_tags', { tags });
      console.info(invokeSetTags.dispatch, `rust response: ${response}`);
      dispatch({ type: ELogRegexTagsAction.InvokeSetTagsOK, payload: { tags } });
    } catch (error) {
      console.error(invokeSetTags.dispatch, `error sending tags to rust: ${error}`);
      dispatch({ type: ELogRegexTagsAction.InvokeSetTagsNOK, payload: { error } });
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
};
