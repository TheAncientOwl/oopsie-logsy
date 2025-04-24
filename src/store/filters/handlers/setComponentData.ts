/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description SetComponentData handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetComponentDataPayload = {
  targetComponentId: UUID;
  data: string;
};

export type TSetComponentDataAction = {
  type: EFiltersAction.SetFilterComponentData;
  payload: TSetComponentDataPayload;
};

export const setComponentData: IBasicStoreHandler<
  TFiltersStoreState,
  TSetComponentDataPayload,
  EFiltersAction
> = {
  dispatch: (targetComponentId: UUID, data: string) =>
    basicDispatcher(EFiltersAction.SetFilterComponentData, () => ({
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
