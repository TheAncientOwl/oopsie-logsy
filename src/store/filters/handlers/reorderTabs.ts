/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ReorderTabs handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, TStoreState } from '../data';

const action = EActionType.ReorderFilterTabs;

type TPayload = {
  activeId: UUID;
  overId: UUID;
};

export type TReorderTabsAction = TStoreAction<typeof action, TPayload>;

export const reorderTabs: IBasicStoreHandler<
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

    const newTabs = DraggableList.reorderById(state.tabs, activeId, overId);

    return {
      ...state,
      tabs: newTabs,
      canSaveData: checkCanSaveData(
        newTabs,
        state.filters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
