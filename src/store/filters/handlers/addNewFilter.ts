/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description AddNewFilter handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { DefaultFactory, IDefaultState, TFilter } from '../data';

export type AddNewFilterPayload = {
  targetTabId: string;
  filter: TFilter;
};

export interface AddNewFilterAction {
  type: typeof ActionType.FilterAdd;
  payload: AddNewFilterPayload;
}

export const addNewFilter: IStoreHandler<IDefaultState, AddNewFilterPayload, ActionType> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.FilterAdd, () => ({
      targetTabId,
      filter: DefaultFactory.makeFilter(),
    })),

  reduce: (state, payload) => {
    const { targetTabId, filter } = payload;

    return {
      ...state,
      filterTabs: state.filterTabs.map(tab =>
        tab.id !== targetTabId
          ? tab
          : {
              ...tab,
              filters: [...tab.filters, filter],
            }
      ),
    };
  },
};
