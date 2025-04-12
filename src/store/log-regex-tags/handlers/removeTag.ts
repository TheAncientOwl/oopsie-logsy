/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file removeTag.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description RemoveTag handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanApply, IDefaultState } from '../data';

type RemoveTagPayload = {
  targetId: string;
};

export interface RemoveTagAction {
  type: ActionType.RemoveTag;
  payload: RemoveTagPayload;
}

export const removeTag: IBasicStoreHandler<IDefaultState, RemoveTagPayload, ActionType> = {
  dispatch: (targetId: string) => basicDispatcher(ActionType.RemoveTag, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;
    const newTags = state.tags.filter(obj => obj.id !== targetId);

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
    };
  },
};
