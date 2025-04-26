/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description AddFilterComponent.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type TStoreAction,
  type IBasicStoreHandler,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, DefaultFactory, type TStoreState } from '../data';

const action = EActionType.AddNewFilterComponent;

type TPayload = {
  targetFilterId: UUID;
};

export type TAddNewFilterComponentAction = TStoreAction<typeof action, TPayload>;

export const addNewFilterComponent: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID]
> = {
  action,

  dispatch: targetFilterId =>
    basicDispatcher(addNewFilterComponent.action, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newComponent = DefaultFactory.makeFilterComponent();
    const newComponents = [...state.components, newComponent];

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      componentIDs: [...oldFilter.componentIDs, newComponent.id],
    }));

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      canSaveData: checkCanSaveData(state.tabs, newFilters, newComponents, state.overAlternatives),
    };
  },
};
