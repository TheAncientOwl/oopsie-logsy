/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file muteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description MuteAllFilters handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

      const newFilters = state.filters.map(filter =>
        filterIdsToMute.find(id => id === filter.id) === undefined
          ? filter
          : {
              ...filter,
              isActive: false,
            }
      );

      return {
        ...state,
        filters: newFilters,
        canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
      };
    },
  };
