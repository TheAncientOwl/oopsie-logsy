/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentOverAlternative.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description SetComponentOverAlternative handler.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { checkCanSaveData, type TFiltersStoreState } from '../data';

type TSetComponentOverAlternativePayload = {
  targetComponentId: UUID;
  overAlternativeId: UUID;
};

export type TSetComponentOverAlternativeAction = {
  type: EFiltersAction.SetFilterComponentOverAlternative;
  payload: TSetComponentOverAlternativePayload;
};

export const setComponentOverAlternative: IBasicStoreHandler<
  TFiltersStoreState,
  TSetComponentOverAlternativePayload,
  EFiltersAction
> = {
  dispatch: (targetComponentId: UUID, overAlternativeId: UUID) =>
    basicDispatcher(EFiltersAction.SetFilterComponentOverAlternative, () => ({
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
