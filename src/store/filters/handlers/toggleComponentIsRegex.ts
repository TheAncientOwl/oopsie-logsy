/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description ToggleComponentIsRegex handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { UUID } from '@/store/common/types';
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

    const newComponents = state.components.map(component =>
      component.id !== targetComponentId
        ? component
        : {
            ...component,
            isRegex: !component.isRegex,
          }
    );

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
