/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterFg.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetFilterFg handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type SetFilterFgPayload = {
  targetFilterId: UUID;
  color: string;
};

export interface SetFilterFgAction {
  type: ActionType.SetFilterFg;
  payload: SetFilterFgPayload;
}

export const setFilterFg: IBasicStoreHandler<IDefaultState, SetFilterFgPayload, ActionType> = {
  dispatch: (targetFilterId: UUID, color: string) =>
    basicDispatcher(ActionType.SetFilterFg, () => ({ targetFilterId, color })),

  reduce: (state, payload) => {
    const { targetFilterId, color } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      colors: {
        ...oldFilter.colors,
        fg: color,
      },
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
