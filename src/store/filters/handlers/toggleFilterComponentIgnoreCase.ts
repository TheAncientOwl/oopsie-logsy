/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterComponentIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description ToggleFilterComponentIgnoreCase handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleFilterComponentIgnoreCasePayload = {
  targetComponentId: UUID;
};

export interface ToggleFilterComponentIgnoreCaseAction {
  type: ActionType.ToggleFilterComponentIgnoreCase;
  payload: ToggleFilterComponentIgnoreCasePayload;
}

export const toggleFilterComponentIgnoreCase: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterComponentIgnoreCasePayload,
  ActionType
> = {
  dispatch: (targetComponentId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterComponentIgnoreCase, () => ({ targetComponentId })),

  reduce: (state, payload) => {
    const { targetComponentId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      ignoreCase: !oldComponent.ignoreCase,
    }));

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
