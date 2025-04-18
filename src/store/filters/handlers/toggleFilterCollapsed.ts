/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description toggleFilterCollapsed handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleFilterCollapsedPayload = {
  targetFilterId: UUID;
};

export interface ToggleFilterCollapsedAction {
  type: ActionType.ToggleFilterCollapsed;
  payload: ToggleFilterCollapsedPayload;
}

export const toggleFilterCollapsed: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterCollapsedPayload,
  ActionType
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterCollapsed, () => ({
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = state.filters.map(filter =>
      filter.id !== targetFilterId
        ? filter
        : {
            ...filter,
            collapsed: !filter.collapsed,
          }
    );

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
