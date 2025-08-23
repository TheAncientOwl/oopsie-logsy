/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file invokeGetRegexTags.ts
 * @author Alexandru Delegeanu
 * @version 0.16
 * @description InvokeGetTags handler.
 */

import { ipcInvokeGetRegexTags } from '@/commands/oopsie';
import {
  type IApiCallStoreHandler,
  type TNoDispatcherArgs,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType, type TDispatch } from '../actions';
import { type TRegexTag, type TStoreState, getStaticDefaultTags } from '../data';
import { invokeApplyRegexTags } from './invokeApplyRegexTags';

const action = {
  ok: EActionType.InvokeGetRegexTagsOK,
  nok: EActionType.InvokeGetRegexTagsNOK,
};

export type TPayloadOk = {
  tags: Array<TRegexTag>;
};

type TPayloadNOk = {
  error: unknown;
};

export type TInvokeGetRegexTagsOkAction = TStoreAction<typeof action.ok, TPayloadOk>;
export type TInvokeGetRegexTagsNOkAction = TStoreAction<typeof action.nok, TPayloadNOk>;

export const invokeGetRegexTags: IApiCallStoreHandler<
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
      const tags = await ipcInvokeGetRegexTags();
      console.info(invokeGetRegexTags.dispatch, `received ${tags.length} tags`);

      const finalTags =
        tags.length === 0 ? (getStaticDefaultTags._defaultTags as TRegexTag[]) : tags;

      if (tags.length === 0) {
        console.info(invokeGetRegexTags.dispatch, `Setting default tags`);
        await invokeApplyRegexTags.dispatch(finalTags)(dispatch);
      }

      dispatch({ type: EActionType.InvokeGetRegexTagsOK, payload: { tags: finalTags } });
    } catch (error) {
      console.error(invokeGetRegexTags.dispatch, `error getting tags from rust: ${error}`);
      dispatch({ type: EActionType.InvokeGetRegexTagsNOK, payload: { error } });
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
