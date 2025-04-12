/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file muteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description MuteAllFilters handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type MuteAllFiltersPayload = {
  targetTabId: string;
};

export interface MuteAllFiltersAction {
  type: ActionType.MuteAllFilters;
  payload: MuteAllFiltersPayload;
}

export const muteAllFilters: IBasicStoreHandler<IDefaultState, MuteAllFiltersPayload, ActionType> =
  {
    dispatch: (targetTabId: string) =>
      basicDispatcher(ActionType.MuteAllFilters, () => ({ targetTabId })),

    reduce: (state, payload) => {
      const { targetTabId } = payload;

      return {
        ...state,
        filterTabs: state.filterTabs.map(tab =>
          tab.id !== targetTabId
            ? tab
            : {
                ...tab,
                filters: tab.filters.map(filter => ({ ...filter, isActive: false })),
              }
        ),
      };
    },
  };
