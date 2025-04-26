/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description AddNewFilterTab handler.
 */

import {
  basicDispatcher,
  type TStoreAction,
  type IBasicStoreHandler,
  type TNoDispatcherArgs,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, type TStoreState } from '../data';

const action = EActionType.AddNewFilterTab;

type TPayload = {};

export type TAddNewFilterTabAction = TStoreAction<typeof action, TPayload>;

export const addNewFilterTab: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  TNoDispatcherArgs
> = {
  action,

  dispatch: () => basicDispatcher(action, () => ({})),

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
