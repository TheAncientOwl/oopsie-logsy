/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterFg.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description SetFilterFg handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetFilterFgPayload = {
  targetFilterId: UUID;
  color: string;
};

export type TSetFilterFgAction = {
  type: EFiltersAction.SetFilterFg;
  payload: TSetFilterFgPayload;
};

export const setFilterFg: IBasicStoreHandler<
  TFiltersStoreState,
  TSetFilterFgPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID, color: string) =>
    basicDispatcher(EFiltersAction.SetFilterFg, () => ({ targetFilterId, color })),

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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
