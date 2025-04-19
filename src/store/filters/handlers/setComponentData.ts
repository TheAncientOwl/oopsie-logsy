/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description SetComponentData handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, IDefaultState } from '../data';

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

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      data,
    }));

    return {
      ...state,
      components: newComponents,
      canSaveData: checkCanSaveData(state.tabs, state.filters, newComponents),
    };
  },
};
