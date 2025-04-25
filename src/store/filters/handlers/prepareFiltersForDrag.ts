/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file prepareFiltersForDrag.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description PrepareFiltersForDrag handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, getTabById, type TFiltersStoreState } from '../data';

type TPrepareFiltersForDragPayload = {
  targetTabId: UUID;
};

export type TPrepareFiltersForDragAction = {
  type: EFiltersAction.PrepareFiltersForDrag;
  payload: TPrepareFiltersForDragPayload;
};

export const prepareFiltersForDrag: IBasicStoreHandler<
  TFiltersStoreState,
  TPrepareFiltersForDragPayload,
  EFiltersAction,
  [targetTabId: UUID]
> = {
  dispatch: targetTabId =>
    basicDispatcher(EFiltersAction.PrepareFiltersForDrag, () => ({
      targetTabId,
    })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToSet = getTabById(
      `PrepareFiltersForDrag::reduce`,
      state.tabs,
      targetTabId
    ).filterIDs;

    const newBeforeDragNotCollapsed = [] as Array<UUID>;

    const newFilters = modifyWhereIdAnyOf(state.filters, filterIdsToSet, oldFilter => {
      if (!oldFilter.collapsed) {
        newBeforeDragNotCollapsed.push(oldFilter.id);
      }

      return {
        ...oldFilter,
        collapsed: true,
      };
    });

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
      beforeDragNotCollapsed: newBeforeDragNotCollapsed,
    };
  },
};
