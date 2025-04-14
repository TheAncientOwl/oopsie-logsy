/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description toggleFilterCollapsed handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type ToggleFilterCollapsedPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterCollapsedAction {
  type: ActionType.ToggleFilterCollapsed;
  payload: ToggleFilterCollapsedPayload;
}

export const toggleFilterCollapsed: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterCollapsedPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.ToggleFilterCollapsed, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const newTabs = state.filterTabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filters: tab.filters.map(filter =>
              filter.id !== targetFilterId
                ? filter
                : {
                    ...filter,
                    collapsed: !filter.collapsed,
                  }
            ),
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
