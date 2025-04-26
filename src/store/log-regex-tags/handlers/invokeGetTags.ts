/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetTags.ts
 * @author Alexandru Delegeanu
 * @version 0.13
 * @description InvokeGetTags handler.
 */

import {
  type IApiCallStoreHandler,
  type TNoDispatcherArgs,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { invoke } from '@tauri-apps/api/core';
import { EActionType, type TDispatch } from '../actions';
import { DefaultFactory, type TStoreState, type TRegexTag } from '../data';
import { invokeSetTags } from './invokeSetTags';

const action = {
  ok: EActionType.InvokeGetTagsOK,
  nok: EActionType.InvokeGetTagsNOK,
};

export type TPayloadOk = {
  tags: Array<TRegexTag>;
};

type TPayloadNOk = {
  error: unknown;
};

export type TInvokeGetTagsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeGetTagsNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeGetTags: IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOk,
  TPayloadNOk,
  TNoDispatcherArgs
> = {
  dispatch: () => async (dispatch: TDispatch) => {
    dispatch({ type: EActionType.Loading, payload: {} });

    try {
      const tags = await invoke<Array<TRegexTag>>('get_regex_tags');
      console.info(invokeGetTags.dispatch, `received ${tags.length} tags`);

      const finalTags = tags.length === 0 ? [DefaultFactory.makeTag('Payload')] : tags;

      if (tags.length === 0) {
        console.info(invokeGetTags.dispatch, `Setting default tags`);
        await invokeSetTags.dispatch(finalTags)(dispatch);
      }

      dispatch({ type: EActionType.InvokeGetTagsOK, payload: { tags: finalTags } });
    } catch (error) {
      console.error(invokeGetTags.dispatch, `error getting tags from rust: ${error}`);
      dispatch({ type: EActionType.InvokeGetTagsNOK, payload: { error } });
    }
  },

  reduce: {
    ok: (state, payload) => {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
        tags: payload.tags,
      };
    },

    nok: state => {
      return {
        ...state,
        loading: false,
      };
    },
  },

  action,
};
