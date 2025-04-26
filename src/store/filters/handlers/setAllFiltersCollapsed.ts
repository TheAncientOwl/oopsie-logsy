/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setAllFiltersCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description setAllFiltersCollapsed handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, getTabById, type TStoreState } from '../data';

const action = EActionType.SetAllFiltersCollapsed;

type TPayload = {
  targetTabId: UUID;
  collapsed: boolean;
};

export type TSetAllFiltersCollapsedAction = TStoreAction<typeof action, TPayload>;

export const setAllFiltersCollapsed: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID, collapsed: boolean]
> = {
  action,

  dispatch: (targetTabId, collapsed) =>
    basicDispatcher(action, () => ({
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
