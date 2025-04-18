/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description AddNewFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
import { ActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, IDefaultState } from '../data';

type AddNewFilterPayload = {
  targetTabId: UUID;
};

export interface AddNewFilterAction {
  type: typeof ActionType.AddNewFilter;
  payload: AddNewFilterPayload;
}

export const addNewFilter: IBasicStoreHandler<IDefaultState, AddNewFilterPayload, ActionType> = {
  dispatch: (targetTabId: UUID) =>
    basicDispatcher(ActionType.AddNewFilter, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const newComponent = DefaultFactory.makeFilterComponent();
    const newComponents = [...state.components, newComponent];

    const newFilter = DefaultFactory.makeFilter([newComponent]);
    const newFilters = [...state.filters, newFilter];

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: [...tab.filterIDs, newFilter.id],
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
