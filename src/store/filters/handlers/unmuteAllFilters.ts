/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file unmuteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description UnmuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, getTabById, IDefaultState } from '../data';

type UnmuteAllFiltersPayload = {
  targetTabId: UUID;
};

export interface UnmuteAllFiltersAction {
  type: ActionType.UnmuteAllFilters;
  payload: UnmuteAllFiltersPayload;
}

export const unmuteAllFilters: IBasicStoreHandler<
  IDefaultState,
  UnmuteAllFiltersPayload,
  ActionType
> = {
  dispatch: (targetTabId: UUID) =>
    basicDispatcher(ActionType.UnmuteAllFilters, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToMute = getTabById(
      `unmuteAllFilters::reduce`,
      state.tabs,
      targetTabId
    ).filterIDs;

    const newFilters = modifyWhereIdAnyOf(state.filters, filterIdsToMute, oldFilter => ({
      ...oldFilter,
      isActive: true,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
