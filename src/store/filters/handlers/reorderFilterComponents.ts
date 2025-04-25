/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderFilterComponents.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ReorderFilterComponents handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { EFiltersAction } from '../actions';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { checkCanSaveData, TFiltersStoreState } from '../data';
import { DraggableList } from '@/components/ui/lists/DraggableList';

type TReorderFilterComponentsPayload = {
  targetFilterId: UUID;
  activeId: UUID;
  overId: UUID;
};

export type TReorderFilterComponentsAction = {
  type: EFiltersAction.ReorderFilterComponents;
  payload: TReorderFilterComponentsPayload;
};

export const reorderFilterComponents: IBasicStoreHandler<
  TFiltersStoreState,
  TReorderFilterComponentsPayload,
  EFiltersAction,
  [targetFilterId: UUID, activeId: UUID, overId: UUID]
> = {
  dispatch: (targetFilterId, activeId, overId) =>
    basicDispatcher(EFiltersAction.ReorderFilterComponents, () => ({
      targetFilterId,
      activeId,
      overId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, activeId, overId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      componentIDs: DraggableList.reorderIds(oldFilter.componentIDs, activeId, overId),
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
