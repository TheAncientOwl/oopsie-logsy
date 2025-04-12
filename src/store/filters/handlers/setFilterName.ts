/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterName.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description SetFilterName handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetFilterNamePayload = {
  targetTabId: string;
  targetFilterId: string;
  name: string;
};

export interface SetFilterNameAction {
  type: ActionType.SetFilterName;
  payload: SetFilterNamePayload;
}

export const setFilterName: IBasicStoreHandler<IDefaultState, SetFilterNamePayload, ActionType> = {
  dispatch: (targetTabId: string, targetFilterId: string, name: string) =>
    basicDispatcher(ActionType.SetFilterName, () => ({
      targetTabId,
      targetFilterId,
      name,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, name } = payload;

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
                    name,
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
