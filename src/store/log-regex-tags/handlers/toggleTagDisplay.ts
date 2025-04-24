/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleTagDisplay.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description ToggleTagDisplay handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { checkCanApply, type TLogRegexTagsStoreState } from '../data';

type ToggleTagDisplayPayload = {
  targetId: string;
};

export type ToggleTagDisplayAction = {
  type: ELogRegexTagsAction.ToggleTagDisplay;
  payload: ToggleTagDisplayPayload;
};

export const toggleTagDisplay: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  ToggleTagDisplayPayload,
  ELogRegexTagsAction,
  [targetId: string]
> = {
  dispatch: targetId => basicDispatcher(ELogRegexTagsAction.ToggleTagDisplay, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;
    const newTags = state.tags.map(obj =>
      obj.id !== targetId ? obj : { ...obj, displayed: !obj.displayed }
    );

    return {
      ...state,
      tags: newTags,
      canApplyTags: checkCanApply(newTags),
      tagsChanged: true,
    };
  },
};
