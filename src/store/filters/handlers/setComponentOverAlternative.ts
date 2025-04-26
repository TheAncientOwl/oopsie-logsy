/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentOverAlternative.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description SetComponentOverAlternative handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterComponentOverAlternative;

type TPayload = {
  targetComponentId: UUID;
  overAlternativeId: UUID;
};

export type TSetComponentOverAlternativeAction = TStoreAction<typeof action, TPayload>;

export const setComponentOverAlternative: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetComponentId: UUID, overAlternativeId: UUID]
> = {
  action,

  dispatch: (targetComponentId, overAlternativeId) =>
    basicDispatcher(action, () => ({
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
      canSaveData: checkCanSaveData(
        state.tabs,
        state.filters,
        newComponents,
        state.overAlternatives
      ),
    };
  },
};
