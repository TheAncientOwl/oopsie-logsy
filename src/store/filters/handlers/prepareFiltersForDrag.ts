/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file prepareFiltersForDrag.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description PrepareFiltersForDrag handler.
 */

import { modifyWhereIdAnyOf, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type TStoreAction,
  type IBasicStoreHandler,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, getTabById, type TStoreState } from '../data';

const action = EActionType.PrepareFiltersForDrag;

type TPayload = {
  targetTabId: UUID;
};

export type TPrepareFiltersForDragAction = TStoreAction<typeof action, TPayload>;

export const prepareFiltersForDrag: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId =>
    basicDispatcher(action, () => ({
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
