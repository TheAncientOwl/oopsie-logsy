/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterBg.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description SetFilterBg handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetFilterBgPayload = {
  targetFilterId: UUID;
  color: string;
};

export type TSetFilterBgAction = {
  type: EFiltersAction.SetFilterBg;
  payload: TSetFilterBgPayload;
};

export const setFilterBg: IBasicStoreHandler<
  TFiltersStoreState,
  TSetFilterBgPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID, color: string) =>
    basicDispatcher(EFiltersAction.SetFilterBg, () => ({ targetFilterId, color })),

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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
