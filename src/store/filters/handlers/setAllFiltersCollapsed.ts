/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setAllFiltersCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description setAllFiltersCollapsed handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetAllFiltersCollapsedPayload = {
  targetTabId: string;
  collapsed: boolean;
};

export interface SetAllFiltersCollapsedAction {
  type: ActionType.SetAllFiltersCollapsed;
  payload: SetAllFiltersCollapsedPayload;
}

export const setAllFiltersCollapsed: IBasicStoreHandler<
  IDefaultState,
  SetAllFiltersCollapsedPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, collapsed: boolean) =>
    basicDispatcher(ActionType.SetAllFiltersCollapsed, () => ({
      targetTabId,
      collapsed,
    })),

  reduce: (state, payload) => {
    const { targetTabId, collapsed } = payload;

    const newTabs = state.filterTabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filters: tab.filters.map(filter => ({ ...filter, collapsed: collapsed })),
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
