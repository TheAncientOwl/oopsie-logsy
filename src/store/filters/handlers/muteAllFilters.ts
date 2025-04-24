/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file muteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description MuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, getTabById, type TFiltersStoreState } from '../data';

type TMuteAllFiltersPayload = {
  targetTabId: UUID;
};

export type TMuteAllFiltersAction = {
  type: EFiltersAction.MuteAllFilters;
  payload: TMuteAllFiltersPayload;
};

export const muteAllFilters: IBasicStoreHandler<
  TFiltersStoreState,
  TMuteAllFiltersPayload,
  EFiltersAction,
  [targetTabId: UUID]
> = {
  dispatch: targetTabId => basicDispatcher(EFiltersAction.MuteAllFilters, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToMute = getTabById(`muteAllFilters::reduce`, state.tabs, targetTabId).filterIDs;

    const newFilters = modifyWhereIdAnyOf(state.filters, filterIdsToMute, oldFilter => ({
      ...oldFilter,
      isActive: false,
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
