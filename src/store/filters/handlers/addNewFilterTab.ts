/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description AddNewFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, IDefaultState } from '../data';

type AddNewFilterTabPayload = {};

export interface AddNewFilterTabAction {
  type: typeof ActionType.AddNewFilterTab;
  payload: AddNewFilterTabPayload;
}

export const addNewFilterTab: IBasicStoreHandler<
  IDefaultState,
  AddNewFilterTabPayload,
  ActionType
> = {
  dispatch: () => basicDispatcher(ActionType.AddNewFilterTab, () => ({})),

  reduce: state => {
    const newComponent = DefaultFactory.makeFilterComponent();
    const newFilter = DefaultFactory.makeFilter([newComponent]);
    const newTab = DefaultFactory.makeFilterTab([newFilter]);

    const newComponents = [...state.components, newComponent];
    const newFilters = [...state.filters, newFilter];
    const newTabs = [...state.tabs, newTab];

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents),
      focusedTabId: newTab.id,
    };
  },
};
