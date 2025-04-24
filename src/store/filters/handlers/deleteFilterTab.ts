/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description DeleteFilterTab handler.
 */

import { contains, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, DefaultFactory, type TFiltersStoreState } from '../data';

type TDeleteFilterTabPayload = {
  targetTabId: string;
};

export type TDeleteFilterTabAction = {
  type: typeof EFiltersAction.DeleteFilterTab;
  payload: TDeleteFilterTabPayload;
};

export const deleteFilterTab: IBasicStoreHandler<
  TFiltersStoreState,
  TDeleteFilterTabPayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(EFiltersAction.DeleteFilterTab, () => ({ targetTabId })),

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
      if (contains(filterIdsToDelete, filter.id)) {
        filter.componentIDs.forEach(componentId => componentIdsToDelete.push(componentId));
        return false;
      } else {
        return true;
      }
    });

    const newComponents = state.components.filter(
      component => !contains(componentIdsToDelete, component.id)
    );

    newFocusIndex = Math.min(newFocusIndex, newTabs.length - 1);

    console.infoX(
      deleteFilterTab.reduce.name,
      `new focus index: ${newFocusIndex}`,
      newTabs[newFocusIndex]
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
        canSaveData: checkCanSaveData(
          defaultTabs,
          defaultFilters,
          defaultComponents,
          state.overAlternatives
        ),
        focusedTabId: defaultTab.id,
      };
    } else {
      return {
        ...state,
        components: newComponents,
        filters: newFilters,
        tabs: newTabs,
        canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
        focusedTabId: newTabs[newFocusIndex].id,
      };
    }
  },
};
