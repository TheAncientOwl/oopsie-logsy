/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewTag.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description AddNewTag handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanApply, DefaultFactory, IDefaultState } from '../data';

export type AddNewTagPayload = {};

export interface AddNewTagAction {
  type: ActionType.AddNewTag;
  payload: AddNewTagPayload;
}

export const addNewTag: IBasicStoreHandler<IDefaultState, AddNewTagPayload, ActionType> = {
  dispatch: () => basicDispatcher(ActionType.AddNewTag, () => ({})),

  reduce: state => {
    const newTags = [...state.tags, DefaultFactory.makeTag()];

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
    };
  },
};
