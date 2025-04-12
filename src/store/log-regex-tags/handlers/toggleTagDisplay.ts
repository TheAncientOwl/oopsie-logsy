/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleTagDisplay.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ToggleTagDisplay handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanApply, IDefaultState } from '../data';

type ToggleTagDisplayPayload = {
  targetId: string;
};

export interface ToggleTagDisplayAction {
  type: ActionType.ToggleTagDisplay;
  payload: ToggleTagDisplayPayload;
}

export const toggleTagDisplay: IBasicStoreHandler<
  IDefaultState,
  ToggleTagDisplayPayload,
  ActionType
> = {
  dispatch: (targetId: string) =>
    basicDispatcher(ActionType.ToggleTagDisplay, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;
    const newTags = state.tags.map(obj =>
      obj.id !== targetId ? obj : { ...obj, displayed: !obj.displayed }
    );

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
    };
  },
};
