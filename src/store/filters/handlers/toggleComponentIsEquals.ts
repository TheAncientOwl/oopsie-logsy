/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsEquals.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description ToggleComponentIsEquals handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ToggleFilterComponentIsEquals;

type TPayload = {
  targetComponentId: UUID;
};

export type TToggleComponentIsEqualsAction = TStoreAction<typeof action, TPayload>;

export const toggleComponentIsEquals: IBasicStoreHandler<
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
      isEquals: !oldComponent.isEquals,
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
