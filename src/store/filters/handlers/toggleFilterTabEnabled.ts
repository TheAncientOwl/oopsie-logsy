/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterTabEnabled.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ToggleFilterTabEnabled handler.
 */

import { basicDispatcher, IBasicStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { modifyWhereId, UUID } from '@/store/common/identifier';
import { checkCanSaveData, TStoreState } from '../data';

const action = EActionType.ToggleFilterTabEnabled;

type TPayload = {
  targetTabId: UUID;
};

export type TSetFilterTabEnabledAction = TStoreAction<typeof action, TPayload>;

export const toggleFilterTabEnabled: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetTabId: UUID]
> = {
  action,

  dispatch: targetTabId => basicDispatcher(action, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    const newTabs = modifyWhereId(state.tabs, targetTabId, oldTab => ({
      ...oldTab,
      enabled: !oldTab.enabled,
    }));

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
