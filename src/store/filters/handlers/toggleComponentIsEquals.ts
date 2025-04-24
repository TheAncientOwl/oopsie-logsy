/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsEquals.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description ToggleComponentIsEquals handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleComponentIsEqualsPayload = {
  targetComponentId: UUID;
};

export type ToggleComponentIsEqualsAction = {
  type: EFiltersAction.ToggleFilterComponentIsEquals;
  payload: ToggleComponentIsEqualsPayload;
};

export const toggleComponentIsEquals: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleComponentIsEqualsPayload,
  EFiltersAction
> = {
  dispatch: (targetComponentId: UUID) =>
    basicDispatcher(EFiltersAction.ToggleFilterComponentIsEquals, () => ({ targetComponentId })),

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
