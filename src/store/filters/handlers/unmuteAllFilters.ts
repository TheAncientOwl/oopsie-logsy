/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file unmuteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description UnmuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, getTabById, type TStoreState } from '../data';

const action = EActionType.UnmuteAllFilters;

type TPayload = {
  targetTabId: UUID;
};

export type TUnmuteAllFiltersAction = TStoreAction<typeof action, TPayload>;

export const unmuteAllFilters: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

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
