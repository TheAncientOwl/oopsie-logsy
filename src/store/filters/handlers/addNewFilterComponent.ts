/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description AddFilterComponent.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, IDefaultState } from '../data';

type AddNewFilterComponentPayload = {
  targetFilterId: UUID;
};

export interface AddNewFilterComponentAction {
  type: ActionType.AddNewFilterComponent;
  payload: AddNewFilterComponentPayload;
}

export const addNewFilterComponent: IBasicStoreHandler<
  IDefaultState,
  AddNewFilterComponentPayload,
  ActionType
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(ActionType.AddNewFilterComponent, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newComponent = DefaultFactory.makeFilterComponent();
    const newComponents = [...state.components, newComponent];

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      componentIDs: [...oldFilter.componentIDs, newComponent.id],
    }));

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents),
    };
  },
};
