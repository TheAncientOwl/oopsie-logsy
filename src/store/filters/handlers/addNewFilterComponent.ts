/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description AddFilterComponent.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, DefaultFactory, type TFiltersStoreState } from '../data';

type TAddNewFilterComponentPayload = {
  targetFilterId: UUID;
};

export type TAddNewFilterComponentAction = {
  type: EFiltersAction.AddNewFilterComponent;
  payload: TAddNewFilterComponentPayload;
};

export const addNewFilterComponent: IBasicStoreHandler<
  TFiltersStoreState,
  TAddNewFilterComponentPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID) =>
    basicDispatcher(EFiltersAction.AddNewFilterComponent, () => ({ targetFilterId })),

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
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
