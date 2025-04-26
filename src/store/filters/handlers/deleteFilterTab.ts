/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description DeleteFilterTab handler.
 */

import { contains, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, type TStoreState } from '../data';

const action = EActionType.DeleteFilterTab;

type TPayload = {
  targetTabId: UUID;
};

export type TDeleteFilterTabAction = TStoreAction<typeof action, TPayload>;

export const deleteFilterTab: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

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

    console.info(
      deleteFilterTab.reduce,
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
