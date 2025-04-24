/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description DeleteFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { contains, UUID } from '@/store/common/identifier';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TDeleteFilterPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export type TDeleteFilterAction = {
  type: typeof EFiltersAction.DeleteFilter;
  payload: TDeleteFilterPayload;
};

export const deleteFilter: IBasicStoreHandler<
  TFiltersStoreState,
  TDeleteFilterPayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(EFiltersAction.DeleteFilter, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: tab.filterIDs.filter(filterId => filterId !== targetFilterId),
          }
    );

    let componentIdsToRemove: Array<UUID> = [];

    const newFilters = state.filters.filter(filter => {
      if (filter.id !== targetFilterId) {
        return true;
      } else {
        componentIdsToRemove = filter.componentIDs;
        return false;
      }
    });

    const newComponents = state.components.filter(
      component => !contains(componentIdsToRemove, component.id)
    );

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
