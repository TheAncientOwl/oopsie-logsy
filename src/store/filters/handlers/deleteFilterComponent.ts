/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterComponent.ts
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description DeleteFilterComponent.ts.
 */

import { modifyWhereId, remove, removeById, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.DeleteFilterComponent;

type TPayload = {
  targetFilterId: UUID;
  targetComponentId: UUID;
};

export type TDeleteFilterComponentAction = TStoreAction<typeof action, TPayload>;

export const deleteFilterComponent: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID, targetComponentId: UUID]
> = {
  action,

  dispatch: (targetFilterId, targetComponentId) =>
    basicDispatcher(action, () => ({
      targetFilterId,
      targetComponentId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, targetComponentId } = payload;

    const newComponents = removeById(state.components, targetComponentId);

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      componentIDs: remove(oldFilter.componentIDs, targetComponentId),
    }));

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
