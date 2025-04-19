/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setAllFiltersCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description setAllFiltersCollapsed handler.
 */

import { modifyWhereIdAnyOf, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
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

    const newFilters = modifyWhereIdAnyOf(state.filters, filterIdsToSet, oldFilter => ({
      ...oldFilter,
      collapsed,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
