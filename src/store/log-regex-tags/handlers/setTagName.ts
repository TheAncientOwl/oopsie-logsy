/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setTagName.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description SetTagName handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { checkCanApply, type TLogRegexTagsStoreState } from '../data';

type TSetTagNamePayload = {
  targetId: string;
  newName: string;
};

export type TSetTagNameAction = {
  type: ELogRegexTagsAction.SetTagName;
  payload: TSetTagNamePayload;
};

export const setTagName: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TSetTagNamePayload,
  ELogRegexTagsAction,
  [targetId: string, newName: string]
> = {
  dispatch: (targetId, newName) =>
    basicDispatcher(ELogRegexTagsAction.SetTagName, () => ({ targetId, newName })),

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
