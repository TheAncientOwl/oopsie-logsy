/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setFilterBg.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description SetFilterBg handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.SetFilterBg;

type TPayload = {
  targetFilterId: UUID;
  color: string;
};

export type TSetFilterBgAction = TStoreAction<typeof action, TPayload>;

export const setFilterBg: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetFilterId: UUID, color: string]
> = {
  action,

  dispatch: (targetFilterId, color) => basicDispatcher(action, () => ({ targetFilterId, color })),

  reduce: (state, payload) => {
    const { targetFilterId, color } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      colors: {
        ...oldFilter.colors,
        bg: color,
      },
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
