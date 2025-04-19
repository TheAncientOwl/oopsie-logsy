/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterBg.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetFilterBg handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type SetFilterBgPayload = {
  targetFilterId: UUID;
  color: string;
};

export interface SetFilterBgAction {
  type: ActionType.SetFilterBg;
  payload: SetFilterBgPayload;
}

export const setFilterBg: IBasicStoreHandler<IDefaultState, SetFilterBgPayload, ActionType> = {
  dispatch: (targetFilterId: UUID, color: string) =>
    basicDispatcher(ActionType.SetFilterBg, () => ({ targetFilterId, color })),

  reduce: (state, payload) => {
    const { targetFilterId, color } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      colors: {
        ...oldFilter.colors,
        bg: color,
      },
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
