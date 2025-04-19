/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterComponent.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description DeleteFilterComponent.ts.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { modifyWhereId, remove, removeById, UUID } from '@/store/common/identifier';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type DeleteFilterComponentPayload = {
  targetFilterId: UUID;
  targetComponentId: UUID;
};

export interface DeleteFilterComponentAction {
  type: ActionType.DeleteFilterComponent;
  payload: DeleteFilterComponentPayload;
}

export const deleteFilterComponent: IBasicStoreHandler<
  IDefaultState,
  DeleteFilterComponentPayload,
  ActionType
> = {
  dispatch: (targetFilterId: UUID, targetComponentId: UUID) =>
    basicDispatcher(ActionType.DeleteFilterComponent, () => ({
      targetFilterId,
      targetComponentId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, targetComponentId } = payload;

    const newComponents = removeById(state.components, targetComponentId);

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      componentIDs: remove(oldFilter.componentIDs, targetComponentId),
    }));

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents),
    };
  },
};
