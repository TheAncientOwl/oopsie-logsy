/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setAllFiltersCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description setAllFiltersCollapsed handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, getTabById, IDefaultState } from '../data';

type SetAllFiltersCollapsedPayload = {
  targetTabId: UUID;
  collapsed: boolean;
};

export interface SetAllFiltersCollapsedAction {
  type: ActionType.SetAllFiltersCollapsed;
  payload: SetAllFiltersCollapsedPayload;
}

export const setAllFiltersCollapsed: IBasicStoreHandler<
  IDefaultState,
  SetAllFiltersCollapsedPayload,
  ActionType
> = {
  dispatch: (targetTabId: UUID, collapsed: boolean) =>
    basicDispatcher(ActionType.SetAllFiltersCollapsed, () => ({
      targetTabId,
      collapsed,
    })),

  reduce: (state, payload) => {
    const { targetTabId, collapsed } = payload;

    const filterIdsToSet = getTabById(
      `setAllFiltersCollapsed::reduce`,
      state.tabs,
      targetTabId
    ).filterIDs;

    const newFilters = state.filters.map(filter =>
      filterIdsToSet.find(id => id === filter.id) === undefined
        ? filter
        : {
            ...filter,
            collapsed,
          }
    );

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
