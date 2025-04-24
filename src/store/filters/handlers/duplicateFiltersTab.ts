/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file duplicateFiltersTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description DuplicateFiltersTab handler.
 */

import { uuid, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import {
  checkCanSaveData,
  getFilterById,
  getFilterComponentById,
  type TFiltersStoreState,
  type TFilterTab,
} from '../data';

type TDuplicateFiltersTabPayload = {
  targetTabId: string;
};

export type TDuplicateFiltersTabAction = {
  type: EFiltersAction.DuplicateFiltersTab;
  payload: TDuplicateFiltersTabPayload;
};

export const duplicateFiltersTab: IBasicStoreHandler<
  TFiltersStoreState,
  TDuplicateFiltersTabPayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(EFiltersAction.DuplicateFiltersTab, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const newComponents = [...state.components];
    const newFilters = [...state.filters];
    const newTabs: Array<TFilterTab> = [];

    let newFocusedTabId = state.focusedTabId;

    // build new tabs
    state.tabs.forEach(tab => {
      // push original tab
      newTabs.push(tab);

      // dupe if ID matches
      if (tab.id === targetTabId) {
        const dupedTab = structuredClone(tab);
        dupedTab.id = uuid();
        dupedTab.name = `${dupedTab.name}*`;

        newFocusedTabId = dupedTab.id;

        // dupe filters
        const dupedFiltersIds: Array<UUID> = [];
        dupedTab.filterIDs.forEach(filterId => {
          const dupedFilter = structuredClone(
            getFilterById(`duplicateFiltersTab::reduce`, state.filters, filterId)
          );
          dupedFilter.id = uuid();

          // dupe components
          const dupedComponentIds: Array<UUID> = [];
          dupedFilter.componentIDs.forEach(componentId => {
            const dupedComponent = structuredClone(
              getFilterComponentById(`duplicateFiltersTab::reduce`, state.components, componentId)
            );
            dupedComponent.id = uuid();

            // add duped component
            dupedComponentIds.push(dupedComponent.id);
            newComponents.push(dupedComponent);
          });
          dupedFilter.componentIDs = dupedComponentIds;

          // add duped filter
          dupedFiltersIds.push(dupedFilter.id);
          newFilters.push(dupedFilter);
        });
        dupedTab.filterIDs = dupedFiltersIds;

        // add duped tab
        newTabs.push(dupedTab);
      }
    });

    console.assertX(
      duplicateFiltersTab.reduce.name,
      newFocusedTabId !== state.focusedTabId,
      `Failed to change focus tab ID when duplicating tab with ID ${targetTabId}`
    );

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
      focusedTabId: newFocusedTabId,
    };
  },
};
