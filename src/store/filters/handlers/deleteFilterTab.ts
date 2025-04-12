/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description DeleteFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, defaultFilterTabs, IDefaultState } from '../data';

type DeleteFilterTabPayload = {
  targetId: string;
};

export interface DeleteFilterTabAction {
  type: typeof ActionType.DeleteFilterTab;
  payload: DeleteFilterTabPayload;
}

export const deleteFilterTab: IBasicStoreHandler<
  IDefaultState,
  DeleteFilterTabPayload,
  ActionType
> = {
  dispatch: (targetId: string) => basicDispatcher(ActionType.DeleteFilterTab, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    let newFocusIndex = 0;
    let newTabs = state.filterTabs.filter((tab, idx) => {
      if (tab.id === targetId) {
        newFocusIndex = idx;
      }
      return tab.id !== targetId;
    });

    newTabs = newTabs.length > 0 ? newTabs : defaultFilterTabs;

    newFocusIndex = Math.min(newFocusIndex, newTabs.length - 1);

    return {
      ...state,
      filterTabs: newTabs,
      focusedTabId: newTabs[newFocusIndex].id,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
