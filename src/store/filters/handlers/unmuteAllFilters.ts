/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file unmuteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description UnmuteAllFilters handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type UnmuteAllFiltersPayload = {
  targetTabId: string;
};

export interface UnmuteAllFiltersAction {
  type: ActionType.UnmuteAllFilters;
  payload: UnmuteAllFiltersPayload;
}

export const unmuteAllFilters: IBasicStoreHandler<
  IDefaultState,
  UnmuteAllFiltersPayload,
  ActionType
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.UnmuteAllFilters, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    return {
      ...state,
      filterTabs: state.filterTabs.map(tab =>
        tab.id !== targetTabId
          ? tab
          : {
              ...tab,
              filters: tab.filters.map(filter => ({ ...filter, isActive: true })),
            }
      ),
    };
  },
};
