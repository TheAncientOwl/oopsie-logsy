/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description DeleteFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type DeleteFilterPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface DeleteFilterAction {
  type: typeof ActionType.DeleteFilter;
  payload: DeleteFilterPayload;
}

export const deleteFilter: IBasicStoreHandler<IDefaultState, DeleteFilterPayload, ActionType> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.DeleteFilter, () => ({
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
      component => componentIdsToRemove.find(id => component.id === id) === undefined
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
