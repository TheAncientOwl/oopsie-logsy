/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file muteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description MuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, getTabById, IDefaultState } from '../data';

type MuteAllFiltersPayload = {
  targetTabId: UUID;
};

export interface MuteAllFiltersAction {
  type: ActionType.MuteAllFilters;
  payload: MuteAllFiltersPayload;
}

export const muteAllFilters: IBasicStoreHandler<IDefaultState, MuteAllFiltersPayload, ActionType> =
  {
    dispatch: (targetTabId: UUID) =>
      basicDispatcher(ActionType.MuteAllFilters, () => ({ targetTabId })),

    reduce: (state, payload) => {
      const { targetTabId } = payload;

      const filterIdsToMute = getTabById(
        `muteAllFilters::reduce`,
        state.tabs,
        targetTabId
      ).filterIDs;

      const newFilters = modifyWhereIdAnyOf(state.filters, filterIdsToMute, oldFilter => ({
        ...oldFilter,
        isActive: false,
      }));

      return {
        ...state,
        filters: newFilters,
        canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
      };
    },
  };
