/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetTagRegex handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanApply, IDefaultState } from '../data';

type SetTagRegexPayload = {
  targetId: string;
  newRegex: string;
};

export interface SetTagRegexAction {
  type: ActionType.SetTagRegex;
  payload: SetTagRegexPayload;
}

export const setTagRegex: IBasicStoreHandler<IDefaultState, SetTagRegexPayload, ActionType> = {
  dispatch: (targetId: string, newRegex: string) =>
    basicDispatcher(ActionType.SetTagRegex, () => ({ targetId, newRegex })),

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
