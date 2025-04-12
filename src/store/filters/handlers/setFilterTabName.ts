/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterTabName.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetFilterTabName handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetFilterTabNamePayload = {
  targetId: string;
  name: string;
};

export interface SetFilterTabNameAction {
  type: ActionType.SetFilterTabName;
  payload: SetFilterTabNamePayload;
}

export const setFilterTabName: IBasicStoreHandler<
  IDefaultState,
  SetFilterTabNamePayload,
  ActionType
> = {
  dispatch: (targetId: string, name: string) =>
    basicDispatcher(ActionType.SetFilterTabName, () => ({ targetId, name })),

  reduce: (state, payload) => {
    const { targetId, name } = payload;

    const newTabs = state.filterTabs.map(tab => (tab.id !== targetId ? tab : { ...tab, name }));

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
