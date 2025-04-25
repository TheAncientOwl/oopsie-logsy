/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderTags.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ReorderTags handler.
 */

import { ELogRegexTagsAction } from '../actions';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { TLogRegexTagsStoreState } from '../data';
import { UUID } from '@/store/common/identifier';
import { DraggableList } from '@/components/ui/lists/DraggableList';

type TReorderTagsPayload = {
  activeId: UUID;
  overId: UUID;
};

export type TReorderTagsAction = {
  type: ELogRegexTagsAction.ReorderRegexTags;
  payload: TReorderTagsPayload;
};

export const reorderTags: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TReorderTagsPayload,
  ELogRegexTagsAction,
  [activeId: UUID, overId: UUID]
> = {
  dispatch: (activeId, overId) =>
    basicDispatcher(ELogRegexTagsAction.ReorderRegexTags, () => ({
      activeId,
      overId,
    })),

  reduce: (state, payload) => {
    const { activeId, overId } = payload;

    return {
      ...state,
      tags: DraggableList.reorderById(state.tags, activeId, overId),
      canApplyTags: true,
    };
  },
};
