/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file unmuteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description UnmuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, getTabById, type TFiltersStoreState } from '../data';

type TUnmuteAllFiltersPayload = {
  targetTabId: UUID;
};

export type TUnmuteAllFiltersAction = {
  type: EFiltersAction.UnmuteAllFilters;
  payload: TUnmuteAllFiltersPayload;
};

export const unmuteAllFilters: IBasicStoreHandler<
  TFiltersStoreState,
  TUnmuteAllFiltersPayload,
  EFiltersAction,
  [targetTabId: UUID]
> = {
  dispatch: targetTabId =>
    basicDispatcher(EFiltersAction.UnmuteAllFilters, () => ({ targetTabId })),

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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
