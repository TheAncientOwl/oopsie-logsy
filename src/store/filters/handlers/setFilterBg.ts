/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterBg.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetFilterBg handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetFilterBgPayload = {
  targetTabId: string;
  targetFilterId: string;
  color: string;
};

export interface SetFilterBgAction {
  type: ActionType.SetFilterBg;
  payload: SetFilterBgPayload;
}

export const setFilterBg: IBasicStoreHandler<IDefaultState, SetFilterBgPayload, ActionType> = {
  dispatch: (targetTabId: string, targetFilterId: string, color: string) =>
    basicDispatcher(ActionType.SetFilterBg, () => ({ targetTabId, targetFilterId, color })),

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
                    colors: { ...filter.colors, bg: color },
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
