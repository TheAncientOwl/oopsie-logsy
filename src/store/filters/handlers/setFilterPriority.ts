/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterPriority.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description SetFilterPriority handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterPriority;

type TPayload = {
  targetFilterId: UUID;
  priority: number;
};

export type TSetFilterPriorityAction = TStoreAction<typeof action, TPayload>;

export const setFilterPriority: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: string, priority: number]
> = {
  action,

  dispatch: (targetFilterId, priority) =>
    basicDispatcher(action, () => ({
      targetFilterId,
      priority,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, priority } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      priority,
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
