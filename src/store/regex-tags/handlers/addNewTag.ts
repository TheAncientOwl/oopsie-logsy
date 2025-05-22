/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewTag.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description AddNewTag handler.
 */

import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TNoDispatcherArgs,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanApply, DefaultFactory, type TStoreState } from '../data';

const action = EActionType.AddNewTag;

type TPayload = {};

export type TAddNewTagAction = TStoreAction<typeof action, TPayload>;

export const addNewTag: IBasicStoreHandler<TStoreState, EActionType, TPayload, TNoDispatcherArgs> =
  {
    action,

    dispatch: () => basicDispatcher(action, () => ({})),

    reduce: state => {
      const newTags = [...state.tags, DefaultFactory.makeTag()];

      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    },
  };
