/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteAllFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description DeleteAllFilters handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type DeleteAllFiltersPayload = {
  targetTabId: string;
};

export interface DeleteAllFiltersAction {
  type: ActionType.DeleteAllFilters;
  payload: DeleteAllFiltersPayload;
}

export const deleteAllFilters: IBasicStoreHandler<
  IDefaultState,
  DeleteAllFiltersPayload,
  ActionType
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.DeleteAllFilters, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    return {
      ...state,
      filterTabs: state.filterTabs.map(tab =>
        tab.id !== targetTabId
          ? tab
          : {
              ...tab,
              filters: [],
            }
      ),
    };
  },
};
