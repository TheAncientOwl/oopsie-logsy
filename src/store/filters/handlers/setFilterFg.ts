/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterFg.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetFilterFg handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetFilterFgPayload = {
  targetTabId: string;
  targetFilterId: string;
  color: string;
};

export interface SetFilterFgAction {
  type: ActionType.SetFilterFg;
  payload: SetFilterFgPayload;
}

export const setFilterFg: IBasicStoreHandler<IDefaultState, SetFilterFgPayload, ActionType> = {
  dispatch: (targetTabId: string, targetFilterId: string, color: string) =>
    basicDispatcher(ActionType.SetFilterFg, () => ({ targetTabId, targetFilterId, color })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, color } = payload;

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
                    colors: { ...filter.colors, fg: color },
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
