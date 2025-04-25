/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.2
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

    const redoFiltersCollapse = () => {
      if (state.beforeDragNotCollapsed.length > 0) {
        return state.filters.map(filter => {
          if (state.beforeDragNotCollapsed.find(id => id === filter.id) !== undefined) {
            return {
              ...filter,
              collapsed: false,
            };
          } else {
            return filter;
          }
        });
      } else {
        return state.filters;
      }
    };

    const newFilters = redoFiltersCollapse();

    return {
      ...state,
      tabs: newTabs,
      filters: newFilters,
      canSaveData: checkCanSaveData(newTabs, newFilters, state.components, state.overAlternatives),
      beforeDragNotCollapsed: [],
    };
  },
};
