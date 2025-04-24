/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterComponentIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description ToggleFilterComponentIgnoreCase handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleFilterComponentIgnoreCasePayload = {
  targetComponentId: UUID;
};

export type ToggleFilterComponentIgnoreCaseAction = {
  type: EFiltersAction.ToggleFilterComponentIgnoreCase;
  payload: ToggleFilterComponentIgnoreCasePayload;
};

export const toggleFilterComponentIgnoreCase: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleFilterComponentIgnoreCasePayload,
  EFiltersAction
> = {
  dispatch: (targetComponentId: UUID) =>
    basicDispatcher(EFiltersAction.ToggleFilterComponentIgnoreCase, () => ({
      targetComponentId,
    })),

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
