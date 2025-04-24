/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setAllFiltersCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description setAllFiltersCollapsed handler.
 */

import { modifyWhereIdAnyOf, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, getTabById, type TFiltersStoreState } from '../data';

type TSetAllFiltersCollapsedPayload = {
  targetTabId: UUID;
  collapsed: boolean;
};

export type TSetAllFiltersCollapsedAction = {
  type: EFiltersAction.SetAllFiltersCollapsed;
  payload: TSetAllFiltersCollapsedPayload;
};

export const setAllFiltersCollapsed: IBasicStoreHandler<
  TFiltersStoreState,
  TSetAllFiltersCollapsedPayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: UUID, collapsed: boolean) =>
    basicDispatcher(EFiltersAction.SetAllFiltersCollapsed, () => ({
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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
