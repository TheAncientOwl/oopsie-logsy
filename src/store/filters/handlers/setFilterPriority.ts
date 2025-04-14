/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterPriority.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetFilterPriority handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetFilterPriorityPayload = {
  targetTabId: string;
  targetFilterId: string;
  priority: number;
};

export interface SetFilterPriorityAction {
  type: ActionType.SetFilterPriority;
  payload: SetFilterPriorityPayload;
}

export const setFilterPriority: IBasicStoreHandler<
  IDefaultState,
  SetFilterPriorityPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, priority: number) =>
    basicDispatcher(ActionType.SetFilterPriority, () => ({
      targetTabId,
      targetFilterId,
      priority,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, priority } = payload;

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
                    priority: priority,
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
