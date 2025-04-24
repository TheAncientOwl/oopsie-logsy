/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description InvokeGetTags handler.
 */

import { IApiCallStoreHandler } from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { type TLogRegexTagsDispatch, ELogRegexTagsAction } from '../actions';
import { DefaultFactory, type TLogRegexTagsStoreState, type TRegexTag } from '../data';
import { invokeSetTags } from './invokeSetTags';

export type TInvokeGetTagsOkPayload = {
  tags: Array<TRegexTag>;
};

export type TInvokeGetTagsOkAction = {
  type: typeof ELogRegexTagsAction.InvokeGetTagsOK;
  payload: TInvokeGetTagsOkPayload;
};

type TInvokeGetTagsNOkPayload = {
  error: unknown;
};

export type TInvokeGetTagsNOkAction = {
  type: typeof ELogRegexTagsAction.InvokeGetTagsNOK;
  payload: TInvokeGetTagsNOkPayload;
};

export const invokeGetTags: IApiCallStoreHandler<
  TLogRegexTagsStoreState,
  TLogRegexTagsDispatch,
  TInvokeGetTagsOkPayload,
  TInvokeGetTagsNOkPayload
> = {
  dispatch: () => async (dispatch: TLogRegexTagsDispatch) => {
    dispatch({ type: ELogRegexTagsAction.Loading, payload: {} });

    try {
      const tags = await invoke<Array<TRegexTag>>('get_regex_tags');
      console.infoX(invokeGetTags.dispatch.name, `received ${tags.length} tags`);

      const finalTags = tags.length === 0 ? [DefaultFactory.makeTag('Payload')] : tags;

      if (tags.length === 0) {
        console.infoX(invokeGetTags.dispatch.name, `Setting default tags`);
        await invokeSetTags.dispatch(finalTags)(dispatch);
      }

      dispatch({ type: ELogRegexTagsAction.InvokeGetTagsOK, payload: { tags: finalTags } });
    } catch (error) {
      console.errorX(invokeGetTags.dispatch.name, `error getting tags from rust: ${error}`);
      dispatch({ type: ELogRegexTagsAction.InvokeGetTagsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
        tags: payload.tags,
        // overAlternatives: makeOverAlternatives(payload.tags),
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
