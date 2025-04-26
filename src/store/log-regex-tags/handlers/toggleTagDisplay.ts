/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleTagDisplay.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description ToggleTagDisplay handler.
 */

import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanApply, type TStoreState } from '../data';

const action = EActionType.TToggleTagDisplay;

type TPayload = {
  targetId: UUID;
};

export type ToggleTagDisplayAction = TStoreAction<typeof action, TPayload>;

export const toggleTagDisplay: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetId: UUID]
> = {
  action,

  dispatch: targetId => basicDispatcher(action, () => ({ targetId })),

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
