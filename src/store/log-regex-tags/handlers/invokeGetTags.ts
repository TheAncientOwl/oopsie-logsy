/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description InvokeGetTags handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { ActionType, Dispatch } from '../actions';
import { DefaultFactory, IDefaultState, TRegexTag } from '../data';
import { invoke } from '@tauri-apps/api/core';
import { invokeSetTags } from './invokeSetTags';
import { makeOverAlternatives } from '@/store/filters/data';

type InvokeGetTagsOkPayload = {
  tags: Array<TRegexTag>;
};

export interface InvokeGetTagsOkAction {
  type: typeof ActionType.InvokeGetTagsOK;
  payload: InvokeGetTagsOkPayload;
}

type InvokeGetTagsNOkPayload = {
  error: unknown;
};

export interface InvokeGetTagsNOkAction {
  type: typeof ActionType.InvokeGetTagsNOK;
  payload: InvokeGetTagsNOkPayload;
}

export const invokeGetTags: IApiCallStoreHandler<
  IDefaultState,
  Dispatch,
  InvokeGetTagsOkPayload,
  InvokeGetTagsNOkPayload
> = {
  dispatch: () => async (dispatch: Dispatch) => {
    dispatch({ type: ActionType.Loading, payload: {} });

    try {
      const tags = await invoke<Array<TRegexTag>>('get_regex_tags');
      console.infoX(invokeGetTags.dispatch.name, `received ${tags.length} tags`);

      const finalTags = tags.length === 0 ? [DefaultFactory.makeTag('Payload')] : tags;

      if (tags.length === 0) {
        console.infoX(invokeGetTags.dispatch.name, `Setting default tags`);
        await invokeSetTags.dispatch(finalTags)(dispatch);
      }

      dispatch({ type: ActionType.InvokeGetTagsOK, payload: { tags: finalTags } });
    } catch (error) {
      console.errorX(invokeGetTags.dispatch.name, `error getting tags from rust: ${error}`);
      dispatch({ type: ActionType.InvokeGetTagsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
        tags: payload.tags,
        overAlternatives: makeOverAlternatives(payload.tags),
        tagsChanged: false,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
      };
    },
  },
};
