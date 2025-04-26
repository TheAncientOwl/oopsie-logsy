/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterHighlight.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description ToggleFilterHighlight handler.
 */

import { modifyWhereId, type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { checkCanSaveData, type TStoreState } from '../data';

const action = EActionType.ToggleFilterHighlightOnly;

type TToggleFilterHighlightPayload = {
  targetFilterId: UUID;
};

export type TPayload = TStoreAction<typeof action, TToggleFilterHighlightPayload>;

export const toggleFilterHighlightOnly: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TToggleFilterHighlightPayload,
  [targetFilterId: UUID]
> = {
  action,

  dispatch: targetFilterId => basicDispatcher(action, () => ({ targetFilterId })),

  reduce: (state, payload) => {
    const { targetFilterId } = payload;

    const newFilters = modifyWhereId(state.filters, targetFilterId, oldFilter => ({
      ...oldFilter,
      isHighlightOnly: !oldFilter.isHighlightOnly,
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
