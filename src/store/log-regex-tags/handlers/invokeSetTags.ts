/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description InvokeSetTags handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { ActionType, Dispatch } from '../actions';
import { IDefaultState, TRegexTag } from '../data';
import { makeOverAlternatives } from '@/store/filters/data';

type InvokeSetTagsOkPayload = {};

export interface InvokeSetTagsOkAction {
  type: typeof ActionType.InvokeSetTagsOK;
  payload: InvokeSetTagsOkPayload;
}

type InvokeSetTagsNOkPayload = {
  error: any;
};

export interface InvokeSetTagsNOkAction {
  type: typeof ActionType.InvokeSetTagsNOK;
  payload: InvokeSetTagsNOkPayload;
}

export const invokeSetTags: IApiCallStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeSetTagsOkPayload,
  InvokeSetTagsNOkPayload
> = {
  dispatch: (tags: Array<TRegexTag>) => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading, payload: {} });

    try {
      const response = await invoke('set_regex_tags', { tags });
      console.traceX(`invokeSetTags::dispatch`, `rust response: ${response}`);
      dispatch({ type: ActionType.InvokeSetTagsOK, payload: {} });
    } catch (error) {
      console.errorX(`invokeGetTags::dispatch`, `error sending tags to rust: ${error}`);
      dispatch({ type: ActionType.InvokeSetTagsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: state => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
        overAlternatives: state.tags ? makeOverAlternatives(state.tags) : state.overAlternatives,
        tagsChanged: false,
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
