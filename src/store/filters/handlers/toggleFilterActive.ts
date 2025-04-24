/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterActive.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description ToggleFilterActive handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleFilterActivePayload = {
  targetFilterId: UUID;
};

export type ToggleFilterActiveAction = {
  type: EFiltersAction.ToggleFilterActive;
  payload: ToggleFilterActivePayload;
};

export const toggleFilterActive: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleFilterActivePayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(EFiltersAction.ToggleFilterActive, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isActive: !oldFilter.isActive,
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
