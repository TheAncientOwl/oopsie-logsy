/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagName.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description SetTagName handler.
 */

import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanApply, type TStoreState } from '../data';

const action = EActionType.SetTagName;

type TPayload = {
  targetId: UUID;
  newName: string;
};

export type TSetTagNameAction = TStoreAction<typeof action, TPayload>;

export const setTagName: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetId: UUID, newName: string]
> = {
  action,

  dispatch: (targetId, newName) => basicDispatcher(action, () => ({ targetId, newName })),

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
