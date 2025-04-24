/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterPriority.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description SetFilterPriority handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetFilterPriorityPayload = {
  targetFilterId: UUID;
  priority: number;
};

export type TSetFilterPriorityAction = {
  type: EFiltersAction.SetFilterPriority;
  payload: TSetFilterPriorityPayload;
};

export const setFilterPriority: IBasicStoreHandler<
  TFiltersStoreState,
  TSetFilterPriorityPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: string, priority: number) =>
    basicDispatcher(EFiltersAction.SetFilterPriority, () => ({
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
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
