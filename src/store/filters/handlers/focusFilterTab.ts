/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file focusFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description FocusFilterTab handler.
 */

import { type UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { type TFiltersStoreState } from '../data';

type TFocusFilterTabPayload = {
  targetId: UUID;
};

export type TFocusFilterTabAction = {
  type: EFiltersAction.FocusFilterTab;
  payload: TFocusFilterTabPayload;
};

export const focusFilterTab: IBasicStoreHandler<
  TFiltersStoreState,
  TFocusFilterTabPayload,
  EFiltersAction,
  [targetId: UUID]
> = {
  dispatch: targetId => basicDispatcher(EFiltersAction.FocusFilterTab, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    return {
      ...state,
      focusedTabId: targetId,
    };
  },
};
