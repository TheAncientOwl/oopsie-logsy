/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description SetComponentData handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterComponentData;

type TPayload = {
  targetComponentId: UUID;
  data: string;
};

export type TSetComponentDataAction = TStoreAction<typeof action, TPayload>;

export const setComponentData: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetComponentId: UUID, data: string]
> = {
  action,

  dispatch: (targetComponentId, data) =>
    basicDispatcher(action, () => ({
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
      canSaveData: checkCanSaveData(
        state.tabs,
        state.filters,
        newComponents,
        state.overAlternatives
      ),
    };
  },
};
