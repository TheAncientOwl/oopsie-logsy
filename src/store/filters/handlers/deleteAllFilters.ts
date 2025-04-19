/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description DeleteAllFilters handler.
 */

import { contains, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
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
      if (contains(filterIdsToRemove, filter.id)) {
        filter.componentIDs.forEach(componentId => componentIdsToRemove.push(componentId));
        return false;
      } else {
        return true;
      }
    });

    const newComponents = state.components.filter(
      component => !contains(componentIdsToRemove, component.id)
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
