/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterComponentIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description ToggleFilterComponentIgnoreCase handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

    const newComponents = state.components.map(component =>
      component.id !== targetComponentId
        ? component
        : {
            ...component,
            ignoreCase: !component.ignoreCase,
          }
    );

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
