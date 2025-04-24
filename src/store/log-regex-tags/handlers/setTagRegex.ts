/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description SetTagRegex handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { checkCanApply, type TLogRegexTagsStoreState } from '../data';

type TSetTagRegexPayload = {
  targetId: string;
  newRegex: string;
};

export type TSetTagRegexAction = {
  type: ELogRegexTagsAction.SetTagRegex;
  payload: TSetTagRegexPayload;
};

export const setTagRegex: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TSetTagRegexPayload,
  ELogRegexTagsAction,
  [targetId: string, newRegex: string]
> = {
  dispatch: (targetId, newRegex) =>
    basicDispatcher(ELogRegexTagsAction.SetTagRegex, () => ({ targetId, newRegex })),

  reduce: (state, payload) => {
    const { targetId, newRegex } = payload;
    const newTags = state.tags.map(obj =>
      obj.id !== targetId
        ? obj
        : {
            ...obj,
            regex: newRegex,
          }
    );

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
      tagsChanged: true,
    };
  },
};
