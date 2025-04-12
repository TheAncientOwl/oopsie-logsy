/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description DeleteFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type DeleteFilterPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface DeleteFilterAction {
  type: typeof ActionType.FilterDelete;
  payload: DeleteFilterPayload;
}

export const deleteFilter: IBasicStoreHandler<IDefaultState, DeleteFilterPayload, ActionType> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.FilterDelete, () => ({
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
              filters: tab.filters.filter(filter => filter.id !== targetFilterId),
            }
      ),
    };
  },
};
