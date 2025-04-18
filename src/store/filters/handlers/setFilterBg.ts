/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterBg.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description SetFilterBg handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

    const newFilters = state.filters.map(filter =>
      filter.id !== targetFilterId
        ? filter
        : {
            ...filter,
            colors: {
              ...filter.colors,
              bg: color,
            },
          }
    );

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, state.components),
    };
  },
};
