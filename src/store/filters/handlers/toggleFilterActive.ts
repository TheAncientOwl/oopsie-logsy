/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterActive.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description ToggleFilterActive handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleFilterActivePayload = {
  targetFilterId: UUID;
};

export interface ToggleFilterActiveAction {
  type: ActionType.ToggleFilterActive;
  payload: ToggleFilterActivePayload;
}

export const toggleFilterActive: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterActivePayload,
  ActionType
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterActive, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isActive: !oldFilter.isActive,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
