/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterActive.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ToggleFilterActive handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type ToggleFilterActivePayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterActiveAction {
  type: ActionType.FilterToggleActive;
  payload: ToggleFilterActivePayload;
}

export const toggleFilterActive: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterActivePayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.FilterToggleActive, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    return {
      ...state,
      filterTabs: state.filterTabs.map(tab =>
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
      ),
    };
  },
};
