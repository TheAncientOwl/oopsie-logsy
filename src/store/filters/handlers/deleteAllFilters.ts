/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description DeleteAllFilters handler.
 */

import { contains, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, getTabById, type TStoreState } from '../data';

const action = EActionType.DeleteAllFilters;

type TPayload = {
  targetTabId: UUID;
};

export type TDeleteAllFiltersAction = TStoreAction<typeof action, TPayload>;

export const deleteAllFilters: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const filterIdsToRemove = getTabById(
      `deleteAllFilters::reduce`,
      state.tabs,
      targetTabId
    ).filterIDs;

    const componentIdsToRemove: Array<UUID> = [];

    const newFilters = state.filters.filter(filter => {
      if (contains(filterIdsToRemove, filter.id)) {
        filter.componentIDs.forEach(componentId => componentIdsToRemove.push(componentId));
        return false;
      } else {
        return true;
      }
    });

    const newComponents = state.components.filter(
      component => !contains(componentIdsToRemove, component.id)
    );

    const newComponent = DefaultFactory.makeFilterComponent();
    const newFilter = DefaultFactory.makeFilter([newComponent]);

    newComponents.push(newComponent);
    newFilters.push(newFilter);

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: [newFilter.id],
          }
    );

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
