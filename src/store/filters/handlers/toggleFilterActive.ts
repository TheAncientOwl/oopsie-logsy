/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterActive.ts
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description ToggleFilterActive handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ToggleFilterActive;

type TPayload = {
  targetFilterId: UUID;
};

export type TToggleFilterActiveAction = TStoreAction<typeof action, TPayload>;

export const toggleFilterActive: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID]
> = {
  action,

  dispatch: targetFilterId => basicDispatcher(action, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isActive: !oldFilter.isActive,
    }));

    return {
      ...state,
      filters: newFilters,
      canSaveData: checkCanSaveData(
        state.tabs,
        newFilters,
        state.components,
        state.overAlternatives
      ),
    };
  },
};
