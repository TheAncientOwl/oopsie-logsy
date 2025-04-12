/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagName.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetTagName handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanApply, IDefaultState } from '../data';

export type SetTagNamePayload = {
  targetId: string;
  newName: string;
};

export interface SetTagNameAction {
  type: ActionType.SetTagName;
  payload: SetTagNamePayload;
}

export const setTagName: IBasicStoreHandler<IDefaultState, SetTagNamePayload, ActionType> = {
  dispatch: (targetId: string, newName: string) =>
    basicDispatcher(ActionType.SetTagName, () => ({ targetId, newName })),

  reduce: (state, payload) => {
    const { targetId, newName } = payload;
    const newTags = state.tags.map(obj =>
      obj.id !== targetId
        ? obj
        : {
            ...obj,
            name: newName,
          }
    );

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
    };
  },
};
