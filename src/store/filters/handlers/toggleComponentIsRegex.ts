/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description ToggleComponentIsRegex handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type ToggleComponentIsRegexPayload = {
  targetComponentId: UUID;
};

export type ToggleComponentIsRegexAction = {
  type: EFiltersAction.ToggleFilterComponentIsRegex;
  payload: ToggleComponentIsRegexPayload;
};

export const toggleComponentIsRegex: IBasicStoreHandler<
  TFiltersStoreState,
  ToggleComponentIsRegexPayload,
  EFiltersAction,
  [targetComponentId: UUID]
> = {
  dispatch: targetComponentId =>
    basicDispatcher(EFiltersAction.ToggleFilterComponentIsRegex, () => ({ targetComponentId })),

  reduce: (state, payload) => {
    const { targetComponentId } = payload;

    const newComponents = modifyWhereId(state.components, targetComponentId, oldComponent => ({
      ...oldComponent,
      isRegex: !oldComponent.isRegex,
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
