/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterTabName.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description SetFilterTabName handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';
import { UUID } from '@/store/common/types';

type SetFilterTabNamePayload = {
  targetTabId: UUID;
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
  dispatch: (targetTabId: UUID, name: string) =>
    basicDispatcher(ActionType.SetFilterTabName, () => ({ targetTabId, name })),

  reduce: (state, payload) => {
    const { targetTabId, name } = payload;

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            name,
          }
    );

    return {
      ...state,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, state.filters, state.components),
    };
  },
};
