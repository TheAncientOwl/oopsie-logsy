/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeApplyRegexTags.ts
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description InvokeApplyRegexTags handler.
 */

import { type IApiCallStoreHandler, type TStoreAction } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TDispatch, EActionType } from '../actions';
import { type TRegexTag, type TStoreState } from '../data';
import { TColumnLogs } from '@/store/logs/data';

const action = {
  ok: EActionType.InvokeApplyRegexTagsOK,
  nok: EActionType.InvokeApplyRegexTagssNOK,
};

export type TPayloadOk = {
  tags: Array<TRegexTag>;
  logs: TColumnLogs;
};

type TPayloadNOk = {
  error: any;
};

export type TInvokeApplyRegexTagsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeApplyRegexTagsNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeApplyRegexTags: IApiCallStoreHandler<
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
      const response = await invoke<TColumnLogs>('apply_regex_tags', { tags });
      console.info(invokeApplyRegexTags.dispatch, 'rust response:', { logs: response });
      dispatch({ type: EActionType.InvokeApplyRegexTagsOK, payload: { tags, logs: response } });
    } catch (error) {
      console.error(invokeApplyRegexTags.dispatch, `error sending tags to rust: ${error}`);
      dispatch({ type: EActionType.InvokeApplyRegexTagssNOK, payload: { error } });
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
