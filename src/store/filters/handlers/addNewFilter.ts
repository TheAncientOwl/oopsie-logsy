/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description AddNewFilter handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, type TStoreState } from '../data';

const action = EActionType.AddNewFilter;

type TPayload = {
  targetTabId: UUID;
};

export type TAddNewFilterAction = TStoreAction<typeof action, TPayload>;

export const addNewFilter: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

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
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
