/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description SetComponentData handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';
import { UUID } from '@/store/common/types';

type SetComponentDataPayload = {
  targetComponentId: UUID;
  data: string;
};

export interface SetComponentDataAction {
  type: ActionType.SetFilterComponentData;
  payload: SetComponentDataPayload;
}

export const setComponentData: IBasicStoreHandler<
  IDefaultState,
  SetComponentDataPayload,
  ActionType
> = {
  dispatch: (targetComponentId: UUID, data: string) =>
    basicDispatcher(ActionType.SetFilterComponentData, () => ({
      targetComponentId,
      data,
    })),

  reduce: (state, payload) => {
    const { targetComponentId, data } = payload;

    const newComponents = state.components.map(component =>
      component.id !== targetComponentId
        ? component
        : {
            ...component,
            data,
          }
    );

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
