/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description toggleFilterCollapsed handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleFilterCollapsedPayload = {
  targetFilterId: UUID;
};

export type ToggleFilterCollapsedAction = {
  type: EFiltersAction.ToggleFilterCollapsed;
  payload: ToggleFilterCollapsedPayload;
};

export const toggleFilterCollapsed: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleFilterCollapsedPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(EFiltersAction.ToggleFilterCollapsed, () => ({
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      collapsed: !oldFilter.collapsed,
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
