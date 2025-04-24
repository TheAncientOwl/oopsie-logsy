/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterTabName.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description SetFilterTabName handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetFilterTabNamePayload = {
  targetTabId: UUID;
  name: string;
};

export type TSetFilterTabNameAction = {
  type: EFiltersAction.SetFilterTabName;
  payload: TSetFilterTabNamePayload;
};

export const setFilterTabName: IBasicStoreHandler<
  TFiltersStoreState,
  TSetFilterTabNamePayload,
  EFiltersAction
> = {
  dispatch: (targetTabId: UUID, name: string) =>
    basicDispatcher(EFiltersAction.SetFilterTabName, () => ({ targetTabId, name })),

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
