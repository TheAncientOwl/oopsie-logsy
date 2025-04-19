/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description AddNewFilter handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
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

    const newTabs = modifyWhereId(state.tabs, targetTabId, oldTab => ({
      ...oldTab,
      filterIDs: [...oldTab.filterIDs, newFilter.id],
    }));

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents),
    };
  },
};
