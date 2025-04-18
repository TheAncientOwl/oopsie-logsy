/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsEquals.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description ToggleComponentIsEquals handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

    const newComponents = state.components.map(component =>
      component.id !== targetComponentId
        ? component
        : {
            ...component,
            isEquals: !component.isEquals,
          }
    );

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
