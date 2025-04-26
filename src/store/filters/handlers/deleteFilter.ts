/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description DeleteFilter handler.
 */

import { contains, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.DeleteFilter;

type TPayload = {
  targetTabId: UUID;
  targetFilterId: UUID;
};

export type TDeleteFilterAction = TStoreAction<typeof action, TPayload>;

export const deleteFilter: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID, targetFilterId: UUID]
> = {
  action,

  dispatch: (targetTabId, targetFilterId) =>
    basicDispatcher(action, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: tab.filterIDs.filter(filterId => filterId !== targetFilterId),
          }
    );

    let componentIdsToRemove: Array<UUID> = [];

    const newFilters = state.filters.filter(filter => {
      if (filter.id !== targetFilterId) {
        return true;
      } else {
        componentIdsToRemove = filter.componentIDs;
        return false;
      }
    });

    const newComponents = state.components.filter(
      component => !contains(componentIdsToRemove, component.id)
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
