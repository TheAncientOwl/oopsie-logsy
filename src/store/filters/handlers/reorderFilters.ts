/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ReoderdFilters handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, TFiltersStoreState } from '../data';

type TReorderFiltersPayload = {
  targetTabId: UUID;
  activeId: UUID;
  overId: UUID;
};

export type TReorderFiltersAction = {
  type: EFiltersAction.ReorderFilters;
  payload: TReorderFiltersPayload;
};

export const reorderFilters: IBasicStoreHandler<
  TFiltersStoreState,
  TReorderFiltersPayload,
  EFiltersAction,
  [targetTabId: UUID, activeId: UUID, overId: UUID]
> = {
  dispatch: (targetTabId, activeId, overId) =>
    basicDispatcher(EFiltersAction.ReorderFilters, () => ({
      targetTabId,
      activeId,
      overId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, activeId, overId } = payload;

    const newTabs = modifyWhereId(state.tabs, targetTabId, oldTab => ({
      ...oldTab,
      filterIDs: DraggableList.reorderIds(oldTab.filterIDs, activeId, overId),
    }));

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
