/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file removeTag.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description RemoveTag handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { checkCanApply, type TLogRegexTagsStoreState } from '../data';

type TRemoveTagPayload = {
  targetId: string;
};

export type TRemoveTagAction = {
  type: ELogRegexTagsAction.RemoveTag;
  payload: TRemoveTagPayload;
};

export const removeTag: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TRemoveTagPayload,
  ELogRegexTagsAction,
  [targetId: string]
> = {
  dispatch: targetId => basicDispatcher(ELogRegexTagsAction.RemoveTag, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;
    const newTags = state.tags.filter(obj => obj.id !== targetId);

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
      tagsChanged: true,
    };
  },
};
