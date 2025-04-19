/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description ToggleComponentIsRegex handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleComponentIsRegexPayload = {
  targetComponentId: UUID;
};

export interface ToggleComponentIsRegexAction {
  type: ActionType.ToggleFilterComponentIsRegex;
  payload: ToggleComponentIsRegexPayload;
}

export const toggleComponentIsRegex: IBasicStoreHandler<
  IDefaultState,
  ToggleComponentIsRegexPayload,
  ActionType
> = {
  dispatch: (targetComponentId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterComponentIsRegex, () => ({ targetComponentId })),

  reduce: (state, payload) => {
    const { targetComponentId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      isRegex: !oldComponent.isRegex,
    }));

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
