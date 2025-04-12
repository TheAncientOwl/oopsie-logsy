/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description DeleteFilterTab handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { defaultFilterTabs, IDefaultState } from '../data';

export type DeleteFilterTabPayload = {
  targetId: string;
};

export interface DeleteFilterTabAction {
  type: typeof ActionType.FilterTabDelete;
  payload: DeleteFilterTabPayload;
}

export const deleteFilterTab: IStoreHandler<IDefaultState, DeleteFilterTabPayload, ActionType> = {
  dispatch: (targetId: string) => basicDispatcher(ActionType.FilterTabDelete, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    let newFocusIndex = 0;
    const newTabs = state.filterTabs.filter((tab, idx) => {
      if (tab.id === targetId) {
        newFocusIndex = idx;
      }
      return tab.id !== targetId;
    });
    newFocusIndex = Math.min(newFocusIndex, newTabs.length - 1);

    return {
      ...state,
      filterTabs: newTabs.length > 0 ? newTabs : defaultFilterTabs,
      focusedTabId: newFocusIndex >= 0 ? newTabs[newFocusIndex].id : defaultFilterTabs[0].id,
    };
  },
};
