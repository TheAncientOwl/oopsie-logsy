/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterComponent.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description DeleteFilterComponent.ts.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { modifyWhereId, remove, removeById, UUID } from '@/store/common/identifier';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TDeleteFilterComponentPayload = {
  targetFilterId: UUID;
  targetComponentId: UUID;
};

export type TDeleteFilterComponentAction = {
  type: EFiltersAction.DeleteFilterComponent;
  payload: TDeleteFilterComponentPayload;
};

export const deleteFilterComponent: IBasicStoreHandler<
  TFiltersStoreState,
  TDeleteFilterComponentPayload,
  EFiltersAction
> = {
  dispatch: (targetFilterId: UUID, targetComponentId: UUID) =>
    basicDispatcher(EFiltersAction.DeleteFilterComponent, () => ({
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
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
