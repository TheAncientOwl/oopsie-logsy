/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description AddNewFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, DefaultFactory, IDefaultState, TFilter } from '../data';

type AddNewFilterPayload = {
  targetTabId: string;
  filter: TFilter;
};

export interface AddNewFilterAction {
  type: typeof ActionType.AddNewFilter;
  payload: AddNewFilterPayload;
}

export const addNewFilter: IBasicStoreHandler<IDefaultState, AddNewFilterPayload, ActionType> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.AddNewFilter, () => ({
      targetTabId,
      filter: DefaultFactory.makeFilter(),
    })),

  reduce: (state, payload) => {
    const { targetTabId, filter } = payload;

    const newTabs = state.filterTabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filters: [...tab.filters, filter],
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
