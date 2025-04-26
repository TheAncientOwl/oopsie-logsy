/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterComponentIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description ToggleFilterComponentIgnoreCase handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ToggleFilterComponentIgnoreCase;

type TPayload = {
  targetComponentId: UUID;
};

export type TToggleFilterComponentIgnoreCaseAction = TStoreAction<typeof action, TPayload>;

export const toggleFilterComponentIgnoreCase: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetComponentId: UUID]
> = {
  action,

  dispatch: targetComponentId => basicDispatcher(action, () => ({ targetComponentId })),

  reduce: (state, payload) => {
    const { targetComponentId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      ignoreCase: !oldComponent.ignoreCase,
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
