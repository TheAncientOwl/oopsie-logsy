/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderTabs.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ReorderTabs handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, TFiltersStoreState } from '../data';

type TReorderTabsPayload = {
  activeId: UUID;
  overId: UUID;
};

export type TReorderTabsAction = {
  type: EFiltersAction.ReorderFilterTabs;
  payload: TReorderTabsPayload;
};

export const reorderTabs: IBasicStoreHandler<
  TFiltersStoreState,
  TReorderTabsPayload,
  EFiltersAction,
  [activeId: UUID, overId: UUID]
> = {
  dispatch: (activeId, overId) =>
    basicDispatcher(EFiltersAction.ReorderFilterTabs, () => ({
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
