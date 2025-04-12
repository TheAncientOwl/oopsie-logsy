/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeSetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description InvokeSetTags handler.
 */

import { IResponseStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { ActionType } from '../actions';
import { IDefaultState, TRegexTag } from '../data';
import { Dispatch } from '../reducer';

export type InvokeSetTagsOkPayload = {};

export interface InvokeSetTagsOkAction {
  type: typeof ActionType.InvokeSetTagsOK;
  payload: InvokeSetTagsOkPayload;
}

export type InvokeSetTagsNOkPayload = {
  error: any;
};

export interface InvokeSetTagsNOkAction {
  type: typeof ActionType.InvokeSetTagsNOK;
  payload: InvokeSetTagsNOkPayload;
}

export const invokeSetTags: IResponseStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeSetTagsOkPayload,
  InvokeSetTagsNOkPayload
> = {
  dispatch: (tags: Array<TRegexTag>) => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading });

    try {
      const response = await invoke('set_tags', { tags });
      console.logX(`invokeSetTags::dispatch`, `rust response: ${response}`);
      dispatch({ type: ActionType.InvokeSetTagsOK });
    } catch (error) {
      console.errorX(`invokeGetTags::dispatch`, `error sending tags to rust: ${error}`);
      dispatch({ type: ActionType.InvokeSetTagsNOK });
    }
  },

  reduceOK: state => {
    return {
      ...state,
      loading: false,
      canApplyTags: false,
    };
  },

  reduceNOK: state => {
    return {
      ...state,
      loading: false,
      canApplyTags: false,
    };
  },
};
