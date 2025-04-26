/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description ReoderdFilters handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, TStoreState } from '../data';

const action = EActionType.ReorderFilters;

type TPayload = {
  targetTabId: UUID;
  activeId: UUID;
  overId: UUID;
};

export type TReorderFiltersAction = TStoreAction<typeof action, TPayload>;

export const reorderFilters: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID, activeId: UUID, overId: UUID]
> = {
  action,

  dispatch: (targetTabId, activeId, overId) =>
    basicDispatcher(action, () => ({
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
