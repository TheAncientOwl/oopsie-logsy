/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewTag.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description AddNewTag handler.
 */

import {
  basicDispatcher,
  IBasicStoreHandler,
  type TNoDispatcherArgs,
} from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { checkCanApply, DefaultFactory, type TLogRegexTagsStoreState } from '../data';

type TAddNewTagPayload = {};

export type TAddNewTagAction = {
  type: ELogRegexTagsAction.AddNewTag;
  payload: TAddNewTagPayload;
};

export const addNewTag: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TAddNewTagPayload,
  ELogRegexTagsAction,
  TNoDispatcherArgs
> = {
  dispatch: () => basicDispatcher(ELogRegexTagsAction.AddNewTag, () => ({})),

  reduce: state => {
    const newTags = [...state.tags, DefaultFactory.makeTag()];

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
      tagsChanged: true,
    };
  },
};
