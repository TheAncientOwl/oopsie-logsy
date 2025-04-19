/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentOverAlternative.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description SetComponentOverAlternative handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

type SetComponentOverAlternativePayload = {
  targetComponentId: UUID;
  overAlternativeId: UUID;
};

export interface SetComponentOverAlternativeAction {
  type: ActionType.SetFilterComponentOverAlternative;
  payload: SetComponentOverAlternativePayload;
}

export const setComponentOverAlternative: IBasicStoreHandler<
  IDefaultState,
  SetComponentOverAlternativePayload,
  ActionType
> = {
  dispatch: (targetComponentId: UUID, overAlternativeId: UUID) =>
    basicDispatcher(ActionType.SetFilterComponentOverAlternative, () => ({
      targetComponentId,
      overAlternativeId,
    })),

  reduce: (state, payload) => {
    const { targetComponentId, overAlternativeId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      overAlternativeId,
    }));

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
