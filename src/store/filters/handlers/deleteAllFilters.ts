/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description DeleteAllFilters handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, getTabById, IDefaultState } from '../data';

type DeleteAllFiltersPayload = {
  targetTabId: string;
};

export interface DeleteAllFiltersAction {
  type: ActionType.DeleteAllFilters;
  payload: DeleteAllFiltersPayload;
}

export const deleteAllFilters: IBasicStoreHandler<
  IDefaultState,
  DeleteAllFiltersPayload,
  ActionType
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.DeleteAllFilters, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToRemove = getTabById(
      `deleteAllFilters::reduce`,
      state.tabs,
      targetTabId
    ).filterIDs;

    const componentIdsToRemove: Array<UUID> = [];

    const newFilters = state.filters.filter(filter => {
      if (filterIdsToRemove.find(id => id === filter.id) === undefined) {
        return true;
      } else {
        filter.componentIDs.forEach(componentId => componentIdsToRemove.push(componentId));
        return false;
      }
    });

    const newComponents = state.components.filter(
      component => componentIdsToRemove.find(id => id === component.id) === undefined
    );

    const newComponent = DefaultFactory.makeFilterComponent();
    const newFilter = DefaultFactory.makeFilter([newComponent]);

    newComponents.push(newComponent);
    newFilters.push(newFilter);

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: [newFilter.id],
          }
    );

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents),
    };
  },
};
