/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsEquals.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description ToggleComponentIsEquals handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type ToggleComponentIsEqualsPayload = {
  targetComponentId: UUID;
};

export interface ToggleComponentIsEqualsAction {
  type: ActionType.ToggleFilterComponentIsEquals;
  payload: ToggleComponentIsEqualsPayload;
}

export const toggleComponentIsEquals: IBasicStoreHandler<
  IDefaultState,
  ToggleComponentIsEqualsPayload,
  ActionType
> = {
  dispatch: (targetComponentId: UUID) =>
    basicDispatcher(ActionType.ToggleFilterComponentIsEquals, () => ({ targetComponentId })),

  reduce: (state, payload) => {
    const { targetComponentId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      isEquals: !oldComponent.isEquals,
    }));

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
