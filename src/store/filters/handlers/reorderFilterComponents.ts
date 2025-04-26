/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reorderFilterComponents.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ReorderFilterComponents handler.
 */

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ReorderFilterComponents;

type TPayload = {
  targetFilterId: UUID;
  activeId: UUID;
  overId: UUID;
};

export type TReorderFilterComponentsAction = TStoreAction<typeof action, TPayload>;

export const reorderFilterComponents: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID, activeId: UUID, overId: UUID]
> = {
  action,

  dispatch: (targetFilterId, activeId, overId) =>
    basicDispatcher(action, () => ({
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
