/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description AddNewFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { DefaultFactory, IDefaultState, TFilterTab } from '../data';

type AddNewFilterTabPayload = {
  tab: TFilterTab;
};

export interface AddNewFilterTabAction {
  type: typeof ActionType.AddNewFilterTab;
  payload: AddNewFilterTabPayload;
}

export const addNewFilterTab: IBasicStoreHandler<
  IDefaultState,
  AddNewFilterTabPayload,
  ActionType
> = {
  dispatch: () =>
    basicDispatcher(ActionType.AddNewFilterTab, () => ({
      tab: DefaultFactory.makeFilterTab(),
    })),

  reduce: (state, payload) => {
    const { tab } = payload;

    return {
      ...state,
      filterTabs: [...state.filterTabs, tab],
      focusedTabId: tab.id,
    };
  },
};
