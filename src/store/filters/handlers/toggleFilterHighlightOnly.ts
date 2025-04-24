/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterHighlight.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description ToggleFilterHighlight handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleFilterHighlightPayload = {
  targetFilterId: UUID;
};

export type ToggleFilterHighlightAction = {
  type: EFiltersAction.ToggleFilterHighlightOnly;
  payload: ToggleFilterHighlightPayload;
};

export const toggleFilterHighlightOnly: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleFilterHighlightPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(EFiltersAction.ToggleFilterHighlightOnly, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isHighlightOnly: !oldFilter.isHighlightOnly,
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
