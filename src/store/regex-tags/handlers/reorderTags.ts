/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderTags.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description ReorderTags handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { TStoreState } from '../data';

const action = EActionType.ReorderRegexTags;

type TPayload = {
  activeId: UUID;
  overId: UUID;
};

export type TReorderTagsAction = TStoreAction<typeof action, TPayload>;

export const reorderTags: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [activeId: UUID, overId: UUID]
> = {
  action,

  dispatch: (activeId, overId) =>
    basicDispatcher(action, () => ({
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
