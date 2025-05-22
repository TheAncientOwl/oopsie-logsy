/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file removeTag.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description RemoveTag handler.
 */

import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanApply, type TStoreState } from '../data';

const action = EActionType.RemoveTag;

type TPayload = {
  targetId: string;
};

export type TRemoveTagAction = TStoreAction<typeof action, TPayload>;

export const removeTag: IBasicStoreHandler<TStoreState, EActionType, TPayload, [targetId: string]> =
  {
    action,

    dispatch: targetId => basicDispatcher(action, () => ({ targetId })),

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
