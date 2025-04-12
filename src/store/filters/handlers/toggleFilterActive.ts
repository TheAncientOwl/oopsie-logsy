/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterActive.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description ToggleFilterActive handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type ToggleFilterActivePayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterActiveAction {
  type: ActionType.ToggleFilterActive;
  payload: ToggleFilterActivePayload;
}

export const toggleFilterActive: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterActivePayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.ToggleFilterActive, () => ({
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
                    isActive: !filter.isActive,
                  }
            ),
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
    };
  },
};
