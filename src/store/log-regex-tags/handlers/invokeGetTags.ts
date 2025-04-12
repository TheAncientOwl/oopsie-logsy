/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description InvokeGetTags handler.
 */

import { IResponseStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { DefaultFactory, IDefaultState, TRegexTag } from '../data';
import { Dispatch } from '../reducer';
import { invoke } from '@tauri-apps/api/core';
import { invokeSetTags } from './invokeSetTags';

export type InvokeGetTagsOkPayload = {
  tags: Array<TRegexTag>;
};

export interface InvokeGetTagsOkAction {
  type: typeof ActionType.InvokeGetTagsOK;
  payload: InvokeGetTagsOkPayload;
}

export type InvokeGetTagsNOkPayload = {
  error: any;
};

export interface InvokeGetTagsNOkAction {
  type: typeof ActionType.InvokeGetTagsNOK;
  payload: InvokeGetTagsNOkPayload;
}

export const invokeGetTags: IResponseStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeGetTagsOkPayload,
  InvokeGetTagsNOkPayload
> = {
  dispatch: () => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading });

    try {
      const tags = await invoke<Array<TRegexTag>>('get_tags');
      console.infoX(`invokeGetTags::dispatch`, `received ${tags.length} tags`);

      const finalTags = tags.length === 0 ? [DefaultFactory.makeTag('Payload')] : tags;

      if (tags.length === 0) {
        console.infoX(`invokeGetTags::dispatch`, `Setting default tags`);
        await invokeSetTags.dispatch(finalTags)(dispatch);
      }

      dispatch({
        type: ActionType.InvokeGetTagsOK,
        payload: { tags: finalTags },
      });
    } catch (error) {
      console.errorX(`invokeGetTags::dispatch`, `error getting tags from rust: ${error}`);
      dispatch({ type: ActionType.InvokeGetTagsNOK, payload: error });
    }
  },

  reduceOK: (state, payload) => {
    return {
      ...state,
      loading: false,
      canApplyTags: false,
      tags: payload.tags,
    };
  },

  reduceNOK: state => {
    return {
      ...state,
      loading: false,
    };
  },
};
