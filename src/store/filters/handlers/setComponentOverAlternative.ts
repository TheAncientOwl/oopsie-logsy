/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentOverAlternative.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description SetComponentOverAlternative handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

    const newComponents = state.components.map(component =>
      component.id !== targetComponentId
        ? component
        : {
            ...component,
            overAlternativeId,
          }
    );

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
