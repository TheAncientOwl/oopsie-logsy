/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterTabName.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description SetFilterTabName handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterTabName;

type TPayload = {
  targetTabId: UUID;
  name: string;
};

export type TSetFilterTabNameAction = TStoreAction<typeof action, TPayload>;

export const setFilterTabName: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID, name: string]
> = {
  action,

  dispatch: (targetTabId, name) => basicDispatcher(action, () => ({ targetTabId, name })),

  reduce: (state, payload) => {
    const { targetTabId, name } = payload;

    const newTabs = modifyWhereId(state.tabs, targetTabId, oldTab => ({ ...oldTab, name }));

    return {
      ...state,
      tabs: newTabs,
      canSaveData: checkCanSaveData(
        newTabs,
        state.filters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
