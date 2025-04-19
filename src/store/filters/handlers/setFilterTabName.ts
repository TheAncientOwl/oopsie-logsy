/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterTabName.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetFilterTabName handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

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

    const newTabs = modifyWhereId(state.tabs, targetTabId, oldTab => ({ ...oldTab, name }));

    return {
      ...state,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, state.filters, state.components),
    };
  },
};
