/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterName.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description SetFilterName handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetFilterNamePayload = {
  targetFilterId: UUID;
  name: string;
};

export type TSetFilterNameAction = {
  type: EFiltersAction.SetFilterName;
  payload: TSetFilterNamePayload;
};

export const setFilterName: IBasicStoreHandler<
  TFiltersStoreState,
  TSetFilterNamePayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID, name: string) =>
    basicDispatcher(EFiltersAction.SetFilterName, () => ({
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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
