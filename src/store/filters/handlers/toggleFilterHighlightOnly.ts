/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterHighlight.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description ToggleFilterHighlight handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleFilterHighlightPayload = {
  targetFilterId: UUID;
};

export interface ToggleFilterHighlightAction {
  type: ActionType.ToggleFilterHighlightOnly;
  payload: ToggleFilterHighlightPayload;
}

export const toggleFilterHighlightOnly: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterHighlightPayload,
  ActionType
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterHighlightOnly, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isHighlightOnly: !oldFilter.isHighlightOnly,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
