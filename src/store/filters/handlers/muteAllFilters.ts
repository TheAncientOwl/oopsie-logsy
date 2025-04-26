/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file muteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description MuteAllFilters handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, getTabById, type TStoreState } from '../data';

const action = EActionType.MuteAllFilters;

type TPayload = {
  targetTabId: UUID;
};

export type TMuteAllFiltersAction = TStoreAction<typeof action, TPayload>;

export const muteAllFilters: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

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
