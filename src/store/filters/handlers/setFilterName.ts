/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterName.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description SetFilterName handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterName;

type TPayload = {
  targetFilterId: UUID;
  name: string;
};

export type TSetFilterNameAction = TStoreAction<typeof action, TPayload>;

export const setFilterName: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID, name: string]
> = {
  action,

  dispatch: (targetFilterId, name) =>
    basicDispatcher(action, () => ({
      targetFilterId,
      name,
    })),

  reduce: (state, payload) => {
    const { targetFilterId, name } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      name,
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
