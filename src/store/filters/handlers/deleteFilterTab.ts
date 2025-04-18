/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description DeleteFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, IDefaultState } from '../data';

type DeleteFilterTabPayload = {
  targetTabId: string;
};

export interface DeleteFilterTabAction {
  type: typeof ActionType.DeleteFilterTab;
  payload: DeleteFilterTabPayload;
}

export const deleteFilterTab: IBasicStoreHandler<
  IDefaultState,
  DeleteFilterTabPayload,
  ActionType
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.DeleteFilterTab, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToDelete: Array<UUID> = [];

    let newFocusIndex = 0;

    const newTabs = state.tabs.filter((tab, index) => {
      if (tab.id !== targetTabId) {
        return true;
      } else {
        newFocusIndex = index;
        tab.filterIDs.forEach(filterId => filterIdsToDelete.push(filterId));
        return false;
      }
    });

    const componentIdsToDelete: Array<UUID> = [];
    const newFilters = state.filters.filter(filter => {
      if (filterIdsToDelete.find(id => id === filter.id) === undefined) {
        return true;
      } else {
        filter.componentIDs.forEach(componentId => componentIdsToDelete.push(componentId));
        return false;
      }
    });

    const newComponents = state.components.filter(
      component => componentIdsToDelete.find(id => id === component.id) === undefined
    );

    if (newTabs.length === 0) {
      const defaultComponent = DefaultFactory.makeFilterComponent();
      const defaultComponents = [defaultComponent];

      const defaultFilter = DefaultFactory.makeFilter(defaultComponents);
      const defaultFilters = [defaultFilter];

      const defaultTab = DefaultFactory.makeFilterTab(defaultFilters);
      const defaultTabs = [defaultTab];

      return {
        ...state,
        components: defaultComponents,
        filters: defaultFilters,
        tabs: defaultTabs,
        canSaveData: checkCanSaveData(defaultTabs, defaultFilters, defaultComponents),
        focusedTabId: defaultTab.id,
      };
    } else {
      return {
        ...state,
        components: newComponents,
        filters: newFilters,
        tabs: newTabs,
        canSaveData: checkCanSaveData(newTabs, newFilters, newComponents),
        focusedTabId: newTabs[newFocusIndex].id,
      };
    }
  },
};
