/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterCollapsed.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description toggleFilterCollapsed handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type TStoreAction,
  type IBasicStoreHandler,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ToggleFilterCollapsed;

type TPayload = {
  targetFilterId: UUID;
};

export type TToggleFilterCollapsedAction = TStoreAction<typeof action, TPayload>;

export const toggleFilterCollapsed: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID]
> = {
  action,

  dispatch: targetFilterId =>
    basicDispatcher(action, () => ({
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      collapsed: !oldFilter.collapsed,
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
