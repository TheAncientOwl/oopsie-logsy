/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description AddNewFilter handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, DefaultFactory, type TFiltersStoreState } from '../data';

type TAddNewFilterPayload = {
  targetTabId: UUID;
};

export type TAddNewFilterAction = {
  type: typeof EFiltersAction.AddNewFilter;
  payload: TAddNewFilterPayload;
};

export const addNewFilter: IBasicStoreHandler<
  TFiltersStoreState,
  TAddNewFilterPayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: UUID) =>
    basicDispatcher(EFiltersAction.AddNewFilter, () => ({ targetTabId })),

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
