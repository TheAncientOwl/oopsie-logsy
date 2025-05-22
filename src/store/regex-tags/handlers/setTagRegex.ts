/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description SetTagRegex handler.
 */

import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanApply, type TStoreState } from '../data';

const action = EActionType.SetTagRegex;

type TPayload = {
  targetId: UUID;
  newRegex: string;
};

export type TSetTagRegexAction = TStoreAction<typeof action, TPayload>;

export const setTagRegex: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetId: UUID, newRegex: string]
> = {
  action,

  dispatch: (targetId, newRegex) => basicDispatcher(action, () => ({ targetId, newRegex })),

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
    };
  },
};
