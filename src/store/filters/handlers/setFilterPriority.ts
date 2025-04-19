/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterPriority.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetFilterPriority handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type SetFilterPriorityPayload = {
  targetFilterId: UUID;
  priority: number;
};

export interface SetFilterPriorityAction {
  type: ActionType.SetFilterPriority;
  payload: SetFilterPriorityPayload;
}

export const setFilterPriority: IBasicStoreHandler<
  IDefaultState,
  SetFilterPriorityPayload,
  ActionType
> = {
  dispatch: (targetFilterId: string, priority: number) =>
    basicDispatcher(ActionType.SetFilterPriority, () => ({
      targetFilterId,
      priority,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, priority } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      priority,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
