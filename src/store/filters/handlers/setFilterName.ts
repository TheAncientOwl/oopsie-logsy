/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterName.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description SetFilterName handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type SetFilterNamePayload = {
  targetFilterId: UUID;
  name: string;
};

export interface SetFilterNameAction {
  type: ActionType.SetFilterName;
  payload: SetFilterNamePayload;
}

export const setFilterName: IBasicStoreHandler<IDefaultState, SetFilterNamePayload, ActionType> = {
  dispatch: (targetFilterId: UUID, name: string) =>
    basicDispatcher(ActionType.SetFilterName, () => ({
      targetFilterId,
      name,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, name } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      name,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
