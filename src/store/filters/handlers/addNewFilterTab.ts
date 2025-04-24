/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description AddNewFilterTab handler.
 */

import {
  basicDispatcher,
  IBasicStoreHandler,
  type TNoDispatcherArgs,
} from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, DefaultFactory, type TFiltersStoreState } from '../data';

type TAddNewFilterTabPayload = {};

export type TAddNewFilterTabAction = {
  type: typeof EFiltersAction.AddNewFilterTab;
  payload: TAddNewFilterTabPayload;
};

export const addNewFilterTab: IBasicStoreHandler<
  TFiltersStoreState,
  TAddNewFilterTabPayload,
  EFiltersAction,
  TNoDispatcherArgs
> = {
  dispatch: () => basicDispatcher(EFiltersAction.AddNewFilterTab, () => ({})),

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
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
      focusedTabId: newTab.id,
    };
  },
};
